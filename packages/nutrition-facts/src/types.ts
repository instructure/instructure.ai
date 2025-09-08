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
};

export type SegmentBase = Readonly<
	{
		description: string;
		segmentTitle: string;
		valueHint?: string;
		descriptionHint?: string;
		inputOptions?: string[];
		inputType?: "text" | "textarea" | "select" | "checkbox" | "multi-select";
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
	id?: string;
}>;

export type Products = Record<string, ProductNutritionFacts>;
