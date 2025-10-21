/// <reference types="vite/client" />

import type { Dispatch, SetStateAction } from "react";
import type { NutritionFactsProps, AiInformationProps } from "@instructure/ui";
import type { AiInfoProps } from "@instructure.ai/aiinfo";

type StateProp<T, K extends string> = {
	[key in K]: T;
} & {
	[key in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>;
};

type PageLayout = {
	disclaimer: boolean;
	copyright: boolean;
	revision: boolean;
	permissions: boolean;
};

type ExtendedNutritionFactsDataProps = NutritionFactsProps["data"] & {
	description: AiInfoProps["description"];
};

export type { StateProp, PageLayout, Features };
