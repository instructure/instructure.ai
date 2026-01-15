import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse } from "papaparse";
import { cache, checksum } from "../cache";
import  { type CSVFetchResult, type ChangedEntry, type Entry, type Hash } from "../types";
import { CSVURL, Log, entryToObj, writeChangelog } from "../utils";
import { WriteEntries } from "./writeEntries.mts";

const generateChecksum = (data: string): Hash => {
  const hash: Hash = createHash("shake128", { outputLength: 32 })
    .update(JSON.stringify(data))
    .digest("hex");
  return hash;
};

const updateCache = async (data: CSVFetchResult): Promise<void> => {
  Log("Validating cache integrity...");
  const checksumPath = path.resolve(__dirname, "../cache/checksum.json");
  // Use imported checksum object instead of reading file
  const checksums: Record<Entry["uid"], Hash> = { ...checksum };

  // Update overall CSV checksum
  const newCSVChecksum = generateChecksum(data.raw);
  const oldCSVChecksum = checksums.CSV;
  const isCSVOutdated = newCSVChecksum !== oldCSVChecksum;
  checksums.CSV = newCSVChecksum;

  // Prepare changelog update if CSV is outdated
  const changelogPath = path.resolve(__dirname, "../Changelog.md");
  const changedEntries: ChangedEntry[] = [];
  // Read previous cache.csv from disk to get old entries
  const cacheCSVPath = path.resolve(__dirname, "../cache/cache.csv");
  let oldCacheRaw = "";
  if (fs.existsSync(cacheCSVPath)) {
    oldCacheRaw = fs.readFileSync(cacheCSVPath, "utf8");
  } else if (cache) {
    // Fallback to in-memory cache if file doesn't exist
    oldCacheRaw = cache;
  }
  const oldEntries = parseCSV(oldCacheRaw);

  // If CSV checksum changed, write new CSV to cache.csv
  if (isCSVOutdated) {
    const cacheCSVPath = path.resolve(__dirname, "../cache/cache.csv");
    try {
      fs.writeFileSync(cacheCSVPath, data.raw);
      Log({
        color: "yellow",
        message: ["cache.csv updated due to CSV checksum change."],
      });
    } catch (error) {
      Log(["Failed to update cache.csv:", error]);
    }
    // Do not write entries here; wait until after changedEntries are determined
  }

  for (const entry of data.parsed) {
    const EntryObj: Entry = entryToObj(entry);
    if (EntryObj && typeof EntryObj.uid === "string") {
      EntryObj.uid = EntryObj.uid.toLowerCase();
    }
    if (EntryObj?.uid) {
      const entryChecksum = generateChecksum(JSON.stringify(entry));
      const oldEntryChecksum = checksums[EntryObj.uid];
      const isOutdated = entryChecksum !== oldEntryChecksum;
      if (isOutdated) {
        checksums[EntryObj.uid] = entryChecksum;
        Log({
          color: "yellow",
          message: [`Checksum updated for entry uid: ${EntryObj.uid}`],
        });
        let oldEntryObj: Entry | undefined;
        const oldEntryArr = oldEntries.parsed.find(
          (e) =>
            Array.isArray(e) &&
            typeof e[0] === "string" &&
            e[0].toLowerCase() === EntryObj.uid.toLowerCase(),
        );
        if (oldEntryArr?.length > 0) {
          oldEntryObj = entryToObj(oldEntryArr);
        }

        changedEntries.push({
          newChecksum: entryChecksum,
          newEntry: EntryObj,
          oldChecksum: oldEntryChecksum,
          oldEntry: oldEntryObj,
          uid: EntryObj.uid,
        });
      }
    }
  }

  if (isCSVOutdated && changedEntries.length > 0) {
    const changedParsed = changedEntries
      .map((e) =>
        data.parsed.find(
          (arr) => Array.isArray(arr) && arr[0]?.toLowerCase() === e.uid?.toLowerCase(),
        ),
      )
      .filter((arr): arr is string[] => Array.isArray(arr));
    if (changedParsed.length > 0) {
      await WriteEntries(changedParsed);
    }
  }

  try {
    const sortedChecksums = Object.keys(checksums)
      .toSorted((a, b) => a.localeCompare(b))
      .reduce<Record<string, Hash>>((acc, key) => {
        acc[key] = checksums[key];
        return acc;
      }, {});

    fs.writeFileSync(checksumPath, `${JSON.stringify(sortedChecksums, undefined, 2)}\n`);
  } catch (error) {
    Log(["Failed to update checksum.json:", error]);
  }

  if (isCSVOutdated && changedEntries.length > 0) {
    const dateStr = new Date().toISOString();
    const result = writeChangelog({
      changedEntries,
      changelogPath,
      csvSha: newCSVChecksum,
      dateStr,
    });
    if (result?.success) {
      Log({
        color: "greenBright",
        message: ["Changelog updated."],
      });
    } else {
      Log(["Failed to update Changelog.md:", result?.error]);
    }
  }
};

const parseCSV = (data: string): CSVFetchResult => {
  const parsed = parse<string[]>(data, {
    delimiter: ",",
    skipEmptyLines: true,
  });
  return { parsed: parsed.data, raw: data };
};

const fetchCSVFromURL = async (): Promise<CSVFetchResult> => {
  try {
    const response = await fetch(CSVURL);
    return parseCSV(await response.text());
  } catch (error) {
    Log({ color: "redBright", message: ["Error fetching CSV:", error] });
    return cache ? parseCSV(cache) : { parsed: [], raw: "" };
  }
};

const main = async () => {
  const start = true;
  const end = true;
  const color = "cyan";
  Log({ color, message: "Updating Cache", start });
  let cacheUpdated = false;
  try {
    let data: CSVFetchResult | undefined;
    try {
      data = await fetchCSVFromURL();
    } catch (error) {
      Log({
        color: "redBright",
        message: ["Error fetching CSV from URL:", error],
        type: "error",
      });
      throw error;
    }
    if (data) {
      // Determine if cache will be updated by checking CSV checksum
      const newCSVChecksum = generateChecksum(data.raw);
      cacheUpdated = newCSVChecksum !== checksum.CSV;
      if (!cacheUpdated) {
        Log({
          color: "green",
          message: "Cache is up to date; no changes needed.",
          type: "info",
        });
        Log({ color, end, message: "AI Info cache update complete." });

        return false;
      }
      try {
        await updateCache(data);
      } catch (error) {
        Log({
          color: "redBright",
          message: ["Error updating cache or writing entries:", error],
          type: "error",
        });
        throw error;
      }
    } else {
      Log({
        color: "redBright",
        message: "No data fetched; skipping cache update.",
        type: "error",
      });
      throw new Error("No data fetched");
    }
    Log({ color, end, message: "AI Info cache update complete." });
  } catch (error) {
    Log({
      color: "redBright",
      message: ["Cache update failed:", error],
      type: "error",
    });
    throw error;
  }
  return cacheUpdated;
};

export { main, main as UpdateCache, parseCSV };

if (process.env.UPDATE) {
  main()
    .then((cacheUpdated) => {
      console.log(JSON.stringify({ cacheUpdated }));
      if (cacheUpdated) {
        process.exit(0);
      } else {
        if (process.env.CI) {
          process.exit(0);
        } else {
          process.exit(1);
        }
      }
    })
    .catch((error) => {
      Log({ color: "redBright", message: ["Error updating cache:", error] });
      process.exit(2);
    });
}
