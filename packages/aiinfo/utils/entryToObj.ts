// biome-ignore-all assist/source/useSortedKeys: Sane ordering for CSV columns

import type { CSV, Entry } from "../types";

const entryToObj = (entry: CSV[number]): Entry => {
	try {
		if (entry.length !== 24) {
			throw new Error(
				`Invalid entry length: expected 24, got ${entry.length}. Entry: ${JSON.stringify(entry)}`
			);
		}
		const obj: Entry = {
			uid: entry[0].toLowerCase(),
			revision: entry[1],
			feature: {
				name: entry[2],
				description: entry[3],
			},
			model: {
				name: entry[4],
				description: entry[5],
				trained: entry[6],
				data: entry[7],
				dataDescription: entry[8],
			},
			compliance: {
				retention: entry[9],
				logging: entry[10],
				loggingDescription: entry[11],
				regions: entry[12],
				regionsDescription: entry[13],
				pii: entry[14],
				piiDescription: entry[15],
			},
			outputs: {
				settings: entry[16],
				human: entry[17],
				humanDescription: entry[18],
				guardrails: entry[19],
				risks: entry[20],
				outcomes: entry[21],
			},
			group: entry[22],
			permissions: entry[23] as Entry["permissions"],
		};
		return obj;
	} catch (err) {
		console.error("Error in entryToObj:", err);
		return {
			uid: "Error",
			revision: "Error",
			feature: { name: "Error", description: "Error" },
			model: {
				name: "Error",
				description: "Error",
				trained: "Error",
				data: "Error",
				dataDescription: "Error",
			},
			compliance: {
				retention: "Error",
				logging: "Error",
				loggingDescription: "Error",
				regions: "Error",
				regionsDescription: "Error",
				pii: "Error",
				piiDescription: "Error",
			},
			outputs: {
				settings: "Error",
				human: "Error",
				humanDescription: "Error",
				guardrails: "Error",
				risks: "Error",
				outcomes: "Error",
			},
			group: "Error",
			permissions: "1",
		};
	}
};

export { entryToObj };
