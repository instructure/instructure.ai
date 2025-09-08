import type { ProductNutritionFacts } from "../../types";

export interface ImportedSegment {
	description?: string;
	segmentTitle?: string;
	value?: string;
	valueDescription?: string;
}

export interface ImportedBlock {
	blockTitle?: string;
	segmentData: ImportedSegment[];
}

export interface ImportedProduct {
	data: ImportedBlock[];
	description?: string;
	name?: string;
}

function mapImportedToProduct(
	imported: ImportedProduct,
	template: ProductNutritionFacts,
): ProductNutritionFacts {
	let merged: ProductNutritionFacts = { ...template };

	if (imported.name) {
		merged = { ...merged, name: imported.name };
	}
	if (imported.description) {
		merged = { ...merged, description: imported.description };
	}

	if (Array.isArray(imported.data)) {
		merged = {
			...merged,
			data: merged.data.map((block, i) => {
				const importedBlock = imported.data[i];
				if (!importedBlock) return block;
				if (importedBlock.blockTitle !== block.blockTitle) return block;

				switch (block.blockTitle) {
					case "Model & Data":
						return {
							...block,
							blockTitle: "Model & Data",
							segmentData: block.segmentData.map((segment, j) => {
								const importedSegment = importedBlock.segmentData?.[j];
								if (!importedSegment) return segment;
								return {
									...segment,
									description:
										importedSegment.description ?? segment.description,
									segmentTitle:
										importedSegment.segmentTitle ?? segment.segmentTitle,
									value: importedSegment.value ?? segment.value,
									valueDescription:
										importedSegment.valueDescription ??
										segment.valueDescription,
								};
							}) as typeof block.segmentData,
						};
					case "Outputs":
						return {
							...block,
							blockTitle: "Outputs",
							segmentData: block.segmentData.map((segment, j) => {
								const importedSegment = importedBlock.segmentData?.[j];
								if (!importedSegment) return segment;
								return {
									...segment,
									description:
										importedSegment.description ?? segment.description,
									segmentTitle:
										importedSegment.segmentTitle ?? segment.segmentTitle,
									value: importedSegment.value ?? segment.value,
									valueDescription:
										importedSegment.valueDescription ??
										segment.valueDescription,
								};
							}) as typeof block.segmentData,
						};
					case "Privacy & Compliance":
						return {
							...block,
							blockTitle: "Privacy & Compliance",
							segmentData: block.segmentData.map((segment, j) => {
								const importedSegment = importedBlock.segmentData?.[j];
								if (!importedSegment) return segment;
								return {
									...segment,
									description:
										importedSegment.description ?? segment.description,
									segmentTitle:
										importedSegment.segmentTitle ?? segment.segmentTitle,
									value: importedSegment.value ?? segment.value,
									valueDescription:
										importedSegment.valueDescription ??
										segment.valueDescription,
								};
							}) as typeof block.segmentData,
						};
					default:
						return block;
				}
			}),
		};
	}

	return merged;
}

function extractPossiblyBrokenJSONParam(
	search: string,
	key: string,
): string | null {
	const query = search.startsWith("?") ? search.slice(1) : search;
	const keyEq = `${key}=`;
	const start = query.indexOf(keyEq);
	if (start === -1) return null;

	let i = start + keyEq.length;
	let result = "";
	let depth = 0;
	let inString = false;
	let stringQuote = "";
	let escaping = false;

	for (; i < query.length; i++) {
		const ch = query[i];

		if (escaping) {
			result += ch;
			escaping = false;
			continue;
		}

		if (inString) {
			if (ch === "\\") {
				result += ch;
				escaping = true;
				continue;
			}
			if (ch === stringQuote) {
				inString = false;
				result += ch;
				continue;
			}
			result += ch;
			continue;
		}

		if (ch === '"' || ch === "'") {
			inString = true;
			stringQuote = ch;
			result += ch;
			continue;
		}
		if (ch === "{" || ch === "[") {
			depth++;
			result += ch;
			continue;
		}
		if (ch === "}" || ch === "]") {
			depth--;
			result += ch;
			if (depth <= 0) {
				i++;
				break;
			}
			continue;
		}

		if (ch === "&" && depth === 0) break;

		result += ch;
	}

	return result || null;
}

export function getProductFromObject(
	Product: ProductNutritionFacts,
): ProductNutritionFacts {
	const rawQ = extractPossiblyBrokenJSONParam(window.location.search, "q");

	if (rawQ && rawQ.trim() !== "") {
		const safeDecode = (s: string) => {
			try {
				return decodeURIComponent(s.replace(/\+/g, " "));
			} catch {
				return s;
			}
		};

		const candidates = [rawQ, safeDecode(rawQ)];

		for (const candidate of candidates) {
			try {
				const imported = JSON.parse(candidate);
				return mapImportedToProduct(imported, Product);
			} catch {
				/* try next */
			}
		}

		console.error("Failed to parse ?q even after reconstruction/decoding.");
	}

	return Product;
}
