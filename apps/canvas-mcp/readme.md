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

The MCP Client selector combines curated clients with the MCP-enabled target list from Rulesync 36.0.2, pinned at commit `67c5ff341c325305d9759bf749f2708f5fc395c4`. Rulesync publishes target names and MCP support, but not each client's OAuth key-type or callback requirements. Curated entries carry per-fact evidence. The September 11, 2026 Instructure setup guidance was checked on October 17, 2026; documented requirements are distinguished from probed behavior. Rulesync targets without evidence retain explicit unknown facts.

The UI uses Pantoken components, themes, logos, and custom colors. The production build prunes unused Pantoken token properties and shortens the remaining property names after CSS imports are bundled.

Canvas automatically populates the region-specific Maple Allowed Audience during production developer-key creation (confirmed in production). The user setup page still asks for a region because the MCP endpoint itself is region-qualified. The app does not make requests to Canvas or Maple and does not use a proxy.

## Release Blocker

The admin guide displays an unreviewed scope list containing read/write/delete and introspection scopes. Its Maple revision is recorded; the review note stays in code and copying remains disabled. The customer-key default excludes `mcp-limited`. Do not use it to create a production developer key until the complete per-tool scope manifest has been generated from a reviewed Maple revision and verified by Product/Security. The committed manifest was generated from Maple revision `6368cd5b58b7a3f9d4c004c46f8779712cdb0d14`; Product/Security release review is still pending. Regenerate it from a clean Maple checkout with `node apps/canvas-mcp/scripts/updateScopes.mts /path/to/maple`. The script writes scope names and provenance only, and resets review status to unreviewed.

Client setup descriptions are intentionally generic where vendor-specific OAuth behavior has not yet been verified. Confirm each client's current connection fields and redirect URI before publishing the guide as final instructions.

## Maintenance structure

`src/app.ts` owns state, events and persistence. `src/page.ts` composes the page. Shared admin components live in `src/admin/config.ts`, `server-details.ts`, and `key-settings.ts`; `key-settings-model.ts` resolves client facts into the same Canvas fields in every guide.

Each `src/clients/curated/<name>.ts` exports a typed definition with its own facts, evidence, supported install modes and guides. Add the definition to `clients/index.ts` and add a new ID to `clients/ids.ts` when needed. Existing Rulesync IDs remain accepted aliases. The IDE and CLI variants of Antigravity have separate evidence; CLI instructions must not be applied to the IDE.

`src/guides/types.ts` defines structured text/code and reusable Canvas create/update steps. Enterprise admin guides use the `instui-segmented-control` component from `@pantoken/plugin-custom-components` labeled “1. Canvas” and “2. <provider settings name>”. The Canvas footer advances to provider settings and scrolls to the top; the provider footer advances to client setup. Personal installs show Canvas instructions directly, and the Configuration toggle controls the admin install mode. Copilot Studio uses one ordered guide that creates a key with Redirect URIs blank, saves the connector, adds its generated URI to the key, then completes OAuth. Print expands both surface sections for the selected install mode. Full iframe/embed support is deferred.

Query state includes `install=personal|enterprise` and optional `surface=canvas|provider`. Install mode is saved with preferences; surface and Client ID are not. Enterprise-only clients normalize to enterprise even when an incoming link requests personal. When both key types work, public is preferred; explicit valid private selections remain valid.

Shell-specific commands use Shiki code groups with Windows (PowerShell) and macOS / Linux (Bash) choices. Changing a code group's platform updates all groups and the global tray's Windows / Mac / Auto setting. `platform=windows|mac|auto` is included in setup links and saved with preferences; a valid query value overrides localStorage. Auto detects Windows using browser platform information and otherwise shows macOS / Linux commands. Selecting Auto keeps detection enabled rather than saving the detected platform. Use a `code-group` content block with `windows` and `mac` variants when commands differ by shell; platform-independent snippets remain ordinary `code` blocks.

Claude Code supports personal and enterprise installs. Enterprise public-key setup provides `canvas-mcp` through `managedMcpServers` (Claude Code v2.1.259+) with static OAuth Client ID, callback port 8081, and Canvas scopes; members only sign in to the provisioned connection. Admin instructions also explain the exclusive `managed-mcp.json` alternative and its effect on other servers. Private-key enterprise setup uses an approved-catalog policy instead: administrators allow the exact Canvas endpoint and users register it with the masked `--client-secret` prompt before signing in. Secrets are not embedded in managed settings or setup links. The private-key workflow must not also provision `canvas-mcp` through managed settings or exclusive configuration. These instructions are vendor-documentation evidence, not a live Canvas OAuth compatibility result.

Gemini CLI supports personal and enterprise installs separately from the Gemini Enterprise web client. Enterprise admins enable MCP and add the exact `canvas-mcp` name and endpoint to the Management Console's MCP Servers allowlist (preview), with `trust: false` to preserve tool approvals. Users still need the matching local `mcpServers` entry, or device management can distribute it, then each user runs `/mcp auth canvas-mcp`. Both public and private keys retain the fixed `http://localhost:8081/oauth/callback` URI. Required MCP Servers are deliberately not used: the pinned upstream required-server OAuth schema accepts only scopes, Client ID, and secret, not `redirectUri`, and required servers replace the local definition. Private secrets are supplied separately and entered only in local settings, never in policy examples or setup links. This is documentation/source-backed guidance, not a live Canvas OAuth compatibility result.

