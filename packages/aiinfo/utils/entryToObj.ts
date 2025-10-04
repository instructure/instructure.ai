import type { CSV } from "../types";

const entryToObj = (entry: CSV[number]) => {
	console.log("size of entry:", entry.length);
	// biome-ignore assist/source/useSortedKeys: sane ordering for CSV columns
	const obj = {
		uid: entry[0],
		revision: entry[1],
		feature: {
			description: entry[3],
			name: entry[2],
		},
		model: {
			data: entry[7],
			dataDescription: entry[8],
			description: entry[5],
			name: entry[4],
			trained: entry[6],
		},
		compliance: {
			logging: entry[10],
			loggingDescription: entry[11],
			pii: entry[14],
			piiDescription: entry[15],
			regions: entry[12],
			regionsDescription: entry[13],
			retention: entry[9],
		},
		outputs: {
			guardrails: entry[19],
			human: entry[17],
			humanDescription: entry[18],
			outcomes: entry[21],
			risks: entry[20],
			settings: entry[16],
		},
		group: entry[22],
		permissions: entry[23],
	};
	return obj;
};

export { entryToObj };
