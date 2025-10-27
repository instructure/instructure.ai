import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parse } from "papaparse";
import { entryToObj, Log, writeBarrel, writeEntry } from "../utils";

const parseCSV = (data: string) => {
	const parsed = parse<string[]>(data, {
		delimiter: ",",
		skipEmptyLines: true,
	});
	return parsed.data;
};

/**
 * Write all entries and barrel file.
 * @param entries Optional parsed array of entries. If not provided, reads from cache.
 */
const main = async (entries?: string[][]) => {
	let parsed = entries;
	if (!parsed) {
		const cachePath = path.resolve(__dirname, "../cache/cache.csv");
		if (!fs.existsSync(cachePath)) {
			Log({ color: "redBright", message: ["No cache.csv found."] });
			return;
		}
		const raw = fs.readFileSync(cachePath, "utf-8");
		parsed = parseCSV(raw);
	}
	Log({ color: "green", message: "Writing entries..." });
	if (!parsed || parsed.length === 0) {
		Log({ color: "yellow", message: ["No entries to write."] });
		return;
	}
	for (const entry of parsed) {
		const EntryObj = entryToObj(entry);
		await writeEntry(EntryObj);
		Log({ color: "cyan", message: [` * ${EntryObj.uid}`] });
	}
	writeBarrel();

	try {
		execSync("pnpm biome check ./node --write", { stdio: "ignore" });
	} catch (err) {
		Log({ color: "redBright", message: ["Biome formatting failed:", err] });
	}
	Log({ color: "green", message: ["Entries and barrel written."] });
};

const isVitest = typeof process !== "undefined" && process.env.VITEST;

const isViteNodeEntrypoint =
	!isVitest &&
	((process.argv[1] && import.meta.url === `file://${process.argv[1]}`) ||
		import.meta.url.endsWith("/scripts/writeEntries.mts") ||
		import.meta.url.endsWith("\\scripts\\writeEntries.mts"));

if (isViteNodeEntrypoint) {
	main().catch((err) => {
		Log({ color: "redBright", message: ["Error writing entries:", err] });
		process.exit(1);
	});
}
export { main, main as WriteEntries };
