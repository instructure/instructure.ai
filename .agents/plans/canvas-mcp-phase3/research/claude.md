# Claude clients: connecting Canvas MCP (pre-registered OAuth client)

Date checked: 2026-10-17 (all sources fetched that day). Scope: remote MCP server, OAuth with a static Client ID, optional Client Secret, no DCR.

Sources

- S1 https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- S2 https://claude.com/docs/connectors/custom/add-unlisted
- S3 https://claude.com/docs/connectors/building/authentication
- S4 https://code.claude.com/docs/en/mcp
- S5 https://code.claude.com/docs/en/managed-mcp
- S6 https://code.claude.com/docs/en/server-managed-settings

Data note: Canvas developer-key Client IDs/secrets are sensitive credentials. Relevant rules: org security review for shared credentials; no secrets in shared JSON, chat, or setup links.

---

## A. Claude.ai / Claude Desktop

Applies to claude.ai web, Claude Desktop, mobile and Cowork. They share one remote-connector auth backend, and connectors are brokered from Anthropic's cloud, not the device (S1, S3). Claude Desktop has no separate menu path for remote connectors (S1: "doesn't list separate menu paths for Claude Desktop"). The separate Desktop "Settings > Extensions" (MCPB) path is for local servers and is not relevant to Canvas MCP.

### A0. Facts common to both modes

- Plans: custom remote connectors are available on Free, Pro, Max, Team, Enterprise. Free is limited to one custom connector (S1, S2).
- Redirect/callback URI to register on the Canvas developer key: `https://claude.ai/api/mcp/auth_callback` (exact, fixed). Source: S3 "Callback URLs" and "Credentials entered at connection time". Applies to claude.ai web, Desktop, mobile, Cowork.
  - Third-party guides (Nooks, Pylon) say to also register `https://claude.com/api/mcp/auth_callback`. Vendor docs do NOT list it. Not documented by Anthropic; treat as optional hedge and flag as unverified.
- Client ID/secret entry: yes, manual. Dialog option "Use your own OAuth client"; the secret is optional ("Leave the secret blank unless your authorization server requires one"). With a blank secret Claude acts as a public client (S2, S3).
- Dialog layout varies by organization. Some orgs see one screen with name, URL and "Advanced settings" containing OAuth client ID and secret; others get the two-step flow with Authentication and OAuth client choices (S2).
- PKCE S256 is always sent. Server needs 401 + `resource_metadata` discovery (S3). Anthropic egress is `160.79.104.0/21`; the MCP and authorization server must be reachable from it (S3).
- Authentication settings cannot be edited after adding. To change client ID/secret you must remove and re-add the connector, and members must reconnect (S2). Name/URL can be edited via the three-dot menu (S2). S1 says to edit, remove and re-add.
- Token endpoint/discovery timeouts: 10 s (30 s for refresh) (S3).
- Per-chat toggle: "+" in chat > "Connectors" > toggle per connector (S1, S2).

### A1. Personal (Free / Pro / Max)

Who: the individual user. Prerequisite: Canvas developer key created with redirect URI above.

