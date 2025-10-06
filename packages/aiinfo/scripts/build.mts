import { cache } from "../cache";
import { name } from "../package.json";
import type { AiInfo, CSV } from "../types";
import {
	entryToAIInformation,
	entryToNutritionFacts,
	entryToObj,
	entryToPermissionLevels,
	Log,
} from "../utils";
import { parseCSV } from "./";

const parseEntries = (entries: CSV): AiInfo => {
	return Object.fromEntries(
		entries.map((entry) => {
			const obj = entryToObj(entry);
			return [
				entry[0],
				{
					revision: obj.revision,
					AiInformation: entryToAIInformation(obj),
					DataPermissionLevels: entryToPermissionLevels(obj),
					NutritionFacts: entryToNutritionFacts(obj),
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

	Log(`Found ${rawEntries.length} entries`);

	if (rawEntries.length) {
		const entries = parseEntries(rawEntries);
		console.log(entries);
	} else {
		Log({ color: "yellowBright", message: "No entries found.", type: "info" });
	}

	Log({ color, end, message: "Build complete." });
};

console.log("import.meta.url:", import.meta.url);
console.log("process.argv[1]:", process.argv[1]);

if (process.env.BUILD) {
	main().catch((error) => {
		Log({ color: "redBright", message: ["Error building aiinfo:", error] });
		process.exit(1);
	});
}

export { main as Build };
