
# IgniteAI Nutrition Facts Generator

An interactive web application for importing, generating, editing, and exporting Nutrition Facts for [IgniteAI features](https://www.instructure.com/ignite-ai). Built with React, TypeScript, and Vite, it provides a modern UI for customizing Nutrition Facts, layouts, and exporting results in various formats.

## Features

- **Editable Nutrition Facts**: Easily input and modify nutrition data for products.
- **Customizable Layouts**: Change the appearance of the nutrition label, including header style, icons, disclaimers, and copyright.
- **Import/Export**: Import product data and export nutrition facts as code, text, image, or print-ready formats.
- **Modern UI**: Uses [@instructure/ui](https://github.com/instructure/instructure-ui) for a responsive and accessible interface.
- **Dark Mode Support**: Automatically adapts to your system's color scheme.

## Usage

[View the tool on the web](https://instructure.github.io/nf-generator/) and input your Nutrition Facts for your IgniteAI feature. You can:

* Preview the rendered Nutrition Facts for how they will display in-product
* Export to PDF
* Save as an image (Please make sure you provide an accessible alternative)
* Save as a markdown file
* Save as a self-contained HTML file (great for stand-alone embeds)
* Download a pre-built JSX component
* Copy an iFrame embed code to your clipboard
* Copy the `data` object to your clipboard
* Import a `NutritionFacts` object to pre-populate the form

## Advanced Usage

### Importing

Two import types are provided: object-based and named params. Object-based import values take precedence, meaning if you include both, the value in the object will be imported. `/?q={"name":"foo"}&name=bar` will result in `bar` being stored. `/?q={"description":"I am a foo."}&name=foo` will store both `name` and `description` values.

#### Object-based Imports

The site accepts the query param `q` and a value that is a subset of the `ProductNutritionFacts` object. This will be coerced into a `NutritionFacts` compatible object.  The basic structure is a bare object with `name`, `description`, and `data[]` keys.

```
/?q={"name": "foo", "description: "bar"}
```
try using the `Copy` export function and then pasting the clipboard to the query param to see it in action.

#### Named Parameter Imports

Parameters use dot notation for arrays and commas for values.

```
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
- [typescript native](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/) (requires additional set up)

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to use the app.

### Build

To build for production:

```bash
pnpm build
```

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

export type ProductNutritionFacts = Readonly<{
	name: string;
	description?: string;
	nameHint?: string;
	descriptionHint?: string;
	data: NutritionFactBlock[];
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

