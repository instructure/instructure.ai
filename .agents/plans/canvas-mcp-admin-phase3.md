# Plan: canvas-mcp Admin Phase 3 (curated client guides)

Status: research complete (checked October 17, 2026); implementation in progress.
App: `apps/canvas-mcp`. Builds on `.agents/plans/canvas-mcp-admin-phase2.md` (section 10 lists what phase 2 shipped and the research it left open).

Location note: this plan lives in the repo's `.agents/plans/` next to phase 2. `~/.agents/plans/` does not exist.

## 1. Goal

Replace the pending or thin guides for the curated clients with source-backed, step-by-step instructions for personal and enterprise (admin) installs. Every UI step that needs a screenshot gets a placeholder image now, so admins can see where real screenshots go. Guides are split into small modules so the scaffold can import, reorder and reuse them.

Out of scope: Rulesync-only clients, the Generic client, Maple region routing, new facts probing.

## 2. Research (the source of the step text)

One file per client group. Each has ordered steps with real UI labels, roles, redirect URI behavior, `SCREENSHOT: <name> — <what it shows>` markers, source URLs, the date checked, a conflicts list against the current repo, and a "Not documented" list. **Write guides from these files; do not re-research.**

Treat the research as an evidence ledger, not as blanket approval to publish every claim: use vendor documentation or source code for documented behavior, and preserve qualifiers for search snippets, inaccessible pages, internal guidance, and maintainer tests. Keep items marked "Not documented" out of guide instructions. Recheck a cited source when its supplied claim conflicts with another source or the live product; record any change in the relevant research file before updating guide text.

| Client | Research file | Modes |
| --- | --- | --- |
| Claude.ai / Claude Desktop | [research/claude.md](canvas-mcp-phase3/research/claude.md) section A | personal, enterprise |
| Claude Code | [research/claude.md](canvas-mcp-phase3/research/claude.md) section B | personal, enterprise |
| Codex | [research/codex-chatgpt.md](canvas-mcp-phase3/research/codex-chatgpt.md) | personal, enterprise |
| ChatGPT | [research/codex-chatgpt.md](canvas-mcp-phase3/research/codex-chatgpt.md) | personal, enterprise |
| Gemini CLI | [research/gemini.md](canvas-mcp-phase3/research/gemini.md) | personal, enterprise |
| Gemini Enterprise | [research/gemini.md](canvas-mcp-phase3/research/gemini.md) | enterprise |
| Antigravity IDE | [research/antigravity.md](canvas-mcp-phase3/research/antigravity.md) | personal, enterprise |
| Antigravity CLI | [research/antigravity.md](canvas-mcp-phase3/research/antigravity.md) | personal, enterprise |
| Copilot Studio | [research/copilot-superhuman.md](canvas-mcp-phase3/research/copilot-superhuman.md) | enterprise |
| Superhuman Go | [research/copilot-superhuman.md](canvas-mcp-phase3/research/copilot-superhuman.md) | blocked on vendor answers |

83 screenshot-marker lines across the five files form the screenshot manifest (section 4). Grep them with `grep -h "SCREENSHOT:" research/*.md`.

### Facts confirmed by research (update `facts` in each client module)

- Claude.ai / Desktop: redirect `https://claude.ai/api/mcp/auth_callback`. Manual client ID and optional secret ("Use your own OAuth client"). Public and private keys both work.
- Claude Code: redirect `http://localhost:8081/callback` via fixed `callbackPort`. Enterprise uses `managedMcpServers` in Organization settings > Claude Code > Managed settings.
- Codex: static `--oauth-client-id` / `--oauth-client-secret`, `mcp_oauth_callback_port` and `mcp_oauth_callback_url`. The desktop and IDE UI has no client ID or secret fields, so use the CLI or `config.toml`.
- ChatGPT: static credentials are used when provided. Two possible redirect URIs: `https://chatgpt.com/connector_platform_oauth_redirect` (server supports RFC 9207) or `https://chatgpt.com/connector/oauth/{callback_id}`. The callback URL is shown in the OAuth advanced settings and must be registered before the plugin is created. Maple omits the RFC 9207 flag, so the `callback_id` form is likely. Existing blocker (Canvas auth bug) stays until retested.
- Gemini CLI: pinned `http://localhost:8081/oauth/callback` is right (default port is random).
- Gemini Enterprise: PKCE is optional and recommended, not off. Scopes are space-separated.
- Antigravity (IDE and CLI): redirect `https://antigravity.google/oauth-callback`, manual `oauth.clientId` / `clientSecret`, paste-the-code flow, tokens per surface.
- Copilot Studio: Manual OAuth lists Client ID, Client secret, Authorization URL, Token URL template, Refresh URL, Scopes. The callback URL appears after Create.

