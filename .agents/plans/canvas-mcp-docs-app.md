# Plan: `canvas-mcp` docs app (instructure.ai/canvas-mcp)

Status: draft for review. Nothing is built yet.
Repo: `instructure/instructure.ai` (pnpm monorepo, `apps/*`, deployed to GitHub Pages by `.github/workflows/deploy-apps.yml`).

## 1. Goal

A public, unauthenticated docs app at `instructure.ai/canvas-mcp`. A reader enters their Canvas domain (`<sub>.instructure.com` or `<sub>.beta.instructure.com`) and picks an MCP client (or "Generic"). The app works out their MCP server region and shows copy-ready setup steps with their real values filled in. Two audiences:

- **Admins**: configure the Canvas developer key (the "admin token") and send Instructure what it needs.
- **Users**: connect a specific client to the Canvas MCP server.

State lives in the query string (shareable) and in localStorage (remembered).

## 2. What research found (decisions depend on this)

Sources: Google Doc "Canvas MCP server: customer setup guide" (updated Sep 11, 2026), `instructure-internal/maple` (README, `docs/oauth/*`, `region-validation.service.ts`), `dyoshikawa/rulesync` docs, `thedannywahl/pantoken` (`formats/components`, docs theme), `apps/nutritionfacts`.

### MCP URL and auth facts (from maple + the Google Doc)

| Item | Value |
| --- | --- |
| Prod MCP URL | `https://<sub>.maple.<region>.core.inseng.io/mcp` |
| Beta MCP URL | `https://<sub>.maple-beta.<region>.core.inseng.io/mcp` |
| Canvas auth URL | `https://<canvas-domain>/login/oauth2/auth` |
| Canvas token URL | `https://<canvas-domain>/login/oauth2/token` (also the refresh URL) |
| Scope | `https://sso.canvaslms.com/all-client-scopes` |
| Regions | `us-east-1`, `us-west-2`, `eu-west-1`, `eu-central-1`, `ca-central-1`, `ap-southeast-1`, `ap-southeast-2` |
| Key types | Public (Client ID, PKCE) is the default. Private (Client ID + Secret) is required by Copilot Studio and Gemini Enterprise. |
| Region mismatch | Rejected with 401 / `DomainRoutingException`. The region must match the Canvas account's region. |

Redirect URIs per client (Google Doc section 2): Claude.ai/Desktop `https://claude.ai/api/mcp/auth_callback`; Claude Code `http://localhost:8081/callback`; Codex `http://localhost:8081/callback/<callbackId>` (Instructure confirms the ID); Copilot Studio is generated on save; Gemini Enterprise `https://vertexaisearch.cloud.google.com/oauth-redirect`.

### Region: manual dropdown for now (auto-detect findings kept for Phase 2)

I probed `utah.instructure.com` and `utah.beta.instructure.com`:

- **Correction (from review): `x-canvas-meta` does carry the region.** It includes `z=<availability zone>`, for example `z=us-east-1c`. Drop the trailing letter to get the region. I confirmed `z=` on `/shard_info`, `/api/v1/accounts` and `/api/v1/services/kaltura` for a prod tenant (my first probe truncated the header). The `z` value is the AZ of the host that served the request, and `c=cluster2`, `s=2` also appear. `x-amz-cf-pop` is the CloudFront edge of the caller and is not usable.
- **But a browser still can't read it.** None of those endpoints send `Access-Control-Allow-Origin`, so JS on instructure.ai can't read response headers (a `no-cors` fetch returns an opaque response with no headers). The header would be readable only if Canvas added `Access-Control-Allow-Origin` plus `Access-Control-Expose-Headers: x-canvas-meta` for our origin.
- **DNS carries no region.** Canvas sits behind CloudFront, so a DoH lookup returns CloudFront IPs only.
- **`GET https://<canvas-domain>/shard_info` is the real source.** It is unauthenticated and returns `{"region":"us-east-1","database":"cluster2","shard":2}`. Maple uses exactly this for region enforcement.
- **No CORS.** `/shard_info` sends no `Access-Control-Allow-Origin` and `OPTIONS` returns 404, so a browser on instructure.ai cannot read it. The Maple hosts have no CORS headers either, and all seven regional hosts answer 200 for `.well-known`, so probing them can't tell regions apart.

