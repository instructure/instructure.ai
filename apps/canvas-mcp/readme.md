# @instructure.ai/canvas-mcp

Static setup guide for connecting Canvas to supported MCP clients. The app is served at `/canvas-mcp/` and the developer-key guide at `/canvas-mcp/admin/`.

## Development

From the repository root:

```sh
pnpm dev canvas-mcp
pnpm test canvas-mcp
pnpm --filter @instructure.ai/canvas-mcp typecheck
pnpm --filter @instructure.ai/canvas-mcp build
```

The app validates Canvas tenant domains, builds production or beta server URLs, and stores only the selected domain, client, key type, and region in localStorage. Share links can include a domain, region, client, key type, and public Client ID. Client secrets and access tokens are never requested or stored.

Canvas automatically populates the region-specific Maple Allowed Audience during production developer-key creation (confirmed in production). The user setup page still asks for a region because the MCP endpoint itself is region-qualified. The app does not make requests to Canvas or Maple and does not use a proxy.

## Release Blocker

The admin guide currently displays only the known baseline scopes and explicitly marks them incomplete. Do not use it to create a production developer key until the complete per-tool scope manifest has been generated from a reviewed Maple revision and verified by Product/Security. The internal Maple source is not available in this repository, so the manifest must be supplied by a maintainer with access.

Client setup descriptions are intentionally generic where vendor-specific OAuth behavior has not yet been verified. Confirm each client's current connection fields and redirect URI before publishing the guide as final instructions.
