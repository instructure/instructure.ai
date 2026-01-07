# @instructure.ai/roadmap

![version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fapps%2Froadmap%2Fpackage.json&query=%24.version&label=version&labelColor=%230e1721&color=%234279B6) ![coverage](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Finstructure%2Finstructure.ai%2Frefs%2Fheads%2Fmain%2Fapps%2Froadmap%2Fcoverage%2Fcoverage.yml&query=coverage.totals.total&logo=vitest&label=coverage&labelColor=%230E1721&color=%234279B6)

## Instructure Roadmap Embed

This app provides an iframe view of the Instructure Roadmap for use in Canvas sandboxes.

## Usage

Usage of this tool is faciliated through SEnsei Panda.app, use it to configure the roadmap page in a sandbox.

### Pendo API

SEnsei Panda.app uses a [custom object](https://instructure.ai/roadmap/pendo.json) to query the Pendo API for a pre-filtered subset of Instructure Roadmap items.

### Canvas API

SEnsei Panda.app then uses the Canvas API to embed an iFrame of this app with the pendo API response data encoded as a value in a `data` attribute in a Canvas page.

### Roadmap App

This App decodes the Pendo API data and displays the roadmap items in the iFrame. It also acts as a pseudo-LTI so that it can interact with Canvas as if it were a native tool.

### Additional Configuration

Users configuring a Canvas sandbox also need to add [themeEditor.js](https://instructure.ai/roadmap/themeEditor.js) and [themeEditor.css](https://instructure.ai/roadmap/themeEditor.css) to the root account [Theme Editor](https://community.instructure.com/en/kb/articles/661411-how-do-i-upload-custom-javascript-and-css-files-to-an-account) in Canvas.

## Notes

### Updating

The Roadmap app does **not** automatically update content from SEnsei Panda / Pendo. It reads the static value from its data-attribute. If you need to update a Canvas page's roadmap content, follow the instructions in SEnsei Panda.

### Troubleshooting

* Make sure you're not logged in with a site admin account.
* Make sure themeEditor.js and themeEditor.css are installed in the current Sub-Account.
* Make sure the iframe has a valid data-roadmap attribute.
* Make sure access to instructure.ai/roadmap is not blocked by a firewall.
* Try reloading the page.

#### Blank Page

If you've gone through the configuration process for a roadmap page in SEnsei Panda and don't see anything (blank page), please follow the troubleshooting steps above.  If you still have the same result, please [open an issue](https://github.com/instructure/instructure.ai/issues) and include any error messages in your browser's console.

#### "Oops!" Error Page

If you see an "Oops!" page, and have gone through all the troubleshooting steps above, please open an issue and include the HTML content of the Canvas page that contains the roadmap iFrame.