import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AnsiColors, AnsiStyles } from "ansis";
import type { ParseResult } from "papaparse";

type CSVFetchResult = {
	parsed: CSV;
	raw: string;
};

type AiInfoFeature = {
	AiInformation: AiInformationProps;
	DataPermissionLevels: DataPermissionLevelsProps;
	NutritionFacts: NutritionFactsProps;
};

type FeatureName = string;

type AiInfo = Record<FeatureName, AiInfoFeature>;

type CSV = ParseResult<string[]>["data"];

type Hash = string;

type Checksum = {
	CSV: Hash;
	[feature: FeatureName]: Hash;
};

type message = number | string | unknown[];

interface LogObject {
	message: message;
	type?: "info" | "error" | "warn" | "log" | "debug";
	start?: boolean;
	end?: boolean;
	color?: AnsiColors;
	style?: AnsiStyles;
}

type LogProps = LogObject | message;

type Entry = {
	uid: string;
	revision: string;
	feature: {
		description: string;
		name: string;
	};
	model: {
		data: string;
		dataDescription: string;
		description: string;
		name: string;
		trained: string;
	};
	compliance: {
		logging: string;
		loggingDescription: string;
		pii: string;
		piiDescription: string;
		regions: string;
		regionsDescription: string;
		retention: string;
	};
	outputs: {
		guardrails: string;
		human: string;
		humanDescription: string;
		outcomes: string;
		risks: string;
		settings: string;
	};
	group: string;
	permissions: string;
}

export type {
	CSV,
	Checksum,
	CSVFetchResult,
	Entry,
	Hash,
	AiInfo,
	AiInformationProps as AiInformation,
	DataPermissionLevelsProps as DataPermissionLevels,
	NutritionFactsProps as NutritionFacts,
	AiInfoFeature,
	LogProps,
	LogObject,
};
