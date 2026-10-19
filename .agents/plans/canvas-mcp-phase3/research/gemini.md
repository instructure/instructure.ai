# Gemini CLI and Gemini Enterprise: Canvas MCP connection research

Date checked: 2026-10-17. Canvas MCP uses OAuth with a pre-registered Client ID and optional Client Secret (no dynamic client registration).

## Migration status (Gemini CLI to Antigravity CLI)
- geminicli.com MCP page (fetched 2026-10-17) says Gemini CLI was replaced by Antigravity CLI on June 18, 2026 for unpaid-tier and Google One users. Linked blog post decides applicability.
- Secondary sources only (not Google): announced at I/O on 2026-05-19; enterprise Code Assist Standard/Enterprise licenses keep Gemini CLI; no 1:1 parity. Not verified against a Google page.
- Migration guide: https://antigravity.google/docs/cli/gcli-migration (old path /docs/gcli-migration redirects). It gives no dates and does not mention Enterprise or Code Assist. `agy` first run detects legacy config and offers to migrate. MCP moves from `~/.gemini/settings.json` to `~/.gemini/config/mcp_config.json` (global) or `.agents/mcp_config.json` (workspace); remote servers use `serverUrl` instead of `url`/`httpUrl`. OAuth field handling in Antigravity: Not documented on that page (other agent covers it).

## A. Gemini CLI, personal
Source: https://geminicli.com/docs/tools/mcp-server/ and https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md (checked 2026-10-17).

Facts from docs:
- `oauth` fields: `enabled`, `clientId` (optional with dynamic registration), `clientSecret` (optional for public clients), `authorizationUrl`/`tokenUrl` (auto-discovered if omitted), `issuer` (RFC 9207), `authorizationResponseIssParameterSupported`, `scopes`, `redirectUri`, `tokenParamName`, `audiences`.
- `url` = SSE transport; `httpUrl` = Streamable HTTP. OAuth works with both.
- Redirect URI default: `http://localhost:<random-port>/oauth/callback` (OS-assigned). Set `redirectUri` to pin a port. Register that exact URI in Canvas.
- Tokens stored in `~/.gemini/mcp-oauth-tokens.json`; refreshed automatically when a refresh token exists.
- `trust` defaults false (true bypasses tool confirmations). `includeTools`/`excludeTools` available; excludeTools wins. `mcp.allowed` / `mcp.excluded` filter by name; avoid underscores in server names.
- Limitation: needs a local browser and localhost redirect; fails in headless, SSH without X11, containers without browser.
- Prerequisites/roles: Not documented for personal use.

Steps:
1. In Canvas, create the developer key; add redirect URI `http://localhost:8081/oauth/callback` (any fixed port works if it matches `redirectUri`). Copy Client ID (and secret if private key).
   SCREENSHOT: canvas_key_redirect_uri — Canvas developer key with the localhost callback in Redirect URIs.
2. Open `~/.gemini/settings.json` (CLI, no UI). Merge under `mcpServers`:
   `canvas-mcp: { httpUrl, oauth: { enabled: true, clientId, [clientSecret], authorizationUrl, tokenUrl, scopes, redirectUri } }`.
   SCREENSHOT: gemini_cli_settings_json — settings.json with the canvas-mcp entry (secret redacted).
3. Run `gemini`, then `/mcp auth canvas-mcp` (`/mcp auth` alone lists servers needing auth). Browser opens; sign in to Canvas and approve.
   SCREENSHOT: gemini_cli_mcp_auth — terminal after `/mcp auth canvas-mcp` showing browser prompt.
   SCREENSHOT: canvas_consent_screen — Canvas authorize page.
4. Verify: `/mcp` lists canvas-mcp connected with tools. Re-run `/mcp auth canvas-mcp` after tokens expire.
   SCREENSHOT: gemini_cli_mcp_list — /mcp output with canvas-mcp and tool list.