### Corrections to existing guides (from the research conflict lists)

| Client | Fix |
| --- | --- |
| Claude.ai | Free plans work (one custom connector); not only Pro/Max. Team admin role is Owner or Primary Owner; Enterprise also allows a custom role with "Manage access to Libraries". Members still click Connect. Auth settings can't be edited; remove and re-add. Add the single-screen "Advanced settings" variant. |
| Claude Code | Add the admin console path and role. Note server-managed settings are skipped for Console API keys, third-party providers and Cowork. `managed-mcp.json` suppresses claude.ai connectors unless `allowAllClaudeAiMcps` is set. v2.1.229 sent a 127.0.0.1 redirect (fixed in v2.1.231). Add the org-added claude.ai connector path (uses the claude.ai callback, not localhost). |
| Codex | Secret is stored in plaintext in `config.toml`. Add the desktop and IDE "MCP servers > Add server > Authenticate" path. No documented version requirement. |
| ChatGPT | Path is Plugins (chatgpt.com/plugins > plus > Add custom MCP server > Create as a plugin), not Settings > Apps > Create. Remove "Scan Tools" (in no vendor doc). Add the install step and callback URL step. Workspace publish steps (Workspace settings > Apps > Drafts > Publish, Configure Actions / Access, "Create plugins with MCPs" permission) come from search snippets only. |
| Gemini CLI | Enterprise console labels and admin roles are undocumented; keep the allowlist step and flag it. |
| Gemini Enterprise | Add org-policy override (Organization Policy Administrator), egress FQDN allowlist, `custom_mcp` data source, second Continue, Actions > Reload custom actions > Enable actions. Fix the PKCE claim. |
| Antigravity | IDE verify uses `…` > `MCP Servers`, not the app/2.0 flow. CLI verify needs the pasted auth code. CLI `registration` is "static"; the app is "both". Add `~/.gemini/config/mcp_config.json`. Enterprise needs the admin allow-list (Gemini Enterprise > Settings > AI developer tools > Security > MCP Servers > Allowed server configuration), or Canvas shows "Blocked by Admin Policy". Only a Google codelab documents it. |
| Copilot Studio | Drop the unsourced "classic experience" claim. Labels are "Manual", "Token URL template", "Server name", "callback URL". The Accept-header policy has no official source; keep it labeled as an Instructure workaround. Add Teams / M365 publishing (agent-level "Authenticate with Microsoft") and the Power Platform data policy notes. |
| Superhuman Go | No install mode is confirmed: use an empty `installModes` list and do not label its print context or share link as personal. Replace the false "MCP server connection fields" note with the verified developer-Pack limitation. Keep facts unknown and guides pending. |

## 3. Code design (not monolithic)

Today each client is one large file in `src/clients/curated/<name>.ts` that mixes facts, evidence, and both guides. Split each client into a folder. Guides are built from small step modules that other guides can import.

```
src/clients/curated/<client>/
  index.ts          # ClientDefinition: id, name, installModes, setupNote, verify; imports below
  facts.ts          # typed facts + evidence
  sources.ts        # Evidence constants (vendor docs, dates)
  personal.ts       # Guide for personal install (composes steps)
  enterprise.ts     # Guide for enterprise install (composes steps)
  steps/            # one file per step or small step group, exported as ClientGuideStep(s)
    add-server.ts
    authenticate.ts
    verify.ts
    admin-allowlist.ts   # enterprise-only, as needed
src/guides/
  screenshots.ts    # screenshot() helper and placeholder URL builder (section 4)
  blocks/           # cross-client content reused by several clients
    callback-uri.ts, secret-handling.ts, verify-courses.ts, admin-roles.ts
```

Rules:

- A guide file only lists steps and prerequisites. Step text lives in `steps/`. A step file exports a function taking the parameters it needs (for example `{ key: "public" | "private" }`) and returns a `ClientGuideStep`, so Claude personal and Claude enterprise share the "connect and verify" step.
- Personal and enterprise guides are separate files and export separately. `index.ts` stays under about 60 lines.
- Shared cross-client blocks go in `guides/blocks/`. A block used by a single client stays in that client's `steps/`.
- Keep `{mcpUrl}`, `{clientId}`, `{authUrl}`, `{tokenUrl}`, `{scope}` interpolation as today; no new placeholder syntax.
- Guides keep `status: "documented"` only for steps with a vendor source. Steps from search snippets or codelabs get a source with `method: "vendor-doc"` and a `confidence` note in the guide `sources` label, for example "Google codelab, not reference docs".
- Update `README.md` maintenance section and the existing `tests/guides.test.ts` / `updatedGuides.test.ts` for the new layout.