- **Developer docs review (developerdocs.instructure.com) found no browser-only route.**
  - `POST /login/oauth2/token` returns `canvas_region` ("the AWS region ... in which the institution ... resides"), but only on a successful code exchange. A fake init fails first: `GET /login/oauth2/auth` with a bogus client returns 401, and a bogus token POST returns `invalid_client` with no region and no CORS headers (`OPTIONS` is 404).
  - `GET /api/v1/accounts/search` (Account Domain Lookups) is CORS-open (`Access-Control-Allow-Origin: *`) on tenant hosts, prod and beta. The body has no region and there is no `Access-Control-Expose-Headers`, so `x-canvas-meta` still can't be read. It is usable to confirm the domain exists (`?domain=<tenant>`), so the selector can show "domain found" before any region step.
  - Other CORS-open endpoints checked (`/api/lti/security/jwks`, `/api/v1/brand_variables`) have no region in the body.

**Decision: v1 ships a manual region dropdown only.** No proxy, no new infrastructure, no network call for region. Auto-detect is deferred to Phase 2 (below), which needs a change in a service we do not own.

Scope note: Maple is a separate, internal service repo. This app lives in its own repo and only *reads* Maple's code and docs so the documentation is accurate. Nothing here deploys to or changes Maple.

### Admin flow: the customer's admin creates an MCP developer key in Canvas (decided)

The Google Doc says Instructure issues the key. The decision for this app is that the customer's Canvas admin creates it. The admin page is "do these steps". Sources: the field list from the Canvas MCP team (below), plus maple `docs/oauth/canvas-oauth-setup.md` and `oauth.md` for what the key must contain.

**MCP developer key form.** Field list from the team; labels and layout confirmed against three Canvas screenshots (Key Settings x2, Developer Keys list). The screenshots show the top of the form only; Client Credentials Audience, Allowed Audiences, Authorized Flows and Client Type sit below the fold and use the team's wording.

| Field (as labeled) | What the admin does | Source / note |
| --- | --- | --- |
| Key Name | Any name, for example "Canvas MCP". | Free text. |
| Owner Email | An admin or team mailbox. | Free text. |
| Redirect URIs | Default: only `http://localhost:8081/callback` (Claude Code and the other localhost clients). Add a client's own URI only when that client requires one (for example `https://claude.ai/api/mcp/auth_callback`, Gemini Enterprise's URI, Codex's callback with its ID). One per line. Must match exactly (casing, protocol, host, port, path, query). Up to 64 per key. | Canvas helper text under the field. Page generates the block from the selected clients (Section 4) and lists nothing else. |
| Linked Partner App, Vendor Code (LTI 2) | Leave blank. | Greyed or empty in the screenshots; the page says to skip them. |
| Icon URL, Notes | Optional. | Free text. |
| Test Cluster Only | **Beta tenants only.** Check it. Keys are not created in beta: the admin creates the key on production Canvas with this box checked, Canvas copies it to beta, and in production it does nothing. Leave unchecked for production use. The beta copy keeps the same Client ID, secret and Allowed Audiences entry. | Confirmed by the team. Exact checkbox position not in the supplied screenshots. |
| Client Credentials Audience | **Canvas**, for both public and private keys. | Decided. |
| Allowed Audiences | Always select the entry `https://{{tenant_name}}.maple.<region>.core.inseng.io/` from the pre-populated list (it can hold other entries). Keep the trailing slash and do not replace `{{tenant_name}}`. Beta keys use the same entry. | `allowed_audiences` used to be Rails-console only; the in-app list is the fix (known issue being fixed, so wording is time-sensitive; see Risks). Missing or wrong entry shows up as `invalid_target`. Why always: see "Which clients send `resource`" below. |
| Authorized Flows | Public key: **null**. Private key: **Token Exchange**. | Decided. |
| Client Type | Public (no secret, PKCE) or Confidential (has a secret). | Per client, from the key-type table. |
| Enforce Scopes | On. | maple: required. |
| Method | **Paste Scopes** (recommended). Manual (checkboxes) is possible but the page does not document it. | Paste Scopes takes **one scope per line**. |
| Allow Include Parameters | On. | maple: off makes several tools return incomplete data with no error. One screenshot (public key) shows it unchecked; the page tells admins to check it. |