## B. Gemini CLI, enterprise
Source: https://geminicli.com/docs/admin/enterprise-controls/ (checked 2026-10-17); console link https://goo.gle/manage-gemini-cli.
Facts:
- MCP Enabled/Disabled: default disabled.
- MCP Servers (preview) allowlist: default empty. Fields `url` (req), `type` (req, `sse` or `http`), `trust`, `includeTools`, `excludeTools`. Non-empty list ignores unlisted local servers. Server must be in both allowlist and local config (matched by name). Admin `url`/`type`/`trust` override local. Client clears local `command`, `args`, `env`, `cwd`, `httpUrl`, `tcp`.
- Required MCP Servers (preview): default empty. Fields: `url`, `type`, `trust` (default true), `description`, `authProviderType` (`dynamic_discovery`, `google_credentials`, `service_account_impersonation`), `oauth` (`scopes`, `clientId`, `clientSecret` only), `targetAudience`, `targetServiceAccount`, `headers`, `includeTools`/`excludeTools`, `timeout`. Replaces a same-name local server. No `redirectUri` in documented oauth schema, so the random port would not match a Canvas-registered URI.
- Menu labels, admin roles, license prerequisites: Not documented on the page.

Steps:
1. Canvas: create key with redirect `http://localhost:8081/oauth/callback` (SCREENSHOT: canvas_key_redirect_uri).
2. Open the Management Console via goo.gle/manage-gemini-cli. Enable MCP (SCREENSHOT: gemini_cli_console_mcp_toggle — MCP setting enabled).
3. Add canvas-mcp to MCP Servers (preview) allowlist with `url`, `type: http`, `trust: false` (SCREENSHOT: gemini_cli_console_allowlist — allowlist entry).
4. Users (or device management) add the local `canvas-mcp` entry from section A to `~/.gemini/settings.json`, same name.
5. Pilot: `/mcp`, `/mcp auth canvas-mcp`, confirm callback and tools (SCREENSHOT: gemini_cli_mcp_list).
Limitation: do not use Required MCP Servers for a fixed-redirect OAuth server (documented schema lacks `redirectUri`).

## C. Gemini Enterprise, admin setup
Source: https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server and https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/override-constraint-for-custom-mcp-data-stores (checked 2026-10-17).

Prerequisites (all from docs):
1. Org policy "Disable custom MCP server connector for Gemini Enterprise" must be overridden (feature is off by default). Role: Organization Policy Administrator (`roles/orgpolicy.policyAdmin`). Console > IAM & Admin > Organization Policies > pick project > filter by the constraint name > click it > Manage Policy > Override parent's policy > Add a new rule, enforcement OFF > Set Policy. Status shows Not enforced.
   SCREENSHOT: gcp_orgpolicy_override — constraint set to Not enforced.
2. Allow egress FQDNs for MCP, authorization, token domains (domain names only): https://docs.cloud.google.com/gemini/enterprise/docs/connectors/configure-allowed-egress-fqdns.
3. If project enforcement or VPC Service Controls apply, add `custom_mcp` to allowed data sources.
4. Admin needs Discovery Engine Editor (`roles/discoveryengine.editor`).
5. Canvas: register redirect URI `https://vertexaisearch.cloud.google.com/oauth-redirect` (fixed), copy Client ID/secret.
   SCREENSHOT: canvas_key_redirect_uri_gemini — Canvas key with the vertexaisearch redirect.
6. Cloud Run only: grant `roles/run.invoker` to the discoveryengine service agent (n/a for Canvas MCP unless hosted behind Cloud Run auth).