### Type change

Add one content kind to `StructuredContent` in `src/guides/types.ts`:

```ts
| { kind: "image"; name: string; alt: string; width: number; height: number; placeholder: boolean }
```

`screenshot(name, alt)` in `guides/screenshots.ts` returns this block. Rendering (`guides/render.ts`) outputs an `<img>` with `alt`, `width`/`height`, and a `loading="lazy"` attribute, mirroring `canvasStepImage`.

## 4. Screenshot placeholders

- Placeholder URL: `https://placehold.co/960x540/png?text=<name>` with the screenshot name URL-encoded (use `+` for spaces). Size is 960x540 unless the step needs a tall or narrow shape (terminal panes: 960x360).
- The `name` comes from the research `SCREENSHOT:` marker (snake_case, prefixed by client). Real files go in `public/images/<client>/<name>.png`.
- `screenshot()` resolves the URL from a single manifest, `src/guides/screenshot-manifest.ts`, mapping name to `{ file?: string }`. If `file` is missing the helper returns the placehold.co URL and sets `placeholder: true`; once a real file is added, only the manifest changes.
- Add an `evidence:check`-style script check that lists names still on placeholders so admins and docs owners can track them. Print the list in CI as non-blocking.
- `alt` text describes what the final screenshot shows (copy from the marker text), not "placeholder".
- Client Canvas sign-in/authorization steps share the real `public/images/client-canvas-oauth_authorize.png` capture (732x400) through `canvasAuthorizationScreenshot()`, replacing equivalent consent placeholders. Blocked flows remain blocked; Go research previews do not imply a supported sign-in flow.
- Check that the page CSP and the print stylesheet allow the placehold.co host; if not, ship local SVG placeholders in `public/images/placeholders/` instead and keep the same helper.
- The checked-in `apps/canvas-mcp/index.html` has no CSP declaration. A hosting-level policy may still restrict images from placehold.co; verify it before deployment.
- Do not put real tenant data, names, client secrets or Client IDs in final screenshots. Redact secrets. Use synthetic tenants. Screenshots from a customer environment need review for FERPA/PII before they ship.

Screenshot counts from research: Claude 19, Codex/ChatGPT 12, Gemini 22, Antigravity 14, Copilot/Superhuman 16 (83 marker lines; a few repeat across modes).

## 5. Work breakdown

Each row is one commit and one reviewable change. Rows 2 to 6 are independent once row 1 lands and can be done in parallel by separate sessions (each touches only its own client folder).

| # | Task | Files |
| --- | --- | --- |
| 0 | Add the evidence-based client status pill and known-issue alerts on admin and client pages. | `clients/types.ts`, `clients/status.ts`, admin/page rendering, tests |
| 1 | Add `image` content kind, `screenshot()` helper, manifest, renderer and print support, tests. Convert one small client (Generic or Copilot Studio) to the folder layout as the reference. | `guides/types.ts`, `guides/render.ts`, `guides/screenshots.ts`, `guides/screenshot-manifest.ts`, tests |
| 2 | Claude.ai / Desktop and Claude Code (personal and enterprise). | `clients/curated/claude-ai/`, `claude-code/` |
| 3 | Codex and ChatGPT (personal and enterprise). Keep the ChatGPT connection blocker. | `codex/`, `chatgpt/` |
| 4 | Gemini CLI and Gemini Enterprise. Keep the Gemini CLI deprecation notice. | `gemini-cli/`, `gemini-enterprise/` |
| 5 | Antigravity IDE and CLI (separate evidence). | `antigravity/`, `antigravity-cli/` |
| 6 | Copilot Studio (enterprise only, add Teams/M365 and data-policy steps). Superhuman Go: facts and install modes only, guides stay pending. | `copilot-studio/`, `superhuman-go/` |
| 7 | Update `facts` from the confirmed list in section 2; run `evidence:check`. | each client `facts.ts` |
| 8 | README and test updates; screenshot placeholder report. | `readme.md`, `tests/` |

Acceptance criteria:

- Every curated client with `installModes` including `enterprise` renders an admin guide with Canvas and provider surfaces, each provider step that needs a UI capture shows an image block, and the client section ends with a verify step.
- Every personal guide has a screenshot slot for each UI step (CLI steps use a terminal capture only where the research marks one).
- No guide file exceeds roughly 120 lines; no client has a single file mixing facts, sources and guides.
- The guide tests pass, typecheck and build pass, print output includes the images.
- No step text is invented. Anything research marks "Not documented" appears as a short note or stays out.

