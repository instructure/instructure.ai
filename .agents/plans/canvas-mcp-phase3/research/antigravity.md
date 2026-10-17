# Antigravity (IDE and CLI): connecting Canvas MCP with a pre-registered OAuth client

Date checked: 2026-10-17 (all sources below). Sources are Google docs pages read via WebFetch; two Google Codelabs are used for the enterprise allow-list and per-surface auth steps (codelabs are Google-authored but not product reference docs).

Sources
- MCP: https://antigravity.google/docs/mcp
- Enterprise: https://www.antigravity.google/docs/enterprise
- Permissions: https://antigravity.google/docs/permissions
- Get started (CLI tab): https://antigravity.google/docs/getting-started?tab=cli
- Codelab (per-surface auth): https://codelabs.developers.google.com/google-workspace-mcp-antigravity?hl=en
- Codelab (enterprise allow-list): https://codelabs.developers.google.com/google-workspace-mcp-antigravity-ge

Data note: Canvas client ID/secret are credentials. The secret goes only in the user's local config file, never in source control or screenshots. Redact it in every screenshot. Enterprise rollout via MDM or templates: consider Security review (SOC 2 / internal secrets policy). No student data is involved in setup.

## Shared facts (apply to IDE, CLI, and the Antigravity app/2.0)

- Config file (shared across surfaces): `~/.gemini/config/mcp_config.json` (global) or `.agents/mcp_config.json` (workspace). Source: MCP doc; codelab confirms the global file is shared by 2.0, IDE, and CLI.
- Remote entry uses `serverUrl` under `mcpServers`. `url` and `httpUrl` are NOT supported. Transport: Streamable HTTP or SSE.
- Optional fields: `headers`, `authProviderType` ("google_credentials"), `oauth` { `clientId`, `clientSecret` }, `disabled`, `disabledTools`.
- Dynamic client registration: add only `serverUrl`. Manual credentials: add `oauth.clientId` and `oauth.clientSecret`. Docs show both keys together; whether `clientSecret` may be omitted (public client / PKCE-only) is Not documented.
- Redirect URI to register: `https://antigravity.google/oauth-callback` (exact match required).
- Callback behavior: browser lands on the Antigravity callback page, which shows a code with a "Copy to Clipboard" button. User pastes the code into the app settings field (then Submit) or the terminal (then Enter). No localhost listener is documented.
- Tokens: `~/.gemini/antigravity/mcp_oauth_tokens.json`. Antigravity refreshes expired tokens and removes invalid ones. Tokens are NOT shared across surfaces, so authenticate each surface separately (codelab).
- Tool permissions: unconfigured MCP tools run in Ask mode. Rules: `mcp(server/tool)`, `mcp(server/*)`, `mcp(*)`. Precedence Deny > Ask > Allow. (Permissions doc)
- Endpoint discovery: the docs do not state how OAuth endpoints are discovered for the manual-credential case. The repo's claim "discovers OAuth endpoints from the MCP server metadata" is Not documented.

## A. Antigravity IDE

Note: the docs treat IDE, the Antigravity App (2.0), and CLI as separate products. IDE-specific UI paths below come from the MCP doc and codelab.

### A1. Personal (Google account, Free/Pro/Ultra)
Prerequisites: IDE installed and signed in with a Google account; Canvas MCP URL; Canvas OAuth client ID (and secret if the key is private); redirect URI `https://antigravity.google/oauth-callback` registered on the Canvas key.
Steps (checked 2026-10-17; MCP doc + codelab):
1. Click `…` at the top of the agent side panel and select `MCP Servers`.
   SCREENSHOT: ide_agent_panel_menu — agent side panel header with the `…` menu open and `MCP Servers` highlighted.
2. Click `Manage MCP Servers`, then `View raw config` (opens `mcp_config.json`).
   SCREENSHOT: ide_manage_mcp_raw_config — MCP Servers view with `Manage MCP Servers` and `View raw config`.