Steps (S1 + S2, https://support.claude.com/en/articles/11175166 and https://claude.com/docs/connectors/custom/add-unlisted):

1. Go to Customize > Connectors (https://claude.ai/customize/connectors).
2. Click "+ Add", then "Add custom connector".
3. Enter a name (shown in the connectors list).
4. Enter the remote MCP server URL (HTTPS), click "Continue".
5. Review the detected authentication settings; click "Continue".
6. Authentication: choose "Sign in now" or "Sign in when needed" (not "No sign in").
7. OAuth client: choose "Use your own OAuth client". Enter Client ID. Leave the secret blank for a public key; enter it for a confidential key.
   (Single-screen variant: Advanced settings > OAuth client ID / OAuth client secret.)
8. Leave Request headers empty (beta, limited orgs; not needed for OAuth).
9. Click "Add".
10. On the connector, click "Connect" and sign in to Canvas.
    Verify: new chat > "+" > Connectors shows Canvas MCP toggled on; ask Claude to list courses. Docs do not give a dedicated verification procedure beyond this (Not documented).

SCREENSHOT: claude_personal_customize_connectors — Customize > Connectors page with the "+ Add" menu open showing "Add custom connector".
SCREENSHOT: claude_personal_add_custom_connector_url — Add custom connector dialog with Name and MCP server URL filled in.
SCREENSHOT: claude_personal_oauth_client_choice — Authentication = "Sign in when needed" and OAuth client = "Use your own OAuth client" with Client ID and Client Secret fields.
SCREENSHOT: claude_personal_advanced_settings — single-screen variant of the dialog with Advanced settings expanded showing OAuth client ID/secret.
SCREENSHOT: claude_personal_connect_button — the added connector row with the "Connect" button.
SCREENSHOT: claude_chat_connectors_toggle — chat "+" menu > Connectors with Canvas MCP toggled on.

### A2. Enterprise / Team (org admin provisioning)

Who: Team: Owner or Primary Owner only. Enterprise: Owner, Primary Owner, or a member with a custom role that includes "Manage access to Libraries" (S1). S2 says "Owners" and "a custom role that includes managing the organization's libraries". Members cannot add org custom connectors.

Steps (S1/S2):

1. Admin: go to Organization settings > Connectors (https://claude.ai/admin-settings/connectors).
2. Click "Add", hover "Custom", select "Web" (S2: "Add, then Custom. If Claude asks for the connector type, choose Web").
3. Enter a name.
4. Enter the remote MCP server URL, click "Continue".
5. Review detected authentication settings; "Continue".
6. Authentication: "Sign in now" or "Sign in when needed".
7. OAuth client: "Use your own OAuth client". Enter Client ID; secret optional (blank for public key).
8. Click "Add". The connector then appears for members under Customize > Connectors with the "Custom" label.
   Member steps:
9. Customize > Connectors.
10. Find the connector with the "Custom" label (if the domain matches a Directory listing, the service name/branding shows instead of "Custom").
11. Click "Connect" and authenticate with their own Canvas account.
    Each member authorizes separately; an org-added connector is not auto-connected (S1: "Individual users connect and enable the connector themselves"). Fixed request-header credentials, if used, are shared by all members (not applicable to OAuth).
    Verify: member opens a new chat, "+" > Connectors, toggle Canvas MCP on, asks for their courses. Admin verification path: Not documented beyond the member connect flow.
    Admin controls not documented in these pages: org-wide allowlist of connectors, per-tool blocking by admins (S2 only documents users blocking individual tools under Customize > Connectors > connector > tool permission "Blocked"). Claude Code page S4 mentions org "connector tool controls" with `blocked` entries but that was not fetched in detail. Treat as Not documented here.
    Limitations: No per-group provisioning documented. Authentication settings immutable after creation (remove/re-add; members reconnect). The server must be reachable from `160.79.104.0/21`.

SCREENSHOT: claude_admin_org_settings_connectors — Organization settings > Connectors list page.
SCREENSHOT: claude_admin_add_custom_web_menu — Add > Custom > Web submenu.
SCREENSHOT: claude_admin_oauth_client_dialog — admin dialog with "Use your own OAuth client" selected and Client ID/secret fields.
SCREENSHOT: claude_member_custom_connector_connect — member's Customize > Connectors showing the org "Custom" connector and "Connect" button.
SCREENSHOT: claude_member_canvas_signin_consent — Canvas sign-in/authorize screen after Connect.

### A3. Conflicts with repo file claude-ai.ts

- Personal prerequisite says "Claude Pro or Max". Vendor: also Free (one custom connector) and Team/Enterprise members can't add their own org connectors. Suggest wording: "Free (1 connector), Pro or Max".
- Enterprise prerequisite says "an organization Owner". Vendor: Team = Owner or Primary Owner; Enterprise adds custom role with "Manage access to Libraries".
- Personal steps: repo "In Customize → Connectors, choose + Add → Add custom connector" matches S1. Repo step "Review authentication, continue, and choose Sign in when needed" is loosely right; vendor labels are "Sign in now" / "Sign in when needed" / "No sign in". Repo step "Choose Add, then connect" is correct; step order in repo has client choice before Add, which matches.
- Enterprise step "In Organization settings → Connectors, choose Add → Custom → Web" matches S1/S2 (hover Custom, select Web).
- Repo says "Choose Add to make the connector available to organization members": vendor says members still must click "Connect" individually (repo clientSetup already covers this).
- Callback URI: repo `https://claude.ai/api/mcp/auth_callback` matches S3. Third-party sources suggest also registering the claude.com variant; not in vendor docs.
- Repo has no note that auth settings can't be edited after add, nor the single-screen "Advanced settings" dialog variant. Both are documented (S2) and worth adding.
- Evidence label in repo cites the support article; the more detailed current source is S2 (claude.com/docs/connectors/custom/add-unlisted).

---

## B. Claude Code (CLI, also VS Code / JetBrains / desktop Code tab)

### B0. Facts common to both modes

- Callback behavior (S4, S3): Claude Code runs its own OAuth flow on the user's machine with a loopback redirect `http://localhost:PORT/callback`. Use `callbackPort` (add-json `oauth.callbackPort`) or `--callback-port` to fix PORT so it matches the pre-registered URI; without it a random port is used. S3 says Claude Code's own Client ID Metadata Document declares `http://localhost/callback` and `http://127.0.0.1/callback` (port ignored) and that servers should match port-agnostically. Pre-registered exact URI to put on the Canvas key: `http://localhost:8081/callback` if port 8081 is used (repo's choice is valid).
- Version note: Claude Code v2.1.229 sent `http://127.0.0.1:PORT/callback`; v2.1.231 restored `localhost`. Avoid v2.1.229 or register both.
- Client ID/secret entry: yes. CLI flags `--client-id`, `--client-secret` (masked prompt), `--callback-port`; or `add-json` with `"oauth":{"clientId":...,"callbackPort":...,"scopes":"space separated"}` plus separate `--client-secret` flag (S4).
- Secret handling: stored in macOS keychain or a credentials file, not in config. It can only be set when adding the server; later `/mcp` and `claude mcp login` use the stored secret and do not read `MCP_CLIENT_SECRET`. To change: `claude mcp remove <name>` then re-add with the same `--scope` (S4). `MCP_CLIENT_SECRET=... claude mcp add ... --client-secret` skips the prompt for CI (S4).
- Public client: pass only `--client-id` / omit `--client-secret` (S4).
- Scopes: `oauth.scopes` is a single space-separated string; overrides discovery. Claude Code appends `offline_access` if the auth server advertises it (S4).
- Scope flag: `--scope local|project|user`; local is default (S4). Local/user stored in `~/.claude.json`; project in `.mcp.json` (shared via VCS). Project-scope servers need interactive approval (`claude mcp reset-project-choices` resets) (S4).
- Authenticate: run `/mcp` and follow browser login, or `claude mcp login <name>` / `claude mcp logout <name>` from the shell. "Clear authentication" in `/mcp` revokes. Headless: `claude mcp login` prints URL and prompts for pasted redirect URL; needs `ssh -t`; `--no-browser` forces it (S4).
- Verify: `claude mcp get <name>` confirms OAuth credentials configured (S4). `/mcp` shows connection state. Claude Code marks a server as needing auth on 401/403.
- Min version for add-json `oauth` fields and `claude mcp login`: Not documented in S4.
- claude.ai connectors in Claude Code: if logged in with a claude.ai subscription, connectors added at claude.ai/customize/connectors are available in Claude Code automatically (terminal, VS Code, JetBrains, Agent SDK). Not loaded when ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN / apiKeyHelper or a third-party provider (Bedrock, Vertex) is active. Disable with `disableClaudeAiConnectors: true` or `ENABLE_CLAUDEAI_MCP_SERVERS=false`. S4 says "On Team and Enterprise plans, only admins can add servers." Note: for these connectors the redirect is the claude.ai hosted callback (section A), not the localhost loopback. Implication: an admin who adds Canvas MCP in Organization settings > Connectors (section A2) also provisions it to Claude Code users who log in with claude.ai, with no managed settings. The repo does not mention this path.
- Network: Server must be reachable by the user's machine (Claude Code connects directly); claude.ai connectors are connected from Anthropic's cloud.

### B1. Personal

Who: any Claude Code user. Prerequisites: Claude Code installed; Canvas developer key with redirect URI `http://localhost:8081/callback`; port 8081 free.

Steps (S4 https://code.claude.com/docs/en/mcp#use-pre-configured-oauth-credentials):

1. Register the Canvas developer key with redirect URI `http://localhost:8081/callback`.
2. Add the server (public key):
   `claude mcp add --transport http --client-id <ID> --callback-port 8081 canvas-mcp <MCP_URL>`
   or `claude mcp add-json canvas-mcp '{"type":"http","url":"<MCP_URL>","oauth":{"clientId":"<ID>","callbackPort":8081,"scopes":"<SCOPES>"}}' --scope local`.
3. Private (confidential) key: add `--client-secret` (masked prompt). Documented forms: `claude mcp add --transport http --client-id <ID> --client-secret --callback-port 8081 canvas-mcp <URL>` or add-json plus `--client-secret`.
4. `claude mcp get canvas-mcp` to confirm credentials.
5. Start `claude`, run `/mcp`, select canvas-mcp, authenticate in browser (or `claude mcp login canvas-mcp`).
6. Verify in `/mcp` and by asking for Canvas courses.
   SCREENSHOT: claude_code_mcp_add_command — terminal after `claude mcp add-json ... canvas-mcp` with success output.
   SCREENSHOT: claude_code_mcp_needs_auth — `/mcp` panel with canvas-mcp showing "Needs authentication".
   SCREENSHOT: claude_code_canvas_browser_authorize — Canvas authorize screen with localhost callback.
   SCREENSHOT: claude_code_mcp_connected — `/mcp` showing canvas-mcp connected with tools.

### B2. Enterprise (Team/Enterprise admin; managed settings)

Source: S5 https://code.claude.com/docs/en/managed-mcp, S6 https://code.claude.com/docs/en/server-managed-settings.

Delivery mechanisms (S6, S5):

- Server-managed settings: Organization settings > Claude Code > Managed settings (https://claude.ai/admin-settings/claude-code). Requires Claude Team or Enterprise; Owner or Primary Owner role (S6). Network to `api.anthropic.com`. Save; clients get it on next startup or hourly. Applies uniformly to all users (no per-group). Skipped when a third-party provider variable or non-default ANTHROPIC_BASE_URL is set, for Cowork sessions in Desktop, and for non-claude.ai credentials like Console API keys (S6). Verify with `claude doctor` ("Managed settings (remote)" line; v2.1.248+) or `/status`.
- Endpoint-managed: MDM profile (macOS), registry (Windows), or `managed-settings.json`; `managed-mcp.json` at `/Library/Application Support/ClaudeCode/managed-mcp.json` (macOS), `/etc/claude-code/managed-mcp.json` (Linux/WSL), `C:\Program Files\ClaudeCode\managed-mcp.json` (Windows). Cannot be delivered via server-managed settings (S5/S6).

Patterns (S5):

1. Provided servers via `managedMcpServers` (v2.1.259+; earlier clients ignore): remote servers given to every user in addition to their own. Entry shape = `.mcp.json` HTTP/SSE server, including `oauth`. Checks: `type` http/sse; `url` https only; no `command/args/env/headersHelper`; no `${VAR}`; server name only letters/numbers/hyphen/underscore. Failed entries are dropped and noted in `/status`. Users can't edit/remove them (`claude mcp remove` says provided by organization) but can disable in `/mcp` under "Managed MCPs". `/mcp` shows host only. Takes precedence over same-name servers and same-URL claude.ai connectors. Not read in Desktop Code tab on third-party deployment or Cowork. Cached `managedMcpServers` waits up to 30 s for server confirmation at start.
   Does `oauth.clientId` + `callbackPort` work inside `managedMcpServers`? S5 says the entry may include the `oauth` member "described in Authenticate with remote MCP servers". It does not state explicitly that `clientId` is honored or give an example with a clientId; Not documented explicitly. The repo's claim is plausible but unverified. Client secret cannot be provisioned this way (secret is only set at add time per S4; no managed-config field documented).
2. Exclusive `managed-mcp.json`: format same as `.mcp.json` with `mcpServers`. Blocks all other user/project/plugin/--mcp-config servers; also suppresses claude.ai connectors unless `allowAllClaudeAiMcps: true` in an admin-controlled source. Don't store secrets in file (world-readable); use OAuth/`${VAR}`. `${VAR}`-using entries are still checked against allowlist. `allowedMcpServers` doesn't apply to its servers (v2.1.259+).
3. Approved catalog: `allowedMcpServers` + `allowManagedMcpServersOnly: true` (managed source). Users still add the server themselves (`claude mcp add`). Entry: `{ "serverUrl": "https://..." }` (wildcards allowed; no port means 443 default for fully-written host). Reading lock and allowlist across multiple managed sources requires v2.1.273+. `serverName` allow entries aren't a security control. Denylist (`deniedMcpServers`) always applies and merges from all scopes.
4. User-facing messages when blocked: `Cannot add MCP server "<name>": not allowed by enterprise policy`; with managed-mcp.json: `Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers`.

Admin steps for the recommended public-key path:

1. Owner opens Organization settings > Claude Code > Managed settings.
2. Add JSON:

```
{ "managedMcpServers": { "canvas-mcp": { "type":"http", "url":"<MCP_URL>", "oauth": { "clientId":"<ID>", "callbackPort":8081, "scopes":"<SCOPES>" } } } }
```

(Keep any existing policy keys; the editor may flag schema warnings with "Update with errors"/"Add with errors" but still saves, S6.) 3. Click save ("Update"/"Add"). Users on Claude Code v2.1.259+ get it at next start or within an hour. 4. Pilot: `claude doctor` and `/mcp` on a device; user sees canvas-mcp under Managed MCPs; selects it and authenticates with their own Canvas account.
Alternative for private key: allowlist + users run `claude mcp add ... --client-secret` themselves (secret distributed out of band).
Alternative that needs no managed settings: add the connector once as org admin in claude.ai (section A2); Claude Code users logged in with claude.ai get it automatically (subject to `managed-mcp.json` suppression and `disableClaudeAiConnectors`).

SCREENSHOT: claude_admin_managed_settings_page — Organization settings > Claude Code > Managed settings JSON editor with the managedMcpServers block.
SCREENSHOT: claude_code_mcp_managed_section — `/mcp` showing canvas-mcp under "Managed MCPs".
SCREENSHOT: claude_code_doctor_managed_settings — `claude doctor` output line "Managed settings (remote)".
SCREENSHOT: claude_code_blocked_by_policy — terminal showing the "not allowed by enterprise policy" message.

### B3. Conflicts and gaps vs repo file claude-code.ts

- Callback/personal commands: repo's add-json plus `--client-secret` and `--scope local` match S4. Repo `callbackPort: 8081` matches the documented loopback pattern. OK.
- Repo text "managed-mcp.json ... blocks other user, project, plugin, and command-line servers" matches S5. It omits that it also suppresses claude.ai connectors by default (`allowAllClaudeAiMcps`), and that `--mcp-config` makes startup fail.
- Repo says `managedMcpServers` requires v2.1.259 (matches S5) and v2.1.273 for combining sources (matches S5, which ties 273 to reading the lock/allowlist across sources).
- Repo claims private-key client secret cannot go through managed OAuth config. S4/S5 do not document a managed secret field; consistent but the doc never states it outright (Not documented).
- Repo says managedMcpServers can be delivered through "server-managed settings, MDM or registry policy, or managed-settings.json". Matches S5 (also Claude apps gateway). Repo omits the Owner/Primary Owner role and admin console path "Organization settings > Claude Code > Managed settings", and the caveat that server-managed settings are skipped for Console API keys, third-party providers, and Cowork.
- Repo omits the claude.ai-connector path for Claude Code (B0) and that those connectors use the claude.ai callback, not localhost.
- Repo omits v2.1.229 redirect bug (use v2.1.231+).
- Repo's "/mcp ... Authenticate or Needs Auth" wording: docs only say run `/mcp` and follow browser steps; no vendor-defined button labels in the text read. Exact labels Not documented in fetched text.
- Repo's claim that "Existing denylist policies can still block this server" is correct (denylist applies to provided servers; S5).
- Not verified: whether `managedMcpServers` entries honor `oauth.clientId` in practice (no example in S5). Recommend a pilot test before shipping this as documented.

---

## Not documented / open

- Whether `https://claude.com/api/mcp/auth_callback` must also be registered (vendor says claude.ai only; third parties say both).
- Exact admin verification UI for an org connector.
- Minimum Claude Code version for `oauth.clientId` in add-json / `--client-id` flags.
- Explicit statement that managedMcpServers `oauth.clientId` is honored.
- Org-level admin tool controls for connectors (S4 mentions "organization controls on connector tools" in the unread tail of the page).