Gemini CLI admin pages show a migration notice above the instructions card, based on the supplied guidance about Google's May 2026 transition to Antigravity CLI. Non-Enterprise installs show a danger alert stating Gemini CLI is deprecated and recommending Antigravity CLI. Enterprise installs show a warning explaining that Gemini CLI is expected to continue working for Gemini Enterprise customers, retaining connection instructions while recommending migration. Client pages retain their setup instructions without the admin notice.

Requirements are `documented`, `verified` (source/probe), or `unverified`, per fact. Unknown public/private support remains selectable with a warning. Known incompatibilities block connection actions. Guide source labels/dates are public-facing; private document paths, internal titles, links and source files are not published. The provided guidance was summarized into the client modules; it is not synchronized automatically.

## Evidence and probes

Run `pnpm --filter @instructure.ai/canvas-mcp evidence:check` for a non-blocking 180-day evidence report. New supported assertions need dated evidence; one observed callback does not verify all a client's behavior. Use the Canvas MCP client-requirements issue template for corrections.

The dev-only probe binds to loopback and uses fake credentials (`probe-client`, and `probe-secret` for confidential scenarios). Start it with an explicitly registered synthetic callback:

```sh
pnpm --filter @instructure.ai/canvas-mcp probe http://localhost:8081/callback
PROBE_AUTH_METHOD=client_secret_post pnpm --filter @instructure.ai/canvas-mcp probe http://localhost:8081/callback
PROBE_AUTH_METHOD=client_secret_basic pnpm --filter @instructure.ai/canvas-mcp probe http://localhost:8081/callback
PROBE_DCR=1 pnpm --filter @instructure.ai/canvas-mcp probe http://localhost:8081/callback
```

Its MCP URL is `http://127.0.0.1:8765/mcp` (`PROBE_PORT` can override the port). It advertises discovery metadata and exercises authorization, PKCE, token exchange, refresh and minimal MCP initialization. Run public, confidential and DCR cases separately. It prints only normalized observations; raw state, headers, codes, verifiers, secrets and tokens are excluded. Review sanitized fixtures before adding them under `scripts/probe/results/`; raw captures are ignored. No vendor-client run is recorded yet, and a stub run is not an end-to-end Canvas compatibility claim. Cloud probing/public tunnels remain deferred.

## Remaining verification

- Scope generation is pinned and reproducible, but Product/Security release review is pending. Copying stays disabled until provenance is marked reviewed with a review date.
- Codex callback derivation matches pinned upstream source and independent test vectors. Canvas callback mode and a known-good URI from a real Codex run still need confirmation; computed copying stays disabled until then. The browser makes no metadata requests.
- Updated guidance reports a Canvas MCP authentication bug for ChatGPT, so the app blocks that connection flow without claiming a registration limitation.
- Superhuman Go and Antigravity IDE lack source-backed guides. Gemini CLI's supplied key-type/secret instructions conflict; its guide stays provisional. Missing enterprise instructions are not inferred.
- Corrected Anthropic/Microsoft files were incorporated after the initial duplicate content was replaced. Updated Claude organization steps are explicitly unavailable, so that mode stays pending. The Microsoft authorization-URL typo was corrected using the Maple endpoint and the original setup guide (`/login/oauth2/auth`). Public/private Claude support remains attributed to the original setup guide; the updated guide emphasizes public setup.
- Browser layout/AX inspection and keyboard regression checks are separate from a complete accessibility audit. The automatica11y version check could not reach the npm registry (`ENOTFOUND registry.npmjs.org`); no audit report was produced. Real screen-reader, Letter/A4 print and vendor beta-tenant checks remain release tasks.

The Pages deployment workflow runs the app tests before publishing. Unreviewed scope copying and known-incompatible connection actions remain disabled in built output.

Admin setup renders instructions and field values without prerequisites or research-status notices. Evidence and unresolved compatibility details stay in the client definitions. The Codex callback uses per-server mode based on the supplied guide, current Codex documentation, and Maple metadata at the pinned revision (which omits the RFC 9207 flag). Claude organization setup and Gemini CLI OAuth fields are sourced from vendor documentation; this does not claim a live Canvas OAuth test.

Curated picker labels use provider and tool (for example, `OpenAI · Codex`), sorted by that label. Codex, ChatGPT, Antigravity, and Antigravity CLI support both personal and enterprise installation guides. Enterprise mode adds managed configuration, workspace publication, or Gemini Enterprise sign-in instructions respectively. Antigravity enterprise support targets the current app/CLI; legacy setup-link aliases remain accepted. Known Canvas connection blockers remain in code without hiding administrator provisioning instructions.

The client page inherits installation mode from Configure a Server and has no separate personal/enterprise selector. A guide's `clientSetup` declares member-only steps and whether the user must enter server connection fields. Organization-managed web connectors hide Server Details; locally configured enterprise clients retain them. Client output never includes Canvas key creation or administrator provisioning steps, including in print.

Server output excludes client-only actions and verification steps unless a verification step is explicitly marked for the server administrator. Personal server setup renders Canvas steps only. Enterprise server setup retains organization provisioning and registration; user authentication and validation stay on the client page.
