/// <reference types="vite/client" />

import type { Dispatch, SetStateAction } from "react";
import type { NutritionFactsProps, AiInformationProps } from "@instructure/ui";

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

type ExtendedNutritionFactsProps = NutritionFactsProps & {
	level: AiInformationProps["data"]["level"];
};

type Features = Record<string, ExtendedNutritionFactsProps>;

export type { StateProp, PageLayout, Features };