3. Merge into `mcpServers`: `"canvas-mcp": { "serverUrl": "<Canvas MCP URL>", "oauth": { "clientId": "<id>", "clientSecret": "<secret>" } }`. Save.
   SCREENSHOT: ide_raw_config_canvas_entry — raw config with the canvas-mcp entry, secret redacted.
4. Open `Antigravity User Settings` from the `Editor-Specific settings` dropdown at the top of the window. Go to `Customizations` > `Installed MCP Servers` > `Refresh`.
   SCREENSHOT: ide_user_settings_customizations — Customizations tab with Installed MCP Servers and Refresh.
5. Click `Authenticate` next to canvas-mcp. Sign in to Canvas in the browser, click `Copy to Clipboard`, paste the code into the settings field, click `Submit`.
   SCREENSHOT: ide_authenticate_paste_code — Authenticate button and paste-code field with Submit.
Verify: button changes to `Sign out`; the server lists tools. Canvas course listing via a tool call (Ask-mode prompt expected).
Limitations: user must authenticate per surface; paste-code flow, not automatic.
The MCP doc also describes an MCP Store install path (not applicable to a custom server).

### A2. Enterprise (Gemini Enterprise)
Prerequisites: a Google Cloud project with an invoiced Cloud Billing account and `aiplatform.googleapis.com` enabled; users hold a Gemini Enterprise Standard or Plus license (Enterprise doc). Enable the API before buying licenses; wait about five minutes.
Admin steps (Google Cloud console; codelab, checked 2026-10-17; no official reference page for this found):
1. Gemini Enterprise > Settings > `AI developer tools`: set the toggle to `Enabled`.
   SCREENSHOT: ge_ai_developer_tools_toggle — AI developer tools page with toggle Enabled.
2. Click `Edit` next to `Security`, turn on `MCP Servers`, and fill `Allowed server configuration` with a `remote_servers` array of `{ "id", "url" }` entries (codelab examples: drive, docs, sheets). Add the Canvas MCP URL as an entry. Click `Save`.
   SCREENSHOT: ge_security_mcp_allowed_config — Security edit panel with MCP Servers on and the Allowed server configuration field containing the Canvas entry.
   Exact JSON schema beyond the `id`/`url` fields in the codelab: Not documented. Whether a path or wildcard match is allowed: Not documented.
Sign-in steps (Enterprise doc):
3. In the IDE choose `Sign in` > `Business account` > `Continue with Google Cloud`, then choose the project in the `License Selector` (`Other` to self-assign by project ID and location global/us/eu). Alternatives: `Advanced WIF Configuration` with a `WIF Configuration String`; or ADC (`gcloud auth application-default login --project {GCP_PROJECT}`, then `"enableAdc": true` under `userSettings` in `~/.gemini/config/config.json` for App and IDE).
   SCREENSHOT: ide_signin_business_license_selector — Business account option and License Selector.
4. Then follow A1 steps 1 to 5 for the Canvas entry. Canvas OAuth is separate from Google sign-in.
Verify: unapproved servers show `Unauthorized / Blocked by Admin Policy` after `Refresh`. An approved server authenticates normally.
   SCREENSHOT: ide_blocked_by_admin_policy — Customizations list showing the blocked state (for troubleshooting).
Limitations: customer telemetry and model interactions are logged to the licensed Google Cloud project. Managed config files for MCP (MDM-distributed settings) and any other admin policy surface: Not documented.
Other admin controls (Enterprise doc): request/response logging, VPC-SC (add `businessaicode.googleapis.com` and `aiplatform.googleapis.com`), Settings > General > Permission Settings. Network hosts on TCP 443: businessaicode, aiplatform, discoveryengine, cloudcode-pa googleapis hosts. Canvas MCP host must be reachable too (not listed; implied).

## B. Antigravity CLI (`agy`)

Docs do not state that it is the "successor to Gemini CLI"; the Get started page only links a Gemini CLI migration guide. Do not reuse IDE UI steps for it.

