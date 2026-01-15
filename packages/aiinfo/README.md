# @instructure.ai/aiinfo

![version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fpackages%2Faiinfo%2Fpackage.json&query=%24.version&label=version&labelColor=%230e1721&color=%234279B6) ![coverage](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fpackages%2Faiinfo%2Fcoverage%2Fcoverage.yml&query=coverage.totals.total&logo=vitest&label=coverage&labelColor=%230E1721&color=%234279B6)

A TypeScript package providing [IgniteAI](https://www.instructure.com/igniteai) feature metadata, nutrition facts, and data permission levels for Instructure products. This package is designed to help developers and product teams understand, display, and manage information about AI features.

> [!WARNING]
> v2.x has breaking changes from 1.x

## Migrating to v2 from v1

`AiInformation.trigger` is now `undefined`, you must bring your own `Renderable` trigger. The default value of `undefined` will pass typechecks but you may have unexpected outputs.

```jsx
//V1
<AiInformation {...aiInformation} />
```

```jsx
//V2
<AiInformation
  {...aiInformation}
  trigger={<Button>AI Information</Button>}
/>
```

If you were not using @instructure/ui's AiInformation component, then there are no changes needed. This does not effect NutritionFacts or DataPermissionLevels

## Entries & Features

`aiinfo` provides two main ways to access AI feature metadata:

### 1. Entries

- **Entries** are keyed by their lowercase `uid` (as defined in the Nutrition Facts Generator) and represent individual AI-powered features. Each entry contains:
  - **AI Information**: Model details, feature name, permission level, and descriptions.
  - **Nutrition Facts**: Transparency about data usage and model training.
  - **Data Permission Levels**: Describes how data is used at different levels of access.

This structure makes it easy to access all relevant metadata for a specific feature in one place.

### 2. Features by INSTUI Component

- **Features** are also exported as objects keyed by INSTUI AI component type, allowing you to access and render metadata for all features using standardized UI components from [INSTUI](https://instructure.design/):
  - [`AiInformation`](https://instructure.design/#AiInformation): Model details, feature name, permission level, and descriptions for each feature.
  - [`DataPermissionLevels`](https://instructure.design/#DataPermissionLevels): Data usage at different permission levels, supporting transparency and compliance.
  - [`NutritionFacts`](https://instructure.design/#NutritionFacts): Summary of data usage, model training, and privacy for each feature.

These exports are designed for direct use with INSTUI components, enabling consistent, accessible, and informative display of AI feature details in your application.

## Usage

There are several ways to use `@instructure.ai/aiinfo` depending on your needs:

### 1. Import the entire package

This gives you access to all AI feature entries, keyed by their UID. Use this when you want to work with multiple features or need to dynamically access entries.

```typescript
import { AiInfo } from "@instructure.ai/aiinfo";

// Access a specific feature by UID
const info = AiInfo["smartsearch"];
console.log(info.AiInformation);
```

### 2. Import a specific entry by UID

If you only need a single feature, you can import it directly. This is useful for tree-shaking and keeping your bundle size small.

```typescript
import { smartsearch } from "@instructure.ai/aiinfo";

// Destructure the feature's metadata
const { nutritionFacts, dataPermissionLevels, aiInformation } = smartsearch;
```

### 3. Import by INSTUI feature type

You can also import by the type of metadata you want (e.g., all nutrition facts for all features). This is useful for rendering a specific INSTUI component.

```typescript
import { nutritionFacts } from "@instructure.ai/aiinfo";

// Access nutrition facts for a specific feature
const { smartsearch } = nutritionFacts;
```

## Types

The root types are all based on the respective INSTUI component, and outputs are typed to those components.
Helper types are included for managing or passing imports from `AiInfo`

```typescript
type AiInfoFeatureProps = {
	nutritionFacts: NutritionFactsProps; // INSTUI type definition
	dataPermissionLevels: DataPermissionLevelsProps; // INSTUI type definition
	aiInformation: AiInformationProps; // INSTUI type definition
	uid: string;
	revision: string;
	group: string;
	name: string;
	description: string;
};

type AiInfoNutritionFactsProps = {
	[uid: string]: NutritionFactsProps;  // INSTUI type definition
};

type AiInfoDataPermissionLevelsProps = {
	[uid: string]: DataPermissionLevelsProps;  // INSTUI type definition
};

type AiInfoAiInformationProps = {
	[uid: string]: AiInformationProps;  // INSTUI type definition
};
```

## Examples

### ESM

```jsx
import { AiInformation, InstUISettingsProvider } from "@instructure/ui";
import { smartsearch } from "@instructure.ai/aiinfo";
import type { FC } from "react";

const App: FC = () => (
	<InstUISettingsProvider>
		<AiInformation
			{...smartsearch.aiInformation}
			trigger={
				<IconButton screenReaderLabel="AI Information">
					<IconAIInfoLine />
				</IconButton>
			}
		/>
	</InstUISettingsProvider>
);
export default App;
```

### CommonJs

Since the props of our object are the same as the expected props for the INSTUI component, we can spread them for shorthand.

```jsx
const React = require("react");
const { DataPermissionLevels, InstUISettingsProvider } = require("@instructure/ui");
const { smartsearch } = require("@instructure.ai/aiinfo");

const App = () => (
	React.createElement(
		InstUISettingsProvider,
		null,
		React.createElement(
			DataPermissionLevels,
			{ ...smartsearch.dataPermissionLevels }
		)
	)
);

module.exports = App;
```