Steps:
1. Google Cloud console > Gemini Enterprise > Data stores > Create data store. SCREENSHOT: ge_data_stores_list — Data stores page with Create data store.
2. In "Select a data source", search "Custom MCP Server" in Search sources, select card, click Add MCP server. SCREENSHOT: ge_select_custom_mcp — the card.
3. MCP Server Configuration > Authentication settings > OAuth 2.0. Fields: MCP Server URL (HTTPS), Authorization URL (base only, no query), Authorization URL Parameters (optional), Token URL, Client ID, Enable PKCE Support (optional, recommended if provider supports it), Client Secret, Scopes (space-separated). SCREENSHOT: ge_mcp_oauth_form — filled form, secret masked.
4. Click Verify Auth, sign in to Canvas, approve; click Continue, then Continue again. SCREENSHOT: ge_verify_auth — success state.
5. Configure your data connector: select location from Multi-region list, enter Your data connector name, click Create. SCREENSHOT: ge_connector_name_region.
6. Open the data store; wait for state Creating to Active. SCREENSHOT: ge_data_store_active.
7. Actions > Reload custom actions (reauthenticates, runs tools/list), select actions, click Enable actions (max 100 at once; off by default). SCREENSHOT: ge_actions_enable — action list with Enable actions.
8. Optional: tool annotation `readOnlyHint: true` skips the per-action confirmation prompt; reload actions after changes.

Limitations: StreamableHTTP only (no SSE); publicly trusted TLS cert; max 100 enabled actions; cannot attach an existing data store; no dynamic client registration auto-run (admin supplies client). Security review of the stored secret is advised by the doc.

## D. Gemini Enterprise, end user
Source: set-up page above says end-user steps are not described in detail; scopes requested at user authorization. A SecOps example (https://docs.cloud.google.com/chronicle/docs/secops/use-google-secops-mcp) says users open the main chat, toggle the connected data store on at the bottom, and complete the sign-in prompt. Exact label for Canvas: Not documented.
1. Open the Gemini Enterprise app, start a chat. SCREENSHOT: ge_chat_home.
2. Enable the Canvas data store/connector in the chat input area (label unverified). SCREENSHOT: ge_chat_toggle_connector.
3. Complete Canvas sign-in prompt. SCREENSHOT: ge_user_oauth_prompt.
4. Verify by asking for Canvas courses; approve the action confirmation unless readOnlyHint is set. SCREENSHOT: ge_chat_canvas_result.

## Conflicts / corrections for repo files
gemini-cli.ts:
- Redirect: default is a random port; repo's fixed 8081 via `redirectUri` is consistent with docs. Fine.
- Evidence label calls required-server schema "no fixed redirect URI"; docs list oauth as `scopes`, `clientId`, `clientSecret` only. Consistent.
- Repo does not mention that the enterprise allowlist clears `httpUrl` locally and that `type` must be set; repo's policy JSON (`url`, `type: http`, `trust: false`) is fine, but the local `httpUrl` is cleared by the client, so confirm in a pilot that a local entry using `httpUrl` still connects (Not documented how the client then picks the transport; likely uses admin `url`/`type`).
- Repo lacks the Antigravity migration/unpaid-tier note (June 18, 2026) and the headless limitation.
- Enterprise prerequisite "Management Console access" has no documented role names.
gemini-enterprise.ts:
- Prerequisites omit: org policy override (Organization Policy Administrator), egress FQDN allowlist, `custom_mcp` allowed data source for VPC-SC.
- Repo says "Leave Enable PKCE Support unchecked" and `pkce: off`; docs say PKCE is optional and recommended if provider supports it. Keep unchecked only if Canvas does not support PKCE (verify separately).
- Repo says "Scopes: {scope}"; docs require space-separated format.
- Repo's step 3 "Verify Auth ... then Continue" omits the second Continue.
- Repo step 6 "Open Actions ... enable" should read Actions > Reload custom actions > select > Enable actions.
- Repo end-user steps ("ask Gemini ...") omit the connector toggle documented in the SecOps example; label unverified.
- `public: no` key type: docs list Client Secret field without saying it is required; "Not documented" whether it may be blank. Repo claim is unverified.
- Redirect URI `https://vertexaisearch.cloud.google.com/oauth-redirect` matches docs.
