import type { HeadingProps } from "@instructure/ui";
import type { Dispatch, SetStateAction } from "react";

export type StateProp<T, K extends string> = {
	[key in K]: T;
} & {
	[key in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>;
};

export type PageLayout = {
	header: HeadingProps["aiVariant"];
	icon: boolean;
	disclaimer: boolean;
	copyright: boolean;
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

type ModelAndDataSegment = SegmentBase & {
	segmentTitle:
		| "Base Model"
		| "Trained with User Data"
		| "Data Shared with Model";
};

type PrivacyComplianceSegment = SegmentBase & {
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
	| { blockTitle: "Model & Data"; segmentData: readonly ModelAndDataSegment[] }
	| {
			blockTitle: "Privacy & Compliance";
			segmentData: readonly PrivacyComplianceSegment[];
	  }
	| { blockTitle: "Outputs"; segmentData: readonly OutputsSegment[] };

export type ProductNutritionFacts = Readonly<{
	name: string;
	description?: string;
	nameHint?: string;
	descriptionHint?: string;
	data: NutritionFactBlock[];
}>;
