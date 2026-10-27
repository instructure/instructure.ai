# Codex and ChatGPT: connecting Canvas MCP (static Client ID, optional secret)

Checked 2026-10-17. Local `codex` binary: codex-cli 0.163.0 (latest stable on GitHub releases, 2026-10-15).
Fetch limits: help.openai.com and some third-party pages returned HTTP 403 to the fetcher. Facts from help.openai.com are marked (search snippet) and must be re-verified in a browser before publishing screenshots/copy.

## A. OpenAI Codex (CLI, IDE extension, ChatGPT desktop app Codex)

Sources: https://learn.chatgpt.com/docs/extend/mcp (developers.openai.com/codex/mcp 308-redirects here), https://learn.chatgpt.com/docs/enterprise/managed-configuration, https://learn.chatgpt.com/docs/enterprise/admin-setup, https://learn.chatgpt.com/docs/enterprise/apps-and-connectors; `codex mcp add --help` / `codex mcp login --help` run locally on 0.163.0. Date checked: 2026-10-17.

### A1. Personal (CLI)

1. Install Codex CLI and sign in. Version requirement: Not documented on the MCP page. Static-client flags exist in 0.163.0 (verified by local --help). Earliest version with `--oauth-client-id`: Not documented (release notes fetched did not mention it).
2. Register the server with the static client:
   `codex mcp add canvas-mcp --url "<mcpUrl>" --oauth-client-id "<clientId>"`
   With secret: add `--oauth-client-secret "$CANVAS_CLIENT_SECRET"`. A secret requires a client ID; both must be nonempty.
3. Codex writes to `~/.codex/config.toml`:
   ```toml
   [mcp_servers.canvas-mcp]
   url = "<mcpUrl>"
   [mcp_servers.canvas-mcp.oauth]
   client_id = "<clientId>"
   callback_url = "http://127.0.0.1/callback"
   ```
   Doc: the secret is saved in plaintext as `mcp_servers.<name>.oauth.client_secret` in config.toml; keep it private and out of version control. (Repo guide does not warn about this; add a warning for private keys.)
4. `codex mcp add` prints the exact callback URL to register with the provider (Canvas developer key redirect URI). Register it as shown.
5. Sign in: `codex mcp login canvas-mcp [--scopes "a,b"] [--no-browser] [--oauth-client-registration auto|cimd|dcr] [--oauth-resource <resource>]` (flags verified locally; `--scopes`, `--no-browser`, `--oauth-resource` are NOT on the web docs page). `mcp add` flags `--oauth-client-registration` and `--oauth-resource` also exist locally.
6. Verify: `codex mcp list`; `codex mcp get canvas-mcp`; in a session type `/mcp`. (`mcp get` is not mentioned on the docs page; present in repo guide, existence not verified here.)

### A2. Personal (IDE extension and desktop app)

- Same `~/.codex/config.toml` is shared by the ChatGPT desktop app, CLI and IDE extension (doc quote: they "share this configuration").
- Desktop app: Settings -> **MCP servers** -> **Add server** -> choose **Streamable HTTP**, enter URL, save, select **Restart**, then **Authenticate**. `/mcp` in the composer lists servers.
  SCREENSHOT: codex_desktop_mcp_servers_add — Settings > MCP servers with Add server and Streamable HTTP selected, Canvas MCP URL entered.
  SCREENSHOT: codex_desktop_authenticate — server row showing the Authenticate button.
- IDE extension: gear menu -> **MCP servers** -> **Add server** -> **STDIO** or **Streamable HTTP** -> save -> **Restart extension** -> **Authenticate**.
  SCREENSHOT: codex_ide_mcp_servers_add — IDE gear menu > MCP servers > Add server form.
- The UI has no documented fields for OAuth client ID/secret/callback. Doc: "set those through the CLI or config.toml". So for a static client, run `codex mcp add` first (or edit config.toml), then use Authenticate in the UI.
- IDE extension does not support plugins (apps-and-connectors page), but locally configured MCP servers work there.

### A3. Callback behavior

