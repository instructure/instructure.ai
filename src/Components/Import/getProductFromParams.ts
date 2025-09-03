import { Product } from "../../assets/Products";
import type {
	ModelAndDataSegment,
	OutputsSegment,
	PrivacyComplianceSegment,
	ProductNutritionFacts,
} from "../../types";

/**
 * Parses query parameters and maps them to a ProductNutritionFacts object.
 * Supports dot notation for nested fields and comma-separated values for arrays.
 */
export function getProductFromParams(
	template: ProductNutritionFacts = Product,
	search: string = window.location.search,
): ProductNutritionFacts {
	const params = new URLSearchParams(
		search.startsWith("?") ? search : `?${search}`,
	);
	let merged: ProductNutritionFacts = { ...template };

	// Top-level fields
	if (params.has("name"))
		merged = { ...merged, name: params.get("name") ?? "" };
	if (params.has("description"))
		merged = { ...merged, description: params.get("description") ?? "" };

	const blockAliases: Record<string, number> = {
		model: 0,
		outputs: 2,
		privacy: 1,
	};

	// Segment aliases for easier param access
	const segmentAliases: Record<string, Record<number, string>> = {
		model: {
			0: "base",
			1: "trained",
			2: "data",
		},
		outputs: {
			0: "control",
			1: "human",
			2: "guardrails",
			3: "risks",
			4: "outcomes",
		},
		privacy: {
			0: "retention",
			1: "logging",
			2: "regions",
			3: "pii",
		},
	};

	const data = merged.data.map((block, i) => {
		const alias =
			Object.entries(blockAliases).find(([, idx]) => idx === i)?.[0] ?? "";
		const blockTitleParam =
			params.get(`data.${i}.blockTitle`) ??
			(alias ? params.get(`${alias}.blockTitle`) : undefined) ??
			block.blockTitle;

		const blockTitle = blockTitleParam as typeof block.blockTitle;

		// Explicitly type segment based on block type
		let segmentType:
			| ModelAndDataSegment
			| OutputsSegment
			| PrivacyComplianceSegment;

		if (block.blockTitle === "Model & Data") {
			segmentType = {} as ModelAndDataSegment;
		} else if (block.blockTitle === "Outputs") {
			segmentType = {} as OutputsSegment;
		} else if (block.blockTitle === "Privacy & Compliance") {
			segmentType = {} as PrivacyComplianceSegment;
		}

		const segmentData = block.segmentData.map(
			(
				segment:
					| ModelAndDataSegment
					| OutputsSegment
					| PrivacyComplianceSegment,
				j: number,
			) => {
				const segmentAlias =
					alias && segmentAliases[alias] && segmentAliases[alias][j]
						? `${alias}.${segmentAliases[alias][j]}`
						: "";

				const prefixNum = `data.${i}.segmentdata.${j}`;
				const prefixAlias = alias ? `${alias}.segmentdata.${j}` : "";
				const prefixNumOmit = `data.${i}.${j}`;
				const prefixAliasOmit = alias ? `${alias}.${j}` : "";
				const prefixJustAlias = alias ? `${alias}.${j}` : "";
				const prefixSegmentAlias = segmentAlias;

				const getParam = (key: string) =>
					params.get(`${prefixNum}.${key}`) ??
					params.get(`${prefixAlias}.${key}`) ??
					params.get(`${prefixNumOmit}.${key}`) ??
					params.get(`${prefixAliasOmit}.${key}`) ??
					params.get(`${prefixJustAlias}.${key}`) ??
					(prefixSegmentAlias
						? params.get(`${prefixSegmentAlias}.${key}`)
						: undefined);

				const typedSegment = segment as typeof segmentType;
				return {
					...typedSegment,
					description: getParam("description") ?? typedSegment.description,
					segmentTitle: getParam("segmentTitle") ?? typedSegment.segmentTitle,
					value: getParam("value") ?? typedSegment.value,
					valueDescription:
						getParam("valueDescription") ?? typedSegment.valueDescription,
				};
			},
		);

		if (block.blockTitle === "Model & Data") {
			return {
				blockTitle: blockTitle as "Model & Data",
				segmentData: segmentData as ModelAndDataSegment[],
			};
		} else if (block.blockTitle === "Outputs") {
			return {
				blockTitle: blockTitle as "Outputs",
				segmentData: segmentData as OutputsSegment[],
			};
		} else if (block.blockTitle === "Privacy & Compliance") {
			return {
				blockTitle: blockTitle as "Privacy & Compliance",
				segmentData: segmentData as PrivacyComplianceSegment[],
			};
		} else {
			return block;
		}
	});

	return { ...merged, data };
}
