import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse } from "papaparse";
import { cache, checksum } from "../cache";
import type { CSVFetchResult, Hash } from "../types";
import { CSVURL, Log } from "../utils";

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
	Log({ message: "Updating Cache", start: true });
	const data = await fetchCSVFromURL();
	if (data) {
		updateCache(data);
	} else {
		Log({
			color: "redBright",
			message: "No data fetched; skipping cache update.",
			type: "error",
		});
	}
	Log({ end: true, message: "AI Info cache update complete." });
};

export type { main as UpdateCache };

main().catch((e) => Log(e));