- Registered callback is shown by `codex mcp add`. Default `http://127.0.0.1/callback` (no port: Codex inserts the active listener port at login; only for `http://127.0.0.1`, not `localhost`, IPv6 or HTTPS).
- If the authorization server does not advertise issuer support (RFC 9207 `authorization_response_iss_parameter_supported`), Codex appends a server-specific ID, e.g. `/callback/XuuuHAzzHOni`. Matches repo comment about Maple.
- Config keys: `mcp_oauth_callback_port` (global listener port), `mcp_servers.<name>.oauth.callback_port` (per-server override), `mcp_oauth_callback_url` (custom path or remote ingress URL, e.g. `https://devbox.example.internal/callback`). A port inside the URL does not set the listener; set the port separately. Local callbacks bind locally; non-local callbacks bind 0.0.0.0.
- `iss` checks: mismatched `iss` always fails; missing `iss` fails if the server advertises issuer support. Malformed callback URL is a hard failure.
- Scopes: if server advertises `scopes_supported`, Codex uses those; otherwise scopes from config.toml.
- Registration order: configured client ID skips registration (so static Canvas key bypasses CIMD/DCR). CIMD metadata URLs `https://chatgpt.com/oauth/codex/client.json` and `.../<callback_id>/client.json`.
- Not documented: exact way the callback ID is computed (repo cites source commit 9be8d6e; not re-verified this pass).

### A4. Enterprise (managed Codex)

Sources: managed-configuration page above, admin-setup page, apps-and-connectors page. Date checked 2026-10-17.
Prerequisites: ChatGPT Enterprise workspace (admin-setup page targets Enterprise; exact plan tiers "Not documented" on page). Admin role in workspace.
Steps:

1. Admin Console -> **Agent Security** (replaces "Policies & Configuration") to deliver cloud requirements, OR deploy `requirements.toml` as `/etc/codex/requirements.toml` (Unix/macOS) or `%ProgramData%\OpenAI\Codex\requirements.toml` (Windows), OR macOS MDM domain `com.openai.codex` key `requirements_toml_base64` (base64, no line wrapping).
   SCREENSHOT: codex_agent_security_requirements — Admin Console Agent Security page with the requirements editor.
2. If you set `mcp_servers`, a server is enabled only if both name AND identity match; empty `[mcp_servers]` disables all. Allow Canvas MCP:
   ```toml
   [mcp_servers.canvas-mcp]
   identity = { url = "<mcpUrl>" }
   ```
   Streamable HTTP identity matches on `url` (exact, prefix or regex in structured form). The table key must equal the server name users configure (`canvas-mcp`).
3. Members register the server themselves with the A1 commands (or admin distributes `config.toml`/`managed_config.toml` defaults; managed_config.toml sets startup defaults only). Each member completes their own Canvas sign-in. Canvas developer key and redirect URIs must be registered by the Canvas admin first.
4. Precedence (low to high): system requirements.toml, Agent Security cloud requirements, legacy managed_config fields, macOS MDM. Conflicts fall back to a compatible value and notify the user. Cloud fetch failure with no valid cache = startup error.
5. Auth-related keys (`allowed_login_methods`, `allowed_chatgpt_workspaces`, `cli_auth_credentials_store`, `chatgpt_base_url`) are ignored in cloud requirements; must be local/MDM.
6. Verify: user runs `codex mcp list` / `/mcp`; a disallowed server shows disabled.
   Not documented: whether `requirements.toml` can pre-seed `oauth.client_id`; distributing a client secret via managed config (secret would sit in plaintext config.toml; flag for Security review). Workspace RBAC grants seats via Roles and workspace permissions (separate page, not fetched).

### A5. Repo comparison (codex.ts)

- Commands, flag names, `/mcp`, 8081 callback pattern match docs. OK.
- Enterprise `identity = { url = ... }` matches docs.
- Gaps: no secret-in-plaintext warning for private keys; `--no-browser` and `--oauth-resource` not mentioned; desktop app UI path (Settings > MCP servers > Add server > Authenticate) not in guide; Windows/other callback note: docs say `http://localhost:8081/callback` port form is fine only because port set explicitly; docs default is `http://127.0.0.1/callback`. Repo's `localhost` callback with explicit port is consistent with docs (explicit port requires separate `mcp_oauth_callback_port`, which repo sets).
- Repo `-c` overrides before `mcp add` are valid CLI usage (--config option exists), but docs recommend persisting via config keys or `oauth.callback_port`; not a conflict.

## B. ChatGPT (chatgpt.com web and ChatGPT Desktop)

Sources: https://developers.openai.com/api/docs/guides/custom-mcp-server, https://developers.openai.com/plugins/deploy/connect-chatgpt, https://developers.openai.com/api/docs/mcp, https://developers.openai.com/plugins/build/auth (fetched via summarizer), https://learn.chatgpt.com/docs/enterprise/apps-and-connectors, https://learn.chatgpt.com/docs/enterprise/plugin-management. help.openai.com article 12584461 ("Creating custom MCP apps in ChatGPT") returned 403; its content below is from a search snippet only. Date checked 2026-10-17.

