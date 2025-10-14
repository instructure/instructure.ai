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
	revision: string;
	uid: string;
	aiInformation: AiInformationProps;
	dataPermissionLevels: DataPermissionLevelsProps;
	nutritionFacts: NutritionFactsProps;
};

type FeatureName = string;

type AiInfo = Record<FeatureName, AiInfoFeature>;

type CSV = ParseResult<string[]>["data"];

type Hash = string;

type Checksum = {
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
	permissions: "1" | "2" | "3" | "4";
};

type LangCode =
	| `${Lowercase<string>}`
	| `${Lowercase<string>}_${Uppercase<string>}`;

type DataPermissionLevelsStrings = Omit<
	AiInfoFeature["dataPermissionLevels"],
	"currentFeature"
>;

/* TODO: Omit based on INSTUI NutritionFactsOwnProps.BlockType[] */
type AiInformationStrings = Omit<
	AiInfoFeature["aiInformation"],
	| "data"
	| "dataPermissionLevelsCurrentFeature"
	| "dataPermissionLevelsData"
	| "nutritionFactsFeatureName"
	| "nutritionFactsData"
> & {
	data: {
		permissionLevelText: string;
		permissionLevelsModalTriggerText: string;
		modelNameText: string;
		nutritionFactsModalTriggerText: string;
	};
	title: string;
	dataPermissionLevelsTitle: string;
	dataPermissionLevelsCurrentFeatureText: string;
	dataPermissionLevelsCloseIconButtonScreenReaderLabel: string;
	dataPermissionLevelsCloseButtonText: string;
	dataPermissionLevelsModalLabel: string;
	nutritionFactsModalLabel: string;
	nutritionFactsTitle: string;
	nutritionFactsCloseButtonText: string;
	nutritionFactsCloseIconButtonScreenReaderLabel: string;
};

type NutritionFactsStrings = Omit<
	AiInfoFeature["nutritionFacts"],
	"featureName" | "fullscreen" | "data"
> & {
	data: Array<{
		blockTitle: string;
		segmentData: NutritionFactsSegmentDataStrings[];
	}>;
};

/* TODO: Omit based on INSTUI NutritionFactsOwnProps.BlockType[] */
type NutritionFactsSegmentDataStrings = {
	segmentTitle: string;
	description: string;
};

type Strings = {
	[langcode in LangCode]:
		| DataPermissionLevelsStrings
		| AiInformationStrings
		| NutritionFactsStrings;
};

type ChangedEntry = {
	uid: string;
	oldChecksum?: string;
	newChecksum: string;
	oldEntry?: Entry;
	newEntry: Entry;
};

export type {
	CSV,
	ChangedEntry,
	Checksum,
	CSVFetchResult,
	DataPermissionLevelsStrings,
	Entry,
	Hash,
	LangCode,
	AiInfo,
	NutritionFactsStrings,
	AiInformationStrings,
	AiInformationProps as aiInformation,
	DataPermissionLevelsProps as dataPermissionLevels,
	NutritionFactsProps as nutritionFacts,
	AiInfoFeature,
	LogProps,
	LogObject,
	Strings,
};