## 6. Open items that block or soften guides

Ask the vendor or confirm in a browser before the real screenshots are taken.

1. **Superhuman Go**: every help.superhuman.com page returned 403. Custom MCP connectors are developer-built Packs (Packs SDK `addMCPServer`), with static OAuth credentials uploaded in Pack Studio Settings. No Go UI taking an MCP URL plus Client ID and secret is documented, nor the redirect URI or personal versus admin flow. The research file lists 7 questions for Superhuman. No Go steps until answered.
2. **ChatGPT**: help.openai.com returned 403. The workspace publish steps and the "Create plugins with MCPs" permission need a browser check. Plan tiers, developer mode requirement and the member install flow are undocumented. The Canvas auth bug blocker remains.
3. **Claude Code**: whether `oauth.clientId` is honored inside `managedMcpServers` (pilot first); minimum version for `--client-id` and the add-json `oauth` fields; button labels in `/mcp`; how admins verify an org connector; admin tool controls (the end of the code.claude.com MCP page was unread). Managed Canvas secrets are not documented; private keys use the allowlist plus per-user `--client-secret`.
4. **Gemini CLI enterprise**: console menu labels and admin roles undocumented; allowlist clears local `httpUrl` (transport behavior unverified). Migration dates: geminicli.com says Antigravity CLI replaced Gemini CLI on 2026-06-18 for unpaid and Google One users; the enterprise exemption rests on secondary sources.
5. **Gemini Enterprise**: end-user connector toggle label and whether Client Secret may be blank are undocumented.
6. **Antigravity**: omitting `clientSecret` for a public key, allow-list JSON schema and wildcard rules, MDM/managed config, OAuth endpoint discovery; no source says it succeeds Gemini CLI.
7. **Copilot Studio**: PKCE, token endpoint auth method, and whether tool sign-in works inside Teams or M365 Copilot.
8. **Claude redirect**: third-party guides also register `https://claude.com/api/mcp/auth_callback`; the vendor does not. Keep to the vendor URI unless a live test shows otherwise.
9. Whether the Instructure internal guidance may be cited by label; keep internal sources as "Instructure setup guidance" with no URL, as in phase 2.

## 6.1 Client validation status (admin and client pages)

When a client is selected in the admin Configuration panel, show the Pantoken `instui-pill` component directly below its selector:

- **Validated** (success variant, badge-check icon): at least one maintainer-performed end-to-end Canvas MCP connection test is recorded in the internal test log. Vendor documentation and source inspection alone are not validation. The pill does not imply every key type, install mode, or version was tested.
- **Untested** (default/neutral variant, badge-question-mark icon): no successful end-to-end test is recorded, and no active known issue applies to the selected install mode.
- **Known issue** (danger variant, badge-alert icon): an active, evidenced blocker or product limitation applies. Show a danger alert on both Configure a Server and Connect a Client, with the specific issue when known. Do not show alerts for Validated or Untested.

Initial classifications from the evidence currently in this plan:

| Client / mode | Status | Basis |
| --- | --- | --- |
| Claude Code / personal | Validated | Internal log records a successful end-to-end test; version and key type were not recorded. |
| ChatGPT / personal or enterprise | Known issue | Canvas MCP authentication bug; setup remains blocked pending a successful retest. |
| Gemini CLI / personal | Known issue | Deprecated for non-Enterprise use; direct users to Antigravity CLI. |
| Gemini CLI / enterprise | Untested | Research says Enterprise is expected to continue working; it is not a validation result. |
| All other clients and modes | Untested | No end-to-end result is recorded. |

Do not infer validation from `Fact.status === "documented"` or from a guide's `status === "documented"`. Keep status data separate from guide evidence and keep the internal test log out of public guide copy.

## 7. Data handling

Guides contain no customer data. Screenshots and live tests must use a synthetic tenant and fake or revoked credentials. Real Client IDs and secrets are never committed or shown in an image. Before publishing enterprise screenshots taken in real admin consoles, have Security or Privacy review them for tenant names, user emails and org IDs (FERPA/GDPR exposure for student or staff data).

## 8. Internal test log (not for the public site)

Do not copy these entries into guide text, `sources`, `Evidence` labels or the README. The public site keeps its vendor-doc evidence. Use this log only to decide confidence and to prioritize retests.

| Date | Client / mode | Result | Notes |
| --- | --- | --- | --- |
| 2026-10-17 | Claude Code, personal | Works | Maintainer verified end to end: server added, `/mcp` authentication, Canvas sign-in, connection confirmed. Callback was the fixed `http://localhost:8081/callback`. Key type (public or private) and Claude Code version not recorded; ask when retesting. |