After saving, the key appears on the Developer Keys list at `/accounts/self/developer_keys` (Account tab). The **Details** column shows the numeric Client ID. For a confidential key it also shows a partial secret and a Regenerate Secret button; for a public key that button is disabled and there is no secret. The **State** column holds the on/off toggle, which must be on. The page shows annotated mockups of this list (synthetic data, see Section 10) so admins know where to copy the Client ID.

**Scopes.** maple requires the key to carry `https://sso.canvaslms.com/all-client-scopes`, `url:POST|/api/v1/oauth2/introspect` and every per-tool scope; a key whose only scope is `all-client-scopes` is rejected. The per-tool list comes from maple's `scripts/print-tool-scopes.sh` and changes when tools change. Plan: a maintainer with maple access runs a script that writes `src/content/scopes.generated.json` (with the maple commit SHA and date). The admin page renders it as a copyable Paste Scopes block and as a checkbox reference. It is not fetched in CI because maple is a private repo. Publishing the list tells readers which write and delete operations the server supports; it is Canvas API scope names only, but have Product/Security confirm before release (Section 10).

**Which scopes customers paste (decided).** The current Maple documentation is authoritative. The Paste Scopes block is: `https://sso.canvaslms.com/all-client-scopes`, `url:POST|/api/v1/oauth2/introspect`, then every per-tool `url:` scope generated from Maple's tool source (`scripts/print-tool-scopes.sh`), one per line. The older public-key screenshot (which also lists `/auth/userinfo`) is treated as outdated. The private-key screenshot is the format reference.

**`https://sso.canvaslms.com/mcp-limited` is not in the default list.** It appears in the private-key screenshot, but Maple's onboarding doc says it is the hyperscaler-partner restriction: when present, Maple strips content fields (descriptions, announcement messages, syllabus body, grades) from tool responses, and long-term Canvas applies it automatically to partner-generated keys (target 2027-01-01). A customer who pastes it would silently get reduced results. The page does not include it and, in the troubleshooting section, explains the symptom. If you want a "limited access" variant for a given client, say so.

**Which clients send `resource` (investigated).** The `resource` parameter (RFC 8707) names the MCP server the token is for; Canvas rejects it with `invalid_target` unless the key's Allowed Audiences contains that URL.
- MCP TypeScript SDK (`modelcontextprotocol/typescript-sdk`, `client/auth.ts`): sets `resource` on the authorize URL from protected-resource metadata. Generic clients built on it send it. Maple's docs name Claude Code-style config as the case that needs the audience.
- Codex (`openai/codex` using `modelcontextprotocol/rust-sdk` `rmcp`): `resource` is added to the authorize, code-exchange and refresh requests. It defaults to the resource from protected-resource metadata, or the server URL, and Codex also has an `oauth_resource` override. So Codex always sends it.
- Claude.ai/Desktop: closed source, not verified directly. Anthropic's connectors follow the MCP authorization spec, and the Google Doc's `invalid_target` entry assumes it.
- Copilot Studio, Gemini Enterprise: not verified. Maple's docs say clients configured with separate Authorization and Token URLs do not send `resource`, which matches their forms, but this is unconfirmed.
Decision: **always select the audience for every client.** It costs the admin one list pick, avoids `invalid_target`, and is harmless when unused. `sendsResource` stays as a documented fact per client, not as a switch.

**Region on the admin page.** The Allowed Audiences list is filled in by Canvas, so the admin does not need to pick a region to create the key. Region is only needed to build the MCP Server URL users paste into their client and to build the "Copy user link". So: region dropdown is optional on the admin page and required on the user page. Helper text for the dropdown: the region appears in the Allowed Audiences entry in Canvas.

### rulesync

rulesync generates per-tool MCP config from one canonical `.rulesync/mcp.jsonc` (`mcpServers`, `type: "http"`, `url`, `headers`, `enabledTools`/`disabledTools`). Its supported-tools table (`docs/reference/supported-tools.md`) lists about 60 targets with an `mcp` column. Several translate fields (for example Codex maps `headers` to `http_headers` and normalizes server names). Whether canonical config can carry the OAuth client ID, callback port and scope for each target is not documented in what I read. That needs a spike (Phase 0).

