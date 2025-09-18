
# IgniteAI Nutrition Facts Generator

An interactive web application for importing, viewing, and exporting Nutrition Facts for [IgniteAI features](https://www.instructure.com/ignite-ai). Built with React, TypeScript, and Vite, it provides a modern UI for customizing Nutrition Facts, layouts, and exporting results in various formats.

## Features

- **Customizable Layouts**: Change the appearance of the Nutrition Facts, including revision, permissions, disclaimer, and copyright.
- **Import/Export**: Import products and export Nutrition Facts.
- **Modern UI**: Uses [@instructure/ui](https://github.com/instructure/instructure-ui) for a responsive and accessible interface.
- **Dark Mode Support**: Automatically adapts to your system's color scheme.

## Usage

[View the tool on the web](https://instructure.ai/nutritionfacts) and select a feature to view its Nutrition Facts. You can:

* View the rendered Nutrition Facts
* Print (Formatted nicely)
* Copy an iFrame embed code to your clipboard
* Copy the permalink to your clipboard

## Advanced Usage

### Layout

The page layout already includes mobile responsiveness, print styles, iFrame styles, and light and dark mode. Content layout can further be modified using the query parameter by setting `PageLayout` object key values explicitly to `false`:

```json
&copyright=false   // Copyright notice
&disclaimer=false  // Marketing copy about IgniteAI
&revision=false    // Nutrition Facts revision version
&permissions=false // IgniteAI privacy framework level
```

### Exporting

Nutrition Facts provide two primary export methods: permalink & embed.

#### Permalink

A permalink is an evergreen link to a specific feature's Nutrition Facts based on its unique id. Permalinks are structured as `ignite.ai/nutritionfacts/?id=<uid>`.  When a permalink is accessed, the `uid` is used to fetch the latest revision of the Nutrition Facts and render them.

When viewing a Nutrition Facts page a "Copy permalink" helper is displayed in the header.

#### Embed

The Nutrition Facts pages can be embedded in other sites via iFrame. When embedded in an iFrame the page automatically applies styles to only display the content of the Nutrition Facts - not the header, background, or footer content.

When viewing a Nutrition Facts page a "Copy embed code" helper is displayed in the header.

The "Copy embed code" generates an iFrame that is sized to fit the content without scrolling and also includes a copy of the `product.name` and `product.description` in a hidden div to assist in searching / indexing in the embedded site. When viewing the embedded Nutrition Fact the latest version is fetched and displayed.

> [!NOTE]
> Only the iFrame content is rendered dynamically. The copy of the product name / description are not dynamically updated and will need to be manually updated if either change significantly from the time the embed code is generated.

### Importing

You can import a Nutrition Facts object by referencing its unique id in the query parameter such as `?id=igniteAgent`. Parameter values are case insensitive.  If an invalid ID is provided the default product (an empty~ish object) is returned.

> [!WARNING]
> The following import methods are DEPRECATED. They may still work, but are no longer being supported, and may be removed in a future version.

Two import types are provided: object-based and named params. Object-based import values take precedence, meaning if you include both, the value in the object will be imported. `/?q={"name":"foo"}&name=bar` will result in `bar` being stored. `/?q={"description":"I am a foo."}&name=foo` will store both `name` and `description` values.

#### Object-based Imports

The site accepts the query param `q` and a value that is a subset of the `ProductNutritionFacts` object. This will be coerced into a `NutritionFacts` compatible object.  The basic structure is a bare object with `name`, `description`, and `data[]` keys.

```json
/?q={"name": "foo", "description: "bar"}
```
try using the `Copy` export function and then pasting the clipboard to the query param to see it in action.

#### Named Parameter Imports

Parameters use dot notation for arrays and commas for values.

```typescript
name=<string>
description=<string>
model.
	base.
		value=<string>
		valueDescription=<string>
	trained.
		value=<boolean>
	data.
		value=<array["None", "Course", "Faculty", "Student", "Other"]>
		valueDescription=<string>
privacy.
	retention.
		valueDescription=<string>
	logging.
		value=<boolean>
		valueDescription=<string>
	regions.
		value<array["Global", "Virginia", "Oregon", "Montreal", "Dublin", "Frankfurt", "Singapore", "Sydney", "Other"]>
		valueDescription=<string>
	pii.
		value=<boolean>
		valueDescription=<string>
		outputs.
outputs.
	control.
		value=<boolean>
	human.
		value=<boolean>
		valueDescription=<string>
	guardrails.
		valueDescription=<string>
	risks.
		valueDescription=<string>
	outcomes.
		valueDescription=<string>
```

Example: Set regions as Virginia & Oregon:  `?privacy.regions.value="Virginia,Oregon"`

## Getting Started

> [!CAUTION]
> The rest of this readme is for developing the generator. If you need to generate nutrition facts, see 'Usage' above.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (used for package management)
- [typescript native](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/)

### Installation

This is part of the `@instructure.ai` monorepo. Clone the `instructure/instructure.ai` repository and install dependencies:

```bash
pnpm install
```

### Development

Start the development server using provided scripts:

```bash
pnpm dev nutritionfacts
```

Open [http://localhost:5173](http://localhost:5173) in your browser to use the app.

### Build

The nutritionfacts repo buildscript includes a call to `pnpm update-cache` which fetches the current list of features and stores it locally.

```bash
pnpm build nutritionfacts
```

### Cacheing

The list of Nutrition Facts is fetched at every call. A fall-back cached version is included with the source and is updated on every build.

## Data

The main type for this project is the `ProductNutritionFacts` object which is a superset of the internal types provided by `@instructure/ui/NutritionFacts`. Inputs and outputs are coerced to/from `NutritionFacts` compatible types and formats.

```typescript
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
	| { blockTitle: "Model & Data"; segmentData: ModelAndDataSegment[] }
	| {
			blockTitle: "Privacy & Compliance";
			segmentData: PrivacyComplianceSegment[];
	  }
	| { blockTitle: "Outputs"; segmentData: OutputsSegment[] };

type Permission = {
	name: string;
	title: string;
	description: string;
	descriptionHint?: string;
};

type Permissions = Readonly<Permission>[]

export type ProductNutritionFacts = Readonly<{
	name: string;
	description?: string;
	nameHint?: string;
	descriptionHint?: string;
	data: NutritionFactBlock[];
	revision?: string;
	id?: string;
	permissions?: 1 | 2 | 3 | 4 | undefined;
	group?:
		| "canvas"
		| "mastery"
		| "parchment"
		| "igniteai"
		| "intelligent insights"
		| "other"
		| "canvas career"
		| undefined;
}>;
```

## Project Structure

- `src/` — Main source code
	- `App.tsx` — Main application component
	- `Components/` — UI components (EditableField, Export, Import, Layout)
	- `assets/` — Layouts, product data, and SVG assets
	- `types.ts` — Type definitions for nutrition facts and layout
- `public/` — Static assets
- `index.html` — Entry point
- `vite.config.ts` — Vite configuration

## License

This project is licensed under the MIT License.

