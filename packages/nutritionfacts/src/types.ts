import type { Dispatch, SetStateAction } from "react";

export type StateProp<T, K extends string> = {
	[key in K]: T;
} & {
	[key in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>;
};

export type PageLayout = {
	disclaimer: boolean;
	copyright: boolean;
	revision: boolean;
	permissions: boolean;
};

/* Destructured, but strict NutritionFacts */

export type SegmentBase = Readonly<
	{
		description: string;
		segmentTitle: string;
		valueHint?: string;
		descriptionHint?: string;
	} & (
		| { value: string; valueDescription?: string }
		| { value?: string; valueDescription: string }
	)
>;

export type ModelAndDataSegment = SegmentBase & {
	segmentTitle:
		| "Base Model"
		| "Trained with User Data"
		| "Data Shared with Model";
};

export type PrivacyComplianceSegment = SegmentBase & {
	segmentTitle: "Data Retention" | "Data Logging" | "Regions Supported" | "PII";
};

export type OutputsSegment = SegmentBase & {
	segmentTitle:
		| "AI Settings Control"
		| "Human in the Loop"
		| "Guardrails"
		| "Expected Risks"
		| "Intended Outcomes";
};

export type NutritionFactBlock =
	| { blockTitle: "Model & Data"; segmentData: ModelAndDataSegment[] }
	| {
			blockTitle: "Privacy & Compliance";
			segmentData: PrivacyComplianceSegment[];
	  }
	| { blockTitle: "Outputs"; segmentData: OutputsSegment[] };

export type ProductNutritionFacts = Readonly<{
	name: string;
	description?: string;
	nameHint?: string;
	descriptionHint?: string;
	data: NutritionFactBlock[];
	revision?: string;
	id: string;
	permissions?: 1 | 2 | 3 | 4 | undefined;
	group?:
		| "canvas"
		| "mastery"
		| "parchment"
		| "igniteai"
		| "intelligent insights"
		| "other"
		| "canvas career"
		| undefined;
}>;

export type Products = Record<string, ProductNutritionFacts>;

export type StrictNutritionFacts = Readonly<
	Omit<
		ProductNutritionFacts,
		"revision" | "id" | "permissions" | "group" | "nameHint" | "descriptionHint"
	> & {
		data: ReadonlyArray<
			| {
					blockTitle: "Model & Data";
					segmentData: ReadonlyArray<
						Omit<ModelAndDataSegment, "valueHint" | "descriptionHint">
					>;
			  }
			| {
					blockTitle: "Privacy & Compliance";
					segmentData: ReadonlyArray<
						Omit<PrivacyComplianceSegment, "valueHint" | "descriptionHint">
					>;
			  }
			| {
					blockTitle: "Outputs";
					segmentData: ReadonlyArray<
						Omit<OutputsSegment, "valueHint" | "descriptionHint">
					>;
			  }
		>;
	}
>;

export type CacheMeta = {
	sha256: string;
	lastUpdated: string;
	count: number;
};

export type FeatureMeta = {
	sha256: string;
	lastUpdated: string;
	nutritionFacts: StrictNutritionFacts;
};

export type ProductsMeta = {
	cache: CacheMeta;
	features: Record<ProductNutritionFacts["id"], FeatureMeta>;
};
