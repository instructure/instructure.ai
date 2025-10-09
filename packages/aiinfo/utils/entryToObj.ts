// biome-ignore-all assist/source/useSortedKeys: Sane ordering for CSV columns

import type { CSV, Entry } from "../types";

const entryToObj = (entry: CSV[number]): Entry => {
	if (entry.length !== 24) {
		throw new Error(
			`Invalid entry length: expected 24, got ${entry.length}. Entry: ${JSON.stringify(entry)}`,
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
};

export { entryToObj };
