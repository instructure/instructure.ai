
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

### JSON

When viewing a Nutrition Facts page a "Copy JSON Object" helper is displayed in the header. This object is for use with @instructure/ui AI Components. An sha256 and a last updated Epoch timestamp are included for easier update validation.

```JSON
{
  "id": "<uid>",
  "name": "<featureName>",
  "sha256": "abc...xyz",
  "lastUpdated": "1234567890",
  "nutritionFacts": "<StrictNutritionFacts>",
  "dataPermissionsLevel": "<AiPermissions>",
  "AiInformation": "<StrictAiInformation>"
}
```

This makes outputting AI Components fairly simple, and standard.

#### AiInformation

```jsx
const ai = {jsonObj}

<AiInformation
  data={ai.AiInformation}
  dataPermissionLevelsCurrentFeature={ai.name}
  dataPermissionLevelsData={ai.dataPermissionsLevel}
  nutritionFactsFeatureName={ai.name}
  nutritionFactsData={ai.nutritionFacts.data}

  title="Features"
  trigger={<Button>AI information</Button>}

  dataPermissionLevelsTitle="Data Permission Levels"
  dataPermissionLevelsCurrentFeatureText="Current Feature:"
  dataPermissionLevelsCloseIconButtonScreenReaderLabel="Close"
  dataPermissionLevelsCloseButtonText="Close"
  dataPermissionLevelsModalLabel="This is a Data Permission Levels modal"
  dataPermissionLevelsTriggerText="Data Permission Levels"

  nutritionFactsModalLabel="This is a modal for AI facts"
  nutritionFactsTitle="Nutrition Facts"
  nutritionFactsCloseButtonText="Close"
  nutritionFactsCloseIconButtonScreenReaderLabel="Close"
  nutritionFactsTriggerText="Nutrition Facts"
/>
```

#### NutritionFacts

If you're just providing a `NutritionFacts` component, it can be destructured from the main JSON.

```jsx
const ai = {jsonObj}  // Direct reference
const { nutritionFacts } = jsonObj  // Destructured

<NutritionFacts
  featureName={ai.name || nutritionFacts.name}
  data={ai.nutritionFacts.data || nutritionFacts.data }

  title="Nutrition Facts"
  modalLabel="This is a modal for AI facts"
  closeButtonText="Close"
  closeIconButtonScreenReaderLabel="Close"
  triggerText="Nutrition Facts"
/>
```

#### DataPermissionLevels

```jsx
const ai = {jsonObj}

 <DataPermissionLevels
  currentFeature={ai.name}
  data={ai.dataPermissionsLevel}

  title="Data Permission Levels"
  currentFeatureText="Current Feature:"
  closeIconButtonScreenReaderLabel="Close"
  closeButtonText="Close"
  modalLabel="This is a Data Permission Levels modal"
  triggerText="Data Permission Levels"
/>
```

### Importing

You can import a Nutrition Facts object by referencing its unique id in the query parameter such as `?id=igniteAgent`. Parameter values are case insensitive.  If an invalid ID is provided the default product (an empty~ish object) is returned.

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

