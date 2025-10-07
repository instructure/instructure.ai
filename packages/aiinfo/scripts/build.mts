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
					AiInformation: entryToAIInformation(obj),
					DataPermissionLevels: entryToPermissionLevels(obj),
					NutritionFacts: entryToNutritionFacts(obj),
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

	const rawEntries = parseCSV(cache).parsed;
	let entries: AiInfo = {};

	Log(`Found ${rawEntries.length} entries`);

	if (rawEntries.length) {
		Log("Compiling entries...");
		entries = parseEntries(rawEntries);
	} else {
		Log({ color: "yellowBright", message: "No entries found.", type: "info" });
	}
	if (!entries) {
		Log({
			color: "redBright",
			message: "An error occurred during build.",
			type: "error",
		});
		return;
	}
	Log({
		color: "greenBright",
		message: `Compiled ${rawEntries.length} packages.\n`,
	});

	Log("Writing output...");
	for (const entry of Object.values(entries)) {
		writeEntry(entry);
	}
	Log({
		color: "greenBright",
		message: `Wrote ${rawEntries.length} packages.\n`,
	});

	Log("Building barrel file...");
	writeBarrel();

	Log({ color, end, message: "Build complete." });
};

if (process.env.BUILD) {
	main().catch((error) => {
		Log({ color: "redBright", message: ["Error building aiinfo:", error] });
		process.exit(1);
	});
}

export { main as Build };
