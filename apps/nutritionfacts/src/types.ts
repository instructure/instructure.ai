// oxlint-disable no-named-export
/// <reference types="vite/client" />

import { type Dispatch, type SetStateAction } from "react";
import { type NutritionFactsProps } from "@instructure/ui";

type StateProp<Type, Key extends string> = {
  [key in Key]: Type;
} & {
  [key in `set${Capitalize<Key>}`]: Dispatch<SetStateAction<Type>>;
};

interface PageLayout {
  disclaimer: boolean;
  copyright: boolean;
  revision: boolean;
  permissions: boolean;
}

type ExtendedNutritionFactsProps = NutritionFactsProps & {
  description: string;
  linkText?: string;
  linkUrl?: string;
};

export type { StateProp, PageLayout, ExtendedNutritionFactsProps };
