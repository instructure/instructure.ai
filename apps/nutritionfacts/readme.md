# @instructure.ai/nutritionfacts

![version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fapps%2Fnutritionfacts%2Fpackage.json&query=%24.version&label=version&labelColor=%230e1721&color=%234279B6) ![coverage](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fapps%2Fnutritionfacts%2Fcoverage%2Fcoverage.yml&query=coverage.totals.total&logo=vitest&label=coverage&labelColor=%230E1721&color=%234279B6)

## IgniteAI Nutrition Facts Viewer

An interactive web application for viewing, and exporting Nutrition Facts for [IgniteAI features](https://www.instructure.com/ignite-ai). Built with React, TypeScript, and Vite, it provides a modern UI for customizing Nutrition Facts, layouts, and exporting results in various formats.

### Features

- **Customizable Layouts**: Change the appearance of the Nutrition Facts, including revision, permissions, disclaimer, and copyright.
- **Export**: Export Nutrition Facts via iFrame or Print.
- **Modern UI**: Uses [@instructure/ui](https://github.com/instructure/instructure-ui) for a responsive and accessible interface.
- **Dark Mode Support**: Automatically adapts to your system's color scheme.

### Usage

[View the tool on the web](https://instructure.ai/nutritionfacts) and select a feature to view its Nutrition Facts. You can:

- View the rendered Nutrition Facts
- Print (Formatted nicely)
- Copy an iFrame embed code to your clipboard
- Copy the permalink to your clipboard

### Advanced Usage

#### Layout

The page layout already includes mobile responsiveness, print styles, iFrame styles, and light and dark mode. Content layout can further be modified using the query parameter by setting `PageLayout` object key values explicitly to `false`:

```json
&copyright=false   // Copyright notice
&disclaimer=false  // Marketing copy about IgniteAI
&revision=false    // Nutrition Facts revision version
```

#### Exporting

Nutrition Facts provide two primary export methods: permalink & embed.

##### Permalink

A permalink is an evergreen link to a specific feature's Nutrition Facts based on its unique id. Permalinks are structured as `ignite.ai/nutritionfacts/?id=<uid>`. When a permalink is accessed, the `uid` is used to fetch the latest revision of the Nutrition Facts and render them.

When viewing a Nutrition Facts page a "Copy permalink" helper is displayed in the header.

##### Embed

The Nutrition Facts pages can be embedded in other sites via iFrame. When embedded in an iFrame the page automatically applies styles to only display the content of the Nutrition Facts - not the header, background, or footer content.

When viewing a Nutrition Facts page a "Copy embed code" helper is displayed in the header.

The "Copy embed code" generates an iFrame that is sized to fit the content without scrolling and also includes a copy of the `product.name` and `product.description` in a hidden div to assist in searching / indexing in the embedded site. When viewing the embedded Nutrition Fact the latest version is fetched and displayed.

> [!NOTE]
> Only the iFrame content is rendered dynamically. The copy of the product name / description are not dynamically updated and will need to be manually updated if either change significantly from the time the embed code is generated.

This makes outputting AI Components fairly simple, and standard.
