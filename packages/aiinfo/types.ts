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

type message = string | unknown[];

interface LogObject {
	message: message;
	type?: "info" | "error" | "warn" | "log" | "debug";
	start?: boolean;
	end?: boolean;
	color?: AnsiColors;
	style?: AnsiStyles;
}

type LogProps = LogObject | message;

export type {
	CSV,
	Checksum,
	CSVFetchResult,
	Hash,
	AiInfo,
	AiInformationProps as AiInformation,
	DataPermissionLevelsProps as DataPermissionLevels,
	NutritionFactsProps as NutritionFacts,
	LogProps,
	LogObject,
};