TERMINOLOGY CHANGE: vendor docs now call custom apps/connectors "plugins". Entry point is **ChatGPT Plugins** (https://chatgpt.com/plugins), not Settings -> Apps -> Create.

### B1. Personal flow (web only)

Prerequisites: Plan/role: Not documented on developer pages. Developer docs: "You need to use ChatGPT on the web"; workspace permissions and security restrictions (including Lockdown) apply. Developer mode requirement: Not documented on the current pages (older help article naming "Developer mode" exists; current "Create plugins with MCPs" permission is the newer name per search snippet).
Steps:

1. Go to https://chatgpt.com/plugins.
2. Select the plus button -> **Add custom MCP server**.
   SCREENSHOT: chatgpt_plugins_add_custom_mcp — Plugins page with plus button menu showing Add custom MCP server.
3. Enter name and optional description. Under **Connection** choose public endpoint: enter **Server URL** including `/mcp` path (or **Tunnel**).
   SCREENSHOT: chatgpt_custom_mcp_connection — form with name, description, Server URL filled with the Canvas MCP URL.
4. Configure authentication: choose **OAuth**. Open the advanced OAuth settings to pre-register a client. Labels per Salesforce/Jama third-party guides (search snippets, not fetched, not vendor): "Advanced settings" -> registration method **User-defined OAuth client** -> fields Client ID, Client Secret (secret optional in ChatGPT UI), token auth method (Jama says select `client_secret_basic`). ChatGPT displays a callback/redirect URL in these advanced settings; register it with the provider before creating. Jama warns: do not click Create, delete, or start a second draft, or the callback URL changes.
   Vendor doc statement: "OAuth with static credentials: ChatGPT uses them if you provide them." Exact vendor field labels: Not documented in vendor pages fetched.
   SCREENSHOT: chatgpt_oauth_advanced_settings — OAuth selected, advanced settings expanded showing registration method, Client ID, Client Secret, token auth method, and the displayed callback URL.
5. Review risk warning, select **I understand and want to continue**, then **Create as a plugin**.
   SCREENSHOT: chatgpt_risk_warning_create — risk warning checkbox/button and Create as a plugin button.
6. Install the plugin from your personal plugins before use; complete Canvas sign-in via the OAuth prompt.
7. Verify: in prompt box type `@` and pick the plugin; ask to list Canvas courses. Open the app's details page in app settings to toggle tools or **Refresh**. Write actions require confirmation unless tool has `readOnlyHint`.
   SCREENSHOT: chatgpt_plugin_tools_list — plugin details page listing discovered Canvas tools with toggles and Refresh.
   After metadata changes: open connection at chatgpt.com/plugins, **Refresh**, start new conversation.

### B2. Workspace (Business / Enterprise / Edu)

- Business (search snippet of help article): only admins/owners can create and publish plugins for custom MCP servers; members can connect from Plugins subject to workspace permissions.
- Enterprise/Edu (search snippet): RBAC permission **Create plugins with MCPs** (off by default for Enterprise) can be given to selected members; only admins/owners publish for the workspace. Sharing vs publishing are separate permissions.
- Steps (from search snippet, unverified labels): create the plugin as in B1 inside the workspace, then **Workspace settings** -> **Apps** -> **Drafts** -> **Publish**; review safety warnings; use **Configure Actions** (new actions disabled by default, diffs shown on change) and **Configure Access** (select groups). Published apps appear in workspace approved connectors and members' Apps settings labelled "custom".
  Current vendor admin page (learn.chatgpt.com/docs/enterprise/apps-and-connectors) uses different labels: **Workspace apps** (https://chatgpt.com/admin/ca), **App permissions**, **Action control** (read-only or approved custom set; choose handling of newly added actions), role settings in **Permissions & roles** (https://chatgpt.com/admin/settings). It does not describe publishing a custom MCP server.
  SCREENSHOT: chatgpt_admin_drafts_publish — Workspace settings > Apps > Drafts with Publish for the Canvas MCP draft.
  SCREENSHOT: chatgpt_admin_configure_actions_access — Configure Actions and Configure Access dialogs.
  SCREENSHOT: chatgpt_admin_permissions_create_mcp — Permissions & roles showing the Create plugins with MCPs toggle.
- Members: install/enable the published plugin, pick it with `@`, complete their own Canvas OAuth. Importing/publishing does not connect member accounts. Member install flow in ChatGPT UI: Not documented on fetched pages. Community report (about 180 days old) that admin-published connectors were invisible to members; OpenAI reply says fixed May 2026 (search snippet).
- Plan prerequisites: Not documented on fetched developer pages.
- Plugin/MCP in Codex: plugins with `mcp.json` imported to a workspace are marked **Desktop only** (work only in ChatGPT desktop app, even remote HTTPS).
- Lockdown and workspace domain restrictions can block custom MCP; workspace domain restrictions require `openid` and `email` scopes plus UserInfo returning `email` and `email_verified: true` (auth page).

### B3. OAuth and redirect behavior (auth page, checked 2026-10-17)

- Redirect URI: `https://chatgpt.com/connector_platform_oauth_redirect` if the authorization server supports RFC 9207 issuer identification; otherwise `https://chatgpt.com/connector/oauth/{callback_id}`. Older servers keep the stable URI. Copy the exact value from the MCP server's management page/advanced settings.
- Registration: CIMD preferred (`client_id_metadata_document_supported: true`; client_id `https://chatgpt.com/oauth/client.json` or `/oauth/{callback_id}/client.json`; auth methods `none`, `private_key_jwt`); DCR if `registration_endpoint`; predefined client listed as an option with no setup details on that page.
- PKCE S256 required (`code_challenge_methods_supported`). `resource` parameter sent on authorize and token requests. `iss` must match metadata issuer in every authorization response (including errors) when RFC 9207 advertised, else rejected.
- Token endpoint auth for non-CIMD: commonly `none`, `client_secret_post`, `client_secret_basic`.
- Scopes: advertise `scopes_supported`; OIDC scopes requested by default if advertised.
- Can a user enter Client ID/secret manually? Yes per "static credentials" statement and third-party guides; vendor pages fetched give no labels or field details. A community post reports a bug where Connect rejects imported clientId ("OAuth client ID is required when using pre-defined OAuth client credentials"), single report.

### B4. Relevance to Canvas MCP blocker

Known Canvas bug stays. Items that likely matter once fixed (inference, not verified): Maple omits `authorization_response_iss_parameter_supported`, so ChatGPT would use `https://chatgpt.com/connector/oauth/{callback_id}`, which differs per server and must be read from the advanced settings before creating the Canvas key. Static client must be allowed by Canvas, PKCE S256 and `resource` handling must work.

### B5. Conflicts with repo (chatgpt.ts)

1. Entry point: repo says "Settings -> Apps -> Create" (personal) and "Workspace settings -> Apps -> Create as an admin or owner". Vendor developer docs say **ChatGPT Plugins** (chatgpt.com/plugins) -> plus -> **Add custom MCP server** -> **Create as a plugin**. Help-center snippet still uses Workspace settings -> Apps -> Drafts -> Publish for publishing. Needs live UI check.
2. Repo step "Choose Scan Tools, complete Canvas sign-in, then choose Create": **Scan Tools** not found in any vendor doc fetched. Vendor flow: risk warning ("I understand and want to continue") then Create as a plugin; tools are reviewed after creation, with **Refresh** to re-pull.
3. Repo says "Choose OAuth authentication and enter the Canvas connection fields" without naming advanced settings, registration method (User-defined OAuth client), or the callback URL shown there. Missing: copy ChatGPT's callback URL into the Canvas key BEFORE creating, and do not recreate the draft (callback changes).
4. Repo `facts: unknownFacts()` and "Exact redirect URI and key compatibility remain unknown". Vendor doc now gives the two redirect forms (B3); manual client ID/secret supported per vendor "static credentials" line.
5. Repo "Install" step missing: vendor says plugin must be installed before use in a conversation (personal); enterprise members "select the Canvas MCP app" matches `@` mention but install step not documented for members.
6. Repo sources URL help.openai.com/.../12584461-connecting-custom-mcp-servers-in-chatgpt returned 403 to the fetcher; title has since changed to "Creating custom MCP apps in ChatGPT" (search result). Re-verify in browser.
7. ChatGPT Desktop: Plugins docs say workspace plugins work in Chat and Work on web/desktop/mobile; custom MCP creation per developer docs is web only. Repo does not mention desktop.
8. Codex desktop app and ChatGPT desktop are the same app (settings label "MCP servers"); repo codex guide only mentions CLI/IDE.

### B6. Not documented (vendor pages fetched)

Plan tiers for custom MCP creation; developer mode toggle in current UI; exact label strings for user-defined OAuth client fields; whether members need a specific permission to install published plugins; whether Lockdown blocks custom MCP by default.
