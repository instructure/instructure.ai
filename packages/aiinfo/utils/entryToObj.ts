// biome-ignore-all assist/source/useSortedKeys: Sane ordering for CSV columns

import type { CSV } from "../types";

const entryToObj = (entry: CSV[number]) => {
	console.log("size of entry:", entry.length);
	const obj = {
		uid: entry[0],
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
		permissions: entry[23],
	};
	return obj;
};

export { entryToObj };