### Repo conventions (from `instructure.ai`)

- New apps come from `pnpm new <name> --template vanilla|react|instui` (the readme warns against adding one by hand).
- Vite `base` becomes `/<pkgName>`, output goes to `dist/<pkgName>`, so package dir `apps/canvas-mcp` serves at `/canvas-mcp`.
- `public/404.html` redirects every unknown path to the Ignite AI page, so every route must be a real built file. No client-side path routing.
- Deploy workflow rebuilds on any change under `apps/`.
- nutritionfacts patterns to reuse: iframe detection (`globalThis.self !== window.top`), `data-print="..."` attributes with an `@media print` block in `app.css`, `@media screen` hide for print-only content, `prefers-color-scheme` listener, permalink and embed-code copy controls, `tests/readme.test.ts` and `tests/package.test.ts`.

## 3. Decisions

1. **Template: `vanilla` (no React, no InstUI).** `@pantoken/components` is plain CSS, so React adds nothing. Smaller bundle and simpler iframe embedding.
2. **Styling:** `@pantoken/components` (`base.css`, `components.css`, `prose.css`, `utilities.css`, `fonts.css`, `icons.css` as needed). Theme is pantoken `rebrand` with the `red` color, light and dark. Use pantoken's scoping attributes (`data-pantoken-theme="rebrand"`, `data-pantoken-color="red"`, `data-pantoken-scheme`) that the pantoken docs site uses in `docs/.vitepress/theme/theme.ts`. Verify exact attribute names against the published `@pantoken/components@2.1.1` in Phase 0.
3. **Interactive pieces are ours.** The pantoken components are static CSS, so tabs, toggles and selects get small vanilla TS wired to `instui-*` classes (button, text-input, simple-select, table, tag/pill, alert, card, toggle-details, breadcrumb, heading, link, list).
4. **Logo:** Canvas logo from pantoken (`@pantoken/plugin-logos`, re-exported by the `pantoken` package as `logos`). Confirm the export name and that a light and a dark variant exist; otherwise add the SVGs to `apps/canvas-mcp/src/assets` like nutritionfacts does (`logo.svg`, `logoDark.svg`).
5. **Content as typed data** (the repo is the source of truth; the Google Doc will not change and is not kept in sync. Content is ported from the Doc's Sept 11, 2026 version once, and the readme records that.), not hand-pasted prose in HTML. One module per client under `src/content/clients/`, rendered by shared templates, so a URL or scope change is a one-line edit.
6. **Pages (all real files):** `/canvas-mcp/` (users), `/canvas-mcp/admin/` (admins). Vite multi-page build. Shared header with the domain and client selector on both.
7. **Client list:** three sources merged at build time into one list. (a) Curated group shown first (Claude.ai/Desktop, Claude Code, Codex, Copilot Studio, Gemini Enterprise, Superhuman Go, Generic). (b) A generated "More clients" list: the build script reads a pinned copy of rulesync's supported-tools table and keeps rows with MCP support. (c) Custom clients defined by a schema (below), for tools rulesync does not cover. Form-based clients (Claude.ai, Copilot Studio, Gemini Enterprise, Superhuman Go) use the field-table template rather than a rulesync snippet.

### Custom client schema

Clients outside rulesync are data, not code. One JSON file per client in `src/content/clients/custom/`, validated at build time against `src/content/client.schema.json` (JSON Schema, draft 2020-12) and typed by a `ClientDefinition` interface generated from it.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | slug | Used in `?client=`. Unique across curated, rulesync and custom. |
| `name`, `vendor` | string | Display. |
| `group` | `curated` or `more` | Where it appears in the select. |
| `source` | `custom` or `rulesync` | rulesync entries add `rulesyncTarget`. |
| `setupKind` | `form`, `cli`, `file` or `ui-steps` | Picks the template. |
| `keyTypes` | array of `public`, `private` | Which key types work. |
| `pkce` | `required`, `optional`, `off` | Shown in the field table. |
| `sendsResource` | `yes`, `no`, `unknown` | Evidence for whether the client sends the OAuth `resource` parameter. Informational (shown in the client's notes); the admin page selects the audience for every client regardless. |
| `redirectUris` | array of `{ uri, note }` | May include `{callbackId}` style tokens with a note when Instructure/the client generates them. |
| `fields` | array of `{ label, value }` | Values use tokens: `{mcpUrl}`, `{authUrl}`, `{tokenUrl}`, `{clientId}`, `{clientSecret}`, `{scope}`. |
| `steps` | array of `{ title, body, code? }` | Markdown-lite body, same tokens. |
| `verify` | string | The check that proves it works. |
| `troubleshooting` | array of `{ symptom, cause, fix }` | Merged with the shared table. |
| `lastVerified` | date | Shown on the page. |
| `sources` | array of URLs | Vendor docs the entry was written from. |

A build test fails if an entry has an unknown token, a missing `lastVerified`, or no `verify` step. Adding a client is a PR with one JSON file.

**Superhuman Go** is the first custom client and is a **TODO**: its entry is deferred and not part of v1 unless the details arrive. I have not researched its MCP connector. Before writing its entry we need: where users add a custom MCP server, whether its form takes Client ID, Client Secret, scopes and PKCE settings, the redirect URI it uses, and whether it needs a public or private key. See open question 2 (deferred).

## 4. Page design

### Header (both pages)
Canvas logo, title, theme toggle (system / light / dark), "Copy link", "Copy embed code", print button. Hidden when embedded or printing.

### Selector panel
- Canvas domain input. Accept only `*.instructure.com` and `*.beta.instructure.com`, validated with `^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.(beta\.)?instructure\.com$`. Accept pasted full URLs and strip scheme and path. Dev, edge, CD and CI hosts are not available to customers and are rejected as unsupported. Vanity domains are CNAMEs to `*.instructure.com`, so the helper text says: "Using a custom domain such as canvas.school.edu? Enter the matching instructure.com address instead." Maple does the same: it only ever targets `<sub>.instructure.com` or `<sub>.beta.instructure.com`.
- Client select (grouped: Anthropic, OpenAI, Microsoft, Google, Other rulesync targets, Generic).
- Key type toggle (Public / Private), shown only for clients where both are valid.
- Region dropdown (required on the user page, optional on the admin page; no default). Options are the seven regions, each labeled with the Instructure code, for example "US East (N. Virginia), us-east-1". Helper text: "Your region is in the Allowed Audiences entry on your Canvas developer key (for example maple.us-east-1), or ask your Customer Success Manager." Until a region is chosen, derived MCP URLs show `<region>` as a placeholder and are not copyable.
- Derived values card: MCP URL, auth URL, token URL, scope, each with a copy button. Placeholders (`<CLIENT_ID>`) stay as literal tokens until the reader supplies one.

### User page (`/canvas-mcp/`)
Per selected client: prerequisites (key type, redirect URI that must be registered, plan or software), numbered steps with copy-ready snippets filled with derived values, rulesync `.rulesync/mcp.jsonc` snippet plus `rulesync generate --targets <target> --features mcp` where applicable, verify step, troubleshooting rows for that client. Generic shows the field table (MCP URL, Authorization URL, Token URL, Client ID, Client Secret, Scopes, PKCE).

### Admin page (`/canvas-mcp/admin/`)
1. What the server is and how sign-in works (short).
2. Pick key type (decision table: which clients need private, from the Google Doc and the rulesync/OAuth matrix from Phase 0).
3. Create the MCP developer key: the field table above with the value for each field, filled from the selector (tenant, selected clients, key type). Copyable blocks: Redirect URIs (one per line) and Paste Scopes (one per line).
4. Redirect URIs per client (table filtered by selected clients; port 8081 note; Codex callback ID note). The same list feeds the Redirect URI(s) block in step 3.
4b. Beta tenants: when the selected domain is `*.beta.instructure.com`, the page shows the beta flow. Sign in to the **production** Canvas for the same subdomain (`<sub>.instructure.com`), create the key on `/accounts/self/developer_keys` with **Test Cluster Only** checked, and expect it to appear in beta. Users still connect to the `maple-beta` MCP URL and the beta Canvas OAuth URLs.
5. After saving: on `/accounts/self/developer_keys`, copy the Client ID from the Details column (and the secret for a confidential key), confirm State is on, then share the user link. A "Copy user link" button builds `?domain=&region=&client=&clientId=` so admins can send users a prefilled page. Never includes a secret.
6. Environment and region matching table (prod vs beta hosts).
7. Troubleshooting table (from Google Doc section 9) and OAuth/PKCE/`resource` FAQ (section 10).
8. Getting help: what to include in a support request.

### Embed and print (mirrors nutritionfacts)
- Embedded mode: auto-detected via `self !== top`, plus `?embed=1` to force it. Hide header, background and footer, drop shadow and radius.
- Height: the content is dynamic, so the iframe posts its height to the parent with `postMessage({type:"canvas-mcp:height", height})` on resize. "Copy embed code" outputs the iframe plus a 10-line listener snippet. Target origin is `https://instructure.ai`; the embed code states this.
- Print: `data-print` attributes and `@media print` rules copied from nutritionfacts `app.css`. Expand all collapsed sections, hide controls, append a footer with the permalink and the date generated. Never print a client secret (the page never holds one).

## 5. State: query string and localStorage

| Param | Meaning | Values |
| --- | --- | --- |
| `domain` | Canvas domain | `utah.instructure.com` |
| `client` | Client slug | `claude-code`, `codexcli`, `generic`, ... |
| `region` | Region (chosen in the dropdown) | one of the 7 regions |
| `key` | Key type | `public` (default), `private` |
| `clientId` | Optional, lets an admin share a prefilled link. Public by design (OAuth client IDs appear in authorization URLs and are not secrets, RFC 6749 section 2.2). | numeric string |
| `embed` | Force embedded mode | `1` |

- Precedence: URL, then localStorage, then defaults.
- localStorage key `canvas-mcp:v1`: `{ domain, client, key, region }`. Every read and write sits in try/catch (private windows, blocked storage); the page works without it.
- On change, `history.replaceState` updates the query string. No page reload.
- Never accept or store a client secret. The form has no field for one. `clientId` is a public identifier. If the Canvas team says developer-key IDs must stay private, remove the `clientId` param, field and "Copy user link" button; nothing else depends on them.

## 6. Region selection (v1) and Phase 2 note

**v1:** a plain dropdown (Section 4). `region` is validated against the seven-value allowlist when read from the URL or localStorage; any other value is ignored. Beta and prod use the same region list.

**Phase 2 (not in scope now): Maple exposes a public region route.** Auto-detect needs a CORS-enabled response a browser can read. The findings above show Canvas does not provide one. Maple already calls Canvas `/shard_info` server-side for its region guard, so the clean fix is a public, CORS-enabled lookup route on Maple (for example `GET /region?domain=<tenant>`, allowed origin `https://instructure.ai`, returning only `{ "region": "..." }`, reusing its Canvas-domain validation, and excluded from auth like `/health`). That change belongs to the Maple team in the Maple repo. When it ships, this app adds a "Detect" step in front of the dropdown, with the dropdown kept as override and fallback. Alternative with the same effect: Canvas adds CORS plus `Access-Control-Expose-Headers: x-canvas-meta` (or CORS on `/shard_info`) for `https://instructure.ai`. A standalone proxy service is the last resort and is not planned.

## 7. File layout

```
apps/canvas-mcp/
  index.html                  # users page
  admin/index.html            # admins page
  package.json                # @instructure.ai/canvas-mcp, deps: @pantoken/components
  vite.config.mts             # mergeConfig(shared vanilla), rollupOptions.input for both pages
  vitest.config.mts           # jsdom, mirrors nutritionfacts
  tsconfig.json
  readme.md                   # usage, query params, embed, print (nutritionfacts style)
  public/                     # favicon, og image
  scripts/
    build-clients.mts         # rulesync table + overlay -> src/content/clients.generated.json
  src/
    main.ts, admin.ts         # page entry points
    app.css                   # pantoken imports, layout, @media print, embed rules
    state/                    # params.ts, storage.ts, regions.ts (allowlist), derive.ts (URL builders)
    components/               # selector, derivedValues, clientView, copyButton, themeToggle, embedControl
    content/
      clients/*.ts            # one typed module per client
      admin.ts, troubleshooting.ts, faq.ts
      clients.generated.json  # build output, committed so builds are offline-safe
    assets/                   # logo.svg, logoDark.svg (if not taken from pantoken)
  tests/                      # readme.test.ts, package.test.ts (copy nutritionfacts patterns)
```

Create with `pnpm new canvas-mcp --template vanilla`, then fill in. Do not hand-edit workspace registration.

## 8. Phases

Phases 0 to 5 below are the v1 build. "Phase 2" in Section 6 means the later product phase (region auto-detect via a Maple route), not build step 2.

**Phase 0: spikes (half day)**
1. Confirm `@pantoken/components@2.1.1` import paths, theme attribute names, `rebrand` + `red` rendering in light and dark, and the logo export.
2. For 5 to 8 representative rulesync targets (claudecode, codexcli, cursor, copilot, opencode, geminicli if present, zed, kiro-cli), run `rulesync generate --features mcp` with an HTTP server entry. Record the generated file path, and whether OAuth client ID, callback port, scopes and a secret survive. This decides what each client page can say honestly ("rulesync writes the server entry; run `/mcp` to sign in" versus "add this field by hand").
3. (Dropped) Proxy vs direct detection. Deferred to Phase 2 above.

**Phase 1: scaffold and shell**
`pnpm new`, vite multi-page config, pantoken styles, theme toggle, header, logo, selector, state module (params + localStorage), derive module, unit tests for all three.

**Phase 1b: region dropdown**
`regions.ts` allowlist, dropdown with labels, placeholder behavior until chosen, URL/localStorage validation tests (valid, unknown value, missing). Auto-detect is Phase 2 of the product (Section 6) and depends on the Maple route.

**Phase 3: content**
Client modules for Claude.ai/Desktop, Claude Code, Codex, Copilot Studio, Gemini Enterprise, Generic. Then `build-clients.mts` and the rulesync target pages using the Phase 0 matrix. Admin page sections 1 to 8. Content is ported from the Google Doc, with the section 8 and 9 tables as data.

**Phase 4: embed, print, accessibility**
Iframe mode and height messaging, copy-embed control, print stylesheet, print preview checks at Letter and A4. Run automatica11y or axe on both pages in light, dark, embedded and print.

**Phase 5: release**
readme, PR, deploy workflow publishes `dist/canvas-mcp`. Smoke test `https://instructure.ai/canvas-mcp/`, `/canvas-mcp/admin/`, a query-param permalink, and an iframe embed in a test page.

## 9. Testing

- Unit (vitest, jsdom): domain validation (good, beta, uppercase, with scheme, vanity, injection strings), URL derivation for prod and beta across all 7 regions, params/localStorage precedence, storage-unavailable path, region fetch states, clipboard helpers, client modules render without leftover `<placeholder>` tokens other than the intended ones.
- Snapshot-free content check: every client module has prerequisites, steps, verify, and a redirect URI entry.
- Manual: each client's steps run against a beta tenant (Claude Code and Codex are the cheapest to verify end to end).
- Lint, format and typecheck via `pnpm lint canvas-mcp`, `pnpm typecheck`; coverage written like other apps.

## 10. Data handling and review

- The page handles Canvas tenant subdomains and developer-key Client IDs. Those identify customers but contain no student or user data, so FERPA and COPPA are not triggered. Client Secrets are credentials: the page never accepts, logs or stores them, and the query string never carries them.
- The app makes no network calls with customer input in v1, so there is no new Security surface beyond a static site. When Phase 2 auto-detect is built, the Maple team owns the Security review of the lookup route. Have **Legal/Docs** review the public content, especially the early-access language and the "nothing is stored" claim, which comes from the Google Doc and maple README. Confirm those claims with the Canvas MCP team before publishing.
- Publishing the generated scope list reveals which Canvas write and delete endpoints the server supports. Get Product/Security sign-off before release.
- The screenshots supplied for this plan show a real employee email and real key IDs. They are not copied into the repo. Published page mockups use synthetic data (`owner@example.edu`, a made-up Client ID). Re-shoot or redraw them.
- Demos and screenshots use synthetic values only (`example.instructure.com`, a fake numeric Client ID).

## 11. Decisions and open questions

### Decided

| # | Topic | Decision |
| --- | --- | --- |
| 2 | Admin flow | The customer's Canvas admin creates the developer key. The admin page is step-by-step. |
| 3 | "Admin token" | The Canvas developer key: Client ID, plus a Client Secret only when the client requires a private key (per the rulesync/OAuth matrix and the Google Doc). |
| 4 | Domains | Only `*.instructure.com` and `*.beta.instructure.com`. Dev, edge, CD and CI hosts are not customer-facing. Vanity domains are CNAMEs to instructure.com, so users enter the instructure.com address. |
| 5 | Embed height | `postMessage` resizing. |
| 6 | `clientId` in the URL | Keep. OAuth client IDs are public by spec (they appear in authorization URLs). Remove the param if the Canvas team says developer-key IDs must stay private. The secret is never in the URL. |
| 7 | Client list | Curated group plus a generated "More clients" list, plus a JSON-schema-defined custom client list (first entry: Superhuman Go). |
| 9 | Admin UI capability | Resolved: the MCP key form has the fields listed in Section 2 (including an Allowed Audiences picker; the Rails-console gap is a known issue being fixed). |
| 11 | Client Credentials Audience | Canvas, for public and private keys. |
| 12a | Authorized Flows | Public key: null. Private key: Token Exchange. |
| 12b | Paste Scopes format | One scope per line. |
| 9b | Client ID and key state | Both on the Developer Keys list (`/accounts/self/developer_keys`), Details and State columns. |
| 9c | Allowed Audiences list | Pre-populated, can hold several entries; admin picks the `maple` entry shown in Section 2. |
| 13 | Beta keys | Created on production Canvas with Test Cluster Only checked; Canvas copies them to beta; no-op in production. |
| 14 | Scope list | Maple documentation is authoritative: all-client-scopes, introspect, per-tool scopes, one per line. `mcp-limited` excluded by default. |
| 15 | Redirect URIs | Only `http://localhost:8081/callback`, plus a client's own URI when that client requires one. |
| 10 | Superhuman Go | TODO, deferred. |
| 16 | Beta key identity | Same Client ID, secret and Allowed Audiences entry as the production key. |
| 17 | `mcp-limited` | Confirmed: excluded from customer keys. |
| 18 | Allowed Audiences | Always select the `maple` entry, for every client (investigated, see Section 2). |
| 8 | Content ownership | The Google Doc will not change. This repo is the source of truth. |

### Open

1. **Phase 2 owner.** To be decided; probably the Maple team (a public region route). Not blocking v1.
2. **Superhuman Go (TODO).** Deferred. When picked up: where users add a custom MCP server, form fields, redirect URI, key type, PKCE behavior, whether it sends `resource`, and a vendor doc link.
3. **Maple docs vs the beta answer.** Maple's onboarding doc says beta registers the `maple-beta` audience (`https://{{tenant_name}}.maple-beta.<region>.core.inseng.io/`). The team's answer is that a Test Cluster Only key uses the same entry as production. The page follows the team's answer. Worth a one-line confirmation that beta clients still resolve correctly with the `maple` entry, since a mismatch surfaces as `invalid_target`.

## 12. Risks

- The Allowed Audiences wording is time-sensitive: it describes the pre-fix state of a known issue. Keep it in one content module with a `lastVerified` date and a review reminder in the readme.
- `scopes.generated.json` can go stale when Maple's tools change. It records the Maple commit and date and the admin page shows them.
- Users must know their region. The dropdown helper text points them to the onboarding email and their Customer Success Manager; a wrong region produces the 400/401 errors covered in troubleshooting, which link back to the dropdown.
- Client UIs change (Claude, Copilot Studio, Gemini Enterprise). Each client module carries a "last verified" date shown on the page.
- rulesync target list changes quickly; pin a version in `build-clients.mts` and bump it on purpose.
- Codex's callback ID is derived from the exact MCP URL, so our page can't compute it. The page must tell users to ask Instructure for the full URI.
