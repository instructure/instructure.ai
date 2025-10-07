import { cache } from "../cache";
import { name } from "../package.json";
import type { AiInfo, CSV } from "../types";
import {
	entryToAIInformation,
	entryToNutritionFacts,
	entryToObj,
	entryToPermissionLevels,
	Log,
	writeBarrel,
	writeEntry,
} from "../utils";
import { parseCSV } from "./";

const parseEntries = (entries: CSV): AiInfo => {
	return Object.fromEntries(
		entries.map((entry) => {
			const obj = entryToObj(entry);
			Log(` * ${obj.uid} (${obj.revision})`);
			return [
				entry[0],
				{
					aiInformation: entryToAIInformation(obj),
					dataPermissionLevels: entryToPermissionLevels(obj),
					nutritionFacts: entryToNutritionFacts(obj),
					revision: obj.revision,
					uid: obj.uid,
				},
			];
		}),
	);
};

const main = async () => {
	const start = true;
	const end = true;
	const color = "magenta";
	Log({ color, message: `Building ${name}`, start });
	try {
		let rawEntries: CSV;
		try {
			rawEntries = parseCSV(cache).parsed;
		} catch (err) {
			Log({
				color: "redBright",
				message: ["Error parsing CSV:", err],
				type: "error",
			});
			throw err;
		}
		let entries: AiInfo = {};
		Log(`Found ${rawEntries.length} entries\n`);
		if (rawEntries.length) {
			Log("Compiling entries...");
			try {
				entries = parseEntries(rawEntries);
			} catch (err) {
				Log({
					color: "redBright",
					message: ["Error compiling entries:", err],
					type: "error",
				});
				throw err;
			}
		} else {
			Log({
				color: "yellowBright",
				message: "No entries found.",
				type: "info",
			});
		}
		if (!entries) {
			Log({
				color: "redBright",
				message: "An error occurred during build.",
				type: "error",
			});
			throw new Error("No entries compiled");
		}
		Log({
			color: "greenBright",
			message: `Compiled ${rawEntries.length} packages.\n`,
		});
		Log("Writing output...");
		try {
			for (const entry of Object.values(entries)) {
				writeEntry(entry);
			}
		} catch (err) {
			Log({
				color: "redBright",
				message: ["Error writing entries:", err],
				type: "error",
			});
			throw err;
		}
		Log({
			color: "greenBright",
			message: `Wrote ${rawEntries.length} packages.\n`,
		});
		Log("Building barrel file...");
		try {
			writeBarrel();
		} catch (err) {
			Log({
				color: "redBright",
				message: ["Error writing barrel file:", err],
				type: "error",
			});
			throw err;
		}
		Log({
			color: "greenBright",
			message: `Wrote barrel file.\n`,
		});
		Log({ color: "greenBright", message: "Build complete." });
		Log({ color, end, message: "Build complete." });
	} catch (error) {
		Log({
			color: "redBright",
			message: ["Build failed:", error],
			type: "error",
		});
		throw error;
	}
};

if (process.env.BUILD) {
	main().catch((error) => {
		Log({ color: "redBright", message: ["Error building aiinfo:", error] });
		process.exit(1);
	});
}

export { main as Build };
