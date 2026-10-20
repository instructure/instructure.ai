# @instructure.ai/canvas-mcp

Single-page setup guide for connecting Canvas to supported MCP clients, served at `/canvas-mcp/`. Configure a server, connect a client, or open Help from the tabs in the app; the selected tab is represented by `page=admin`, `page=connect`, or `page=help` in the query string.

Help includes a **Contact** segment (`page=help&help=contact`) linking to the [Instructure Community Canvas MCP group](https://community.instructure.com/en/group/70-canvas-mcp) and the issue forms below.

## Contributing

Open an issue using the relevant template below, or submit a pull request with the affected client, install mode, and supporting evidence. Use synthetic examples and redact secrets, tokens, authorization codes, student records, and private details from text, logs, and screenshots.

### Guides (including screenshots)

[Request or correct a guide](https://github.com/instructure/instructure.ai/issues/new?template=canvas-mcp-guides.yml).

- Edit client-specific instructions in [src/clients/curated/](src/clients/curated/). Personal and enterprise guides are separate; specify the supported public/private key configuration.
- Use the existing structured content and shared Canvas steps defined in [src/guides/types.ts](src/guides/types.ts). Provide Windows and macOS/Linux command variants where needed, with dated source links.
- Add sanitized screenshots to [public/images/](public/images/), register their paths and dimensions in [screenshot-manifest.ts](src/guides/screenshot-manifest.ts), and reference them through the [screenshot helper](src/guides/screenshots.ts) with descriptive alt text. Capture the relevant step without exposing credentials or personal data.

### Validation (client status and evidence records)

[Report a validation result](https://github.com/instructure/instructure.ai/issues/new?template=canvas-mcp-validation.yml).

The validation record lives in the [client definitions](src/clients/curated/). Record the client version, operating system, test date, install mode, key type, and observed outcome. Use the [client status and evidence types](src/clients/types.ts) for `status`, supported facts, source links, and blockers.

A successful configuration or sign-in alone does not prove that tools work: include the result of a safe, permitted tool call. Do not mark untested configurations as validated or generalize one result to other versions, install modes, or key types. For failures, provide sanitized reproduction steps and distinguish observations from suspected causes.

### FAQs

[Suggest an FAQ](https://github.com/instructure/instructure.ai/issues/new?template=canvas-mcp-faq.yml).

Edit [faqs.json](src/help/faqs.json). Each group has a `title` and `entries`; each entry has a question in `title` and an answer in `text`. Keep answers focused on this guide and its Available Tools, setup, or client behavior.

- Use backticks for inline code, `**bold**` for emphasis, and `\n` for paragraph breaks. Raw HTML is escaped.
- For an unordered list, add `"type": "list"` and use a `text` array.
- Decorative icons use tokens such as `{{icon:check}}`; supported names are listed in [inline.ts](src/help/inline.ts). Include meaningful text alongside icons.
- Optional `commands` accepts a shared string or `{ "windows": "...", "mac": "..." }` for copyable platform-specific blocks.

### Common Issues

[Report a common issue](https://github.com/instructure/instructure.ai/issues/new?template=canvas-mcp-common-issues.yml).

Edit [common-issues.json](src/help/common-issues.json) using the same entry format as FAQs. Group issues under General, Admins, Users, or Clients. Include the symptom or sanitized diagnostic, why it occurs when known, actionable troubleshooting, and when to escalate to an administrator or Instructure.

Keep client compatibility blockers and validation evidence in the [client definitions](src/clients/curated/) as well when applicable; the Known Issues list is generated from those records. Do not recommend bypassing permissions or OAuth validation.

### Other issues and bugs

[Report another type of issue](https://github.com/instructure/instructure.ai/issues/new?template=canvas-mcp-client.yml).

Use this form for bugs or other issues not covered by the templates above. Include the client and version, operating system or browser, Canvas and MCP server details, environment, install mode, and key type where applicable. Provide steps to reproduce, expected behavior, actual behavior, and sanitized logs or screenshots. Replace tenant names with synthetic values and never include credentials or full authorization URLs.

### Checking changes

Run commands from the repository root:

```sh
pnpm --filter @instructure.ai/canvas-mcp dev
pnpm --filter @instructure.ai/canvas-mcp test
pnpm --filter @instructure.ai/canvas-mcp typecheck
pnpm --filter @instructure.ai/canvas-mcp evidence:check
pnpm --filter @instructure.ai/canvas-mcp build
```

Check the affected guide or Help section in the browser, including keyboard access, platform switching, copy buttons, and screenshots. Evidence staleness and missing screenshots are reported as advisory items by `evidence:check`.