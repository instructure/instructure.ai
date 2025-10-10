# @instructure.ai/aiinfo ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fpackages%2Faiinfo%2Fpackage.json&query=%24.version&label=version&labelColor=%230e1721&color=%234279B6)

A TypeScript package providing [IgniteAI](https://www.instructure.com/igniteai) feature metadata, nutrition facts, and data permission levels for Instructure products. This package is designed to help developers and product teams understand, display, and manage information about AI features.

## Entries

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

### Render a &lt;NutritionFacts /&gt; component

You don't have to use the whole object, it can be destructured for your convenience. Here we don't use the triggerText because we want to provide something different, and we also pass the optional `fullscreen` prop directly.

```jsx
import { InstUISettingsProvider, NutritionFacts } from "@instructure/ui";
import { nutritionFacts } from "@instructure.ai/aiinfo";
import type { FC } from "react";

const App: FC = () => {
	const {
		smartsearch: {
			closeButtonText,
			closeIconButtonScreenReaderLabel,
			featureName,
			modalLabel,
			data,
			title,
		},
	} = nutritionFacts;
	return (
		<InstUISettingsProvider>
			<NutritionFacts
				closeButtonText={closeButtonText}
				closeIconButtonScreenReaderLabel={closeIconButtonScreenReaderLabel}
				data={data}
				featureName={featureName}
				modalLabel={modalLabel}
				title={title}
				triggerText="Learn more"
        fullscreen
			/>
		</InstUISettingsProvider>
	);
};
export default App;
```

### Render a &lt;DataPermissionLevels /&gt; Component

Since the props of our object are the same as the expected props for the INSTUI component, we can spread them for shorthand.

```jsx
import { DataPermissionLevels, InstUISettingsProvider } from "@instructure/ui";
import { smartsearch } from "@instructure.ai/aiinfo";
import type { FC } from "react";

const App: FC = () => (
	<InstUISettingsProvider>
		<DataPermissionLevels { ...smartsearch.dataPermissionLevels } />
	</InstUISettingsProvider>
);
export default App;
```

### Render a &lt;AiInformation /&gt; Component

`AiInformation` is a superset of `DataPermissionLevels` and `NutritionFacts`, while we provide the data for both of those components directly, they are also nested. This example shows how to pull either.

The two objects are strictly equivalent.

```jsx
// nutritionFacts
AiInformation.uid.nutritionFactsData ===
uid.AiInformation.nutritionFactsData === 
uid.nutritionFacts.data === 
nutritionFacts.uid.data

//dataPermissionLevels
AiInformation.uid.dataPermissionLevelsData ===
uid.AiInformation.dataPermissionLevelsData ===
uid.dataPermissionLevels.data ===
dataPermissionLevels.uid.data
```

Though the best practice is not to mix and match, these equivalencies are provided for easier importing and destructuring.

```jsx
import { AiInformation, InstUISettingsProvider } from "@instructure/ui";
import { smartsearch } from "@instructure.ai/aiinfo";
import type { FC } from "react";

const App: FC = () => (
	<InstUISettingsProvider>
		<AiInformation
			data={smartsearch.aiInformation.data}
			dataPermissionLevelsCloseButtonText={
				smartsearch.aiInformation.dataPermissionLevelsCloseButtonText
			}
			dataPermissionLevelsCloseIconButtonScreenReaderLabel={
				smartsearch.aiInformation
					.dataPermissionLevelsCloseIconButtonScreenReaderLabel
			}
			dataPermissionLevelsCurrentFeature={
				smartsearch.aiInformation.dataPermissionLevelsCurrentFeature
			}
			dataPermissionLevelsCurrentFeatureText={
				smartsearch.aiInformation.dataPermissionLevelsCurrentFeatureText
			}
			// sibling object
			dataPermissionLevelsData={smartsearch.dataPermissionLevels.data}
			dataPermissionLevelsModalLabel={
				smartsearch.aiInformation.dataPermissionLevelsModalLabel
			}
			dataPermissionLevelsTitle={
				smartsearch.aiInformation.dataPermissionLevelsTitle
			}
			nutritionFactsCloseButtonText={
				smartsearch.aiInformation.nutritionFactsCloseButtonText
			}
			nutritionFactsCloseIconButtonScreenReaderLabel={
				smartsearch.aiInformation.nutritionFactsCloseIconButtonScreenReaderLabel
			}
			// child object
			nutritionFactsData={smartsearch.aiInformation.nutritionFactsData}
			nutritionFactsFeatureName={
				smartsearch.aiInformation.nutritionFactsFeatureName
			}
			nutritionFactsModalLabel={
				smartsearch.aiInformation.nutritionFactsModalLabel
			}
			nutritionFactsTitle={smartsearch.aiInformation.nutritionFactsTitle}
			title={smartsearch.aiInformation.title}
			trigger={smartsearch.aiInformation.trigger}
		/>
	</InstUISettingsProvider>
);
export default App;
```