### B1. Personal
Prerequisites: install via the curl script (macOS/Linux; binary at `~/.local/bin/agy`) or PowerShell/CMD (Windows); `agy --version`. Sign in with `auth.type` `oauth-personal` (Get started page).
Steps (checked 2026-10-17; MCP doc + codelab):
1. Edit `~/.gemini/config/mcp_config.json` or `.agents/mcp_config.json`; add the same `canvas-mcp` entry as A1 step 3.
   SCREENSHOT: cli_mcp_config_canvas_entry — terminal editor showing the entry, secret redacted.
2. Run `agy`, type `/mcp`, press Enter to open the MCP Manager Overlay.
   SCREENSHOT: cli_mcp_manager_overlay — overlay listing canvas-mcp with status Auth Needed.
3. Arrow to canvas-mcp, press Enter, select `Authenticate` with left/right arrows, press Enter.
   SCREENSHOT: cli_mcp_authenticate_option — server detail with Authenticate selected.
4. Open the URL printed in the terminal, sign in to Canvas, click `Copy to Clipboard`, paste the code into the terminal, press Enter.
   SCREENSHOT: cli_auth_url_and_code_prompt — terminal showing URL and code prompt.
Verify: status changes from `Auth Needed` to `Authed`.
Limitations: the CLI permissions live in `~/.gemini/antigravity-cli/settings.json` under `permissions` (`allow`/`deny`/`ask`). Whether a Canvas public key (no secret) works: Not documented.

### B2. Enterprise
Prerequisites and admin steps: same as A2 (license, AI developer tools, Allowed server configuration).
CLI sign-in: `Sign in` > `Business account` > `Continue with Google Cloud` (Enterprise doc), or `auth.type` `oauth-business` with `gcp.project` and `gcp.location`; ADC headless: `gcloud auth application-default login --project {GCP_PROJECT}` and `AGY_ADC_AUTH=true`.
   SCREENSHOT: cli_signin_business_account — sign-in prompt with Business account.
Then B1 steps 1 to 4. Blocked servers show Unauthorized / Blocked by Admin Policy (codelab shows this in the settings UI; the CLI display is Not documented).
CLI controls (Enterprise doc): `--sandbox=true`, `--mode plan`, `/permissions`, `/config`.
Managed config for CLI: Not documented.

## Conflicts and gaps vs repo files
1. antigravity-guides.ts: verify step ("Open Agent settings → Customizations... Authenticate") describes the Antigravity app (2.0) flow; the IDE path is `…` > `MCP Servers` / `Antigravity User Settings`. Product is labeled "Antigravity" with rulesync alias `antigravity-ide`, so app vs IDE is conflated. Needs separate IDE entry or explicit wording.
2. Enterprise guide only covers license assignment and sign-in. It omits the admin step that matters for Canvas: Gemini Enterprise > Settings > AI developer tools > Security > MCP Servers > Allowed server configuration. Without it Canvas shows Blocked by Admin Policy. (Source is a codelab; no reference doc found.)
3. antigravity-cli.ts verify steps omit the code paste: docs say copy code and paste into the terminal. Repo says only "Sign in ... approve access".
4. Repo CLI guide says to edit only `.agents/mcp_config.json`; docs also give `~/.gemini/config/mcp_config.json`.
5. `registration`: antigravity.ts says "both"; antigravity-cli.ts says "static". Docs support both DCR (serverUrl only) and manual credentials, so "both" fits both products; the CLI should match.
6. CLI `keyTypes.public` unverified is correct; docs never show `oauth` without `clientSecret`. The IDE entry's `documented` private-key claim is supported; public-key variant (omitting `clientSecret`) is not documented, though antigravity-guides.ts emits it.
7. Repo comment "Antigravity discovers OAuth endpoints from the MCP server metadata": Not documented.
8. Repo redirect URI matches the docs. Enterprise evidence URL `https://www.antigravity.google/docs/enterprise` matches the fetched page.
9. "Enterprise surface: Google Cloud console" holds for license and allow-list admin only; users sign in inside the app/CLI.
10. Tokens are per surface; repo guides do not tell users to authenticate again in each product.
