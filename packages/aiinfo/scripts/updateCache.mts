import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse } from "papaparse";
import { cache, checksum } from "../cache";
import type { ChangedEntry, CSVFetchResult, Entry, Hash } from "../types";
import {
	CSVURL,
	entryToObj,
	Log,
	writeBarrel,
	writeChangelog,
	writeEntry,
} from "../utils";

const generateChecksum = (data: string): Hash => {
	const hash: Hash = createHash("shake128", { outputLength: 32 })
		.update(JSON.stringify(data))
		.digest("hex");
	return hash;
};

const updateCache = (data: CSVFetchResult): void => {
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
		   oldCacheRaw = fs.readFileSync(cacheCSVPath, "utf-8");
	   } else if (cache) {
		   // fallback to in-memory cache if file doesn't exist
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
		} catch (err) {
			Log(["Failed to update cache.csv:", err]);
		}
	}

	for (const entry of data.parsed) {
		   let EntryObj: Entry = entryToObj(entry);
		   if (EntryObj && typeof EntryObj.uid === 'string') {
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
				   let oldEntryObj: Entry | undefined = undefined;
				   const oldEntryArr = oldEntries.parsed.find((e) => Array.isArray(e) && typeof e[0] === 'string' && e[0].toLowerCase() === EntryObj.uid.toLowerCase());
				   if (oldEntryArr && oldEntryArr.length > 0) {
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

	// Write updated checksums
	try {
		fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
	} catch (err) {
		Log(["Failed to update checksum.json:", err]);
	}

	// Write changelog if there are changed entries and CSV was updated
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
		} catch (err) {
			Log({
				color: "redBright",
				message: ["Error fetching CSV from URL:", err],
				type: "error",
			});
			throw err;
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
				updateCache(data);
				// Call writeEntry for each parsed entry
				for (const entry of data.parsed) {
					// Ensure the entry object includes all required AiInfoFeature properties
					const EntryObj: Entry = entryToObj(entry);
					writeEntry(EntryObj);
				}
				// Call writeBarrel after writing entries
				writeBarrel();
			} catch (err) {
				Log({
					color: "redBright",
					message: ["Error updating cache or writing entries:", err],
					type: "error",
				});
				throw err;
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
