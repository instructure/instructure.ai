# @instructure.ai/canvas-mcp

Single-page setup guide for connecting Canvas to supported MCP clients, served at `/canvas-mcp/`. Configure a server and connect a client from the tabs in the app; the selected tab is represented by `page=admin` or `page=connect` in the query string.

## Development

From the repository root:

```sh
pnpm dev canvas-mcp
pnpm test canvas-mcp
pnpm --filter @instructure.ai/canvas-mcp typecheck
pnpm --filter @instructure.ai/canvas-mcp build
```

The app validates Canvas tenant domains and builds production or beta server URLs. The selected tab is stored as `page=connect` or `page=admin`; switching tabs preserves the domain, client, key type, region, and optional public Client ID in the query string. Those setup preferences may also be saved in localStorage. Client secrets and access tokens are never requested or stored.

The Client ID input is limited to 17 characters to prevent pasting a full API Key Secret, which is longer than a Client ID.

The MCP Client selector combines curated clients with the MCP-enabled target list from Rulesync 36.0.2, pinned at commit `67c5ff341c325305d9759bf749f2708f5fc395c4`. Rulesync publishes target names and MCP support, but not each client's OAuth key-type or callback requirements. Curated entries retain verified metadata; other Rulesync targets are marked for OAuth verification in the admin setup.

The UI uses Pantoken components, themes, logos, and custom colors. The production build prunes unused Pantoken token properties and shortens the remaining property names after CSS imports are bundled.

Canvas automatically populates the region-specific Maple Allowed Audience during production developer-key creation (confirmed in production). The user setup page still asks for a region because the MCP endpoint itself is region-qualified. The app does not make requests to Canvas or Maple and does not use a proxy.

## Release Blocker

The admin guide currently displays only the known baseline scopes and explicitly marks them incomplete. Do not use it to create a production developer key until the complete per-tool scope manifest has been generated from a reviewed Maple revision and verified by Product/Security. The internal Maple source is not available in this repository, so the manifest must be supplied by a maintainer with access.

Client setup descriptions are intentionally generic where vendor-specific OAuth behavior has not yet been verified. Confirm each client's current connection fields and redirect URI before publishing the guide as final instructions.
