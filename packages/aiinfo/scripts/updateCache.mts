import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse } from "papaparse";
import { cache, checksum } from "../cache";
import type { CSVFetchResult, Entry, Hash } from "../types";
import { CSVURL, entryToObj, Log, writeBarrel, writeEntry } from "../utils";

const generateChecksum = (data: string): Hash => {
	const hash = createHash("shake128", { outputLength: 32 })
		.update(JSON.stringify(data))
		.digest("hex");
	return hash;
};

const cacheOutdated = (data: CSVFetchResult, hash = checksum): boolean =>
	generateChecksum(data.raw) !== hash?.CSV;

const updateCache = (data: CSVFetchResult): void => {
	Log("Validating cache integrity...");
	if (cacheOutdated(data)) {
		const checksumPath = path.resolve(__dirname, "../cache/checksum.json");
		const newChecksum = generateChecksum(data.raw);
		const updated = { CSV: newChecksum };
		try {
			fs.writeFileSync(checksumPath, JSON.stringify(updated, null, 2));
			Log({
				message: ["Checksum updated.", updated],
			});
		} catch (err) {
			Log(["Failed to update checksum.json:", err]);
		}
	} else {
		Log({
			color: "greenBright",
			message: "Cache is up to date.",
			style: "bold",
		});
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
};

export { main as UpdateCache, parseCSV };

if (process.env.UPDATE) {
	main().catch((error) => {
		Log({ color: "redBright", message: ["Error updating cache:", error] });
		process.exit(1);
	});
}
