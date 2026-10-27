# Plan: canvas-mcp Admin Phase 2 (client OAuth facts, enterprise installs)

Status: implementation approved and core work committed on `canvas-mcp` on October 17, 2026. Source-backed guides, shared components, typed facts/state, probe tooling and CI checks are implemented. Production release validation and remaining evidence/content gaps are tracked in section 10.
App: `apps/canvas-mcp` (instructure.ai/canvas-mcp). Historical parent plan: `.agents/plans/canvas-mcp-docs-app.md` at git `f0af496` (subsequently removed; not restored). Its "Phase 2" means the later Maple region route; this plan is "Admin Phase 2". The current source and this revision supersede its old multi-page layout and implementation status.

## 1. Planning baseline (`f0af496`; implementation progress in section 10)

Current baseline (`f0af496`, including `dc2c5a3`), two tabs on one page, state in the query string and localStorage:

- **Configure a Server** (`pageMode === "admin"`, `src/app.ts` `adminDetails`): walks through Canvas Developer Keys for one selected client. Key Settings table, Scopes table plus the manifest, Save steps (private key secret warning, State toggle, copy the Client ID), a beta note for Test Cluster Only.
- **Connect a Client** (`userDetails`): renders only the client name. Blank by design; content comes from the Google Doc.
- **Client data** (`src/clients.ts`): `ClientDefinition` has `keyTypes`, `redirectUris: string[]`, `redirectUriKnown?`, `oauthMetadataVerified?`. Curated: Claude.ai/Desktop, Claude Code, Codex, Copilot Studio, Gemini Enterprise, Antigravity, Generic. **ChatGPT (chatgpt.com and ChatGPT Desktop) and Superhuman Go are missing and are added together in this phase** (see 4.G). Everything else is generated from the pinned rulesync target list (`src/rulesyncTargets.ts`, rulesync 36.0.2) with placeholder text ("Confirm the OAuth callback URI with this client") and both key types allowed.
- **State** (`src/state.ts`): `domain`, `client`, `key`, `region`, `clientId`. The Connect tab is disabled until domain, region, client and Client ID are set.

Gaps this plan closes:

| #   | Gap                                                                                                                                                                                                                                                                                                                                                             | Where                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | Rulesync has no callback URIs or OAuth facts, so about 55 clients show placeholder text.                                                                                                                                                                                                                                                                        | `clients.ts`                 |
| 2   | Three kinds of "unknown" callback are flattened into strings: Codex's computed path, Copilot Studio's generated URL, and genuinely unverified.                                                                                                                                                                                                                  | `clients.ts`, `adminDetails` |
| 3   | Key type support is hand-set, unverified for most clients, and inconsistent with the Google Doc: Claude.ai and Claude Code are `["public"]` in the current app, but the Doc says a private key also works for both. Some clients support both public and private keys; when both are supported, public is the preferred default and private remains selectable. | `clients.ts`                 |
| 4   | Configure covers only Canvas. Most admins use an enterprise LLM subscription and configure the connector in a vendor admin console.                                                                                                                                                                                                                             | `adminDetails`               |
| 5   | Connect has no personal vs enterprise split.                                                                                                                                                                                                                                                                                                                    | `userDetails`                |

Two existing items to fix alongside, because they affect the admin page:

- `SCOPE_MANIFEST` (`src/scopes.ts`) currently includes `https://sso.canvaslms.com/mcp-limited` and GET, POST, PUT, PATCH and DELETE scopes, including `url:POST|/api/v1/oauth2/introspect`. The decided list (parent plan, decisions 14 and 17) follows Maple documentation and excludes `mcp-limited`. The 107-line constant has no Maple revision, generation date or review record. The readme still describes an incomplete baseline and an in-app warning, but the actual UI says "complete per-tool scope list" and enables copying it without that warning. Reconcile this discrepancy first: remove the excluded scope, label the remaining list unreviewed, and gate production readiness on a maintainer-supplied, reviewed manifest. Local implementation can proceed while that external input is pending.
- The readme says "Rulesync 36.0.2, pinned at commit 67c5ff3". Keep that pin and bump it only on purpose.

### Phase 1 audit and carry-forward work (October 17, 2026)

| Area                | Observed status                                                                                                                                                                                              | Phase 2 consequence                                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell and state     | Implemented: domain validation, seven manual regions, production/beta URL derivation, tabs, public Client ID in shared links, optional localStorage. Client ID is deliberately **not** saved in preferences. | Preserve existing URL and storage behavior while adding `install`.                                                                                                                                                                                   |
| Routing/build       | `src/main.ts` mounts the SPA; `vite.config.mts` produces `dist/canvas-mcp/index.html`. `admin/` is empty; no admin HTML entry is built.                                                                      | Canonical links use `/canvas-mcp/?page=admin` or `page=connect`. Do not reintroduce multi-page routing from the parent plan.                                                                                                                         |
| Client catalog      | Seven hand-defined entries including Generic; 59 pinned Rulesync targets, three overlaid by curated entries, leaving 56 other Rulesync entries (63 selectable clients total).                                | Add ChatGPT and Superhuman Go together as an explicit implementation step. Preserve accepted IDs such as `codexcli`/`claudecode`/`antigravity-ide` when resolving them to curated facts. Never reuse IDE evidence for a CLI/plugin without evidence. |
| Admin content       | Key/settings/scope/save sections exist, including beta instructions and private-secret handling.                                                                                                             | Extend shared renderers; replace obsolete assertions deliberately rather than retaining duplicate metadata to keep tests green.                                                                                                                      |
| Connect content     | Only a client heading; server details exist alongside it. `setupNote` and `verify` are not rendered as a guide.                                                                                              | Treat personal guides, generic fields, troubleshooting and FAQ as new implementation work.                                                                                                                                                           |
| Rulesync generation | Pinned target data exists; no config generation spike results or snippet renderer exist.                                                                                                                     | Snippets require a recorded compatibility matrix; generic guidance is the fallback.                                                                                                                                                                  |
| Print/embed         | Print button and basic print CSS exist; scope list is height-limited. No embed detection, copy-embed control, resize messaging or print permalink/date exists.                                               | Finish print for this phase. Full embed support is explicitly deferred, so do not claim it is complete.                                                                                                                                              |
| Verification        | App tests: **4 files / 31 tests passed**. App typecheck and production build passed during this review.                                                                                                      | This is a code/build baseline, not confirmation of OAuth behavior, accessibility, or scope completeness.                                                                                                                                             |

This review used repository sources, tests and the historical parent plan. The Google Doc body, Maple source and separate internal instructions were not available in the working tree and were not independently revalidated. Existing external OAuth claims below are research leads or inherited guidance until their source/version is captured. No product code was changed during this planning review.

## 2. Goals

1. Every client in the list has source-backed or probed OAuth facts with evidence, or is clearly labeled unverified.
2. Callback URIs are auto-populated where they can be known or computed, and linked to vendor documentation where they cannot.
3. Key type guidance (public, private, both) comes from the same verified facts.
4. Admins can flag an enterprise install and get per-provider admin-console instructions (curated clients only).
5. Connect a Client shows personal or enterprise instructions based on that flag, with a segmented control.

Out of scope: the Maple region route (parent plan Phase 2), clients outside the curated list getting enterprise guides, full iframe/embed support, and multi-client developer keys. The browser app continues to make no Canvas/Maple discovery requests; metadata checks belong in maintainer research or the dev-only harness.

## 3. Findings that shape the design

### 3.1 Codex's callback ID may be computable after mode verification

Codex source (`openai/codex`, `codex-rs/rmcp-client/src/oauth_callback.rs`, `callback_id_from_server_url`): the callback ID is `base64url(SHA-256(<MCP URL, URL-normalized, fragment removed>)[0..9])`, no padding. Nine bytes encode to 12 characters, which matches the Google Doc's "fixed 12-character ID". Codex appends it to the configured callback URL when the authorization server does not advertise `authorization_response_iss_parameter_supported` (otherwise it reuses the shared URL, "issuer bound" mode). With the Google Doc's `mcp_oauth_callback_url = "http://localhost:8081/callback"`, the registered URI is `http://localhost:8081/callback/<id>`.

Subject to validating that source against a pinned Codex revision and confirming Canvas uses the per-server callback mode, the page can compute it in the browser (`crypto.subtle.digest("SHA-256", ...)`, first 9 bytes, base64url) from the MCP URL it already builds from domain and region. This removes the "ask Instructure for the ID" step. Needs one known-good pair from a real Codex run to pin a unit test, and a check that Canvas does not advertise issuer-bound mode (the test key and a Codex run answer both).

### 3.2 Copilot Studio's redirect URI does not exist until connector setup

The Google Doc: Copilot Studio generates the redirect URL when the connector is saved, and it needs a private key, so the key exists first. The admin page must support "create the key, then come back and add the redirect URI to it" and the Connect page must say so. Canvas accepts a developer key with no Redirect URIs (confirmed by the maintainer in this session, October 17, 2026; Instructure guidance, not a probe performed during this review). The resolved sequence is: create the private key with Redirect URIs blank; use its Client ID and secret to configure and save the Copilot Studio connector; copy the generated redirect URI; edit the Canvas key to add that URI; then complete OAuth and verify the connection. No placeholder URI is needed.

### 3.3 What a probe can learn

An OAuth client reveals its facts when it talks to an authorization server it believes is real. A stub MCP resource server plus stub authorization server (our own, throwaway) sees, per client:

- Dynamic client registration body, if used: `redirect_uris`, `token_endpoint_auth_method`, `grant_types`.
- Authorization request: `redirect_uri`, `code_challenge` and `code_challenge_method` (PKCE), `scope`, `resource`, `response_type`, `state`.
- Token request: how the client authenticates (none, `client_secret_post`, `client_secret_basic`), whether the verifier matches, whether `resource` is present, and the refresh request shape. Store normalized observations, not raw credentials or request bodies.
- Whether it accepts a pre-supplied Client ID (and secret) at all, versus dynamic registration only. Canvas has no dynamic client registration, so a registration-only client cannot connect. This is a fact the current data model has no field for.

That establishes observed behavior for the exercised mode. Run separate static public, static confidential, and optional DCR scenarios: one successful public run does not establish confidential support, and an attempted DCR request does not prove a client cannot accept static credentials. Record observed PKCE use separately from whether it is required. A local probe is not an end-to-end Canvas compatibility check.

## 4. Workstreams

### Maintenance structure and guide composition

Refactor the monolithic `src/app.ts` before adding the phase's new guide branches. Keep the existing vanilla TypeScript/Pantoken stack and preserve the current display during extraction. Recommended structure (paths relative to `apps/canvas-mcp/`):

```text
src/
  main.ts                        # existing entry point
  app.ts                         # small mount/controller; state, events, persistence
  page.ts                        # page shell, heading, top-level tabs, composition
  admin/
    config.ts                    # domain, region, client, key and install controls
    server-details.ts            # derived URLs, public Client ID, copy controls
    key-settings.ts              # shared Canvas key/settings/scopes/save blocks
    key-settings-model.ts        # resolve typed facts + state into display values
  clients/
    types.ts                     # ClientDefinition, facts, evidence, guide contracts
    ids.ts                       # dependency-free curated IDs and aliases
    index.ts                     # explicit registry, Rulesync overlay and lookup
    rulesync.ts                  # pinned-target adapter with unknown defaults
    curated/
      claude-ai.ts
      claude-code.ts
      codex.ts
      copilot-studio.ts
      gemini-enterprise.ts
      antigravity.ts
      chatgpt.ts
      superhuman-go.ts
      generic.ts
  guides/
    render.ts                    # shared guide/step renderer
    types.ts                     # guide flow and structured content contracts
    shared.ts                    # common prerequisites, troubleshooting and FAQ
  ui/
    copy.ts                      # copy control/helper and status announcement
    theme.ts                     # existing theme and logo behavior
    html.ts                      # escaping and safe structured content helpers
  state.ts                       # validated query/preferences and URL derivation
  scopes.ts                      # scope manifest and provenance
  rulesyncTargets.ts             # retain current pinned source data
  main.css                       # shared Pantoken styling; split only as useful
```

**Ownership and injection.** Each curated module exports its identity, OAuth facts/evidence, supported install modes, key-setting notes and guide definitions together. Use a shared typed contract, rather than vendor-specific conditionals in `page.ts` or `admin/key-settings.ts`. Derive Canvas settings from the selected module plus validated state through a pure resolver. For example, `resolveKeySettings(client, state, redirectResolution)` supplies the existing renderer with key name, redirect presentation, key type, Authorized Flows, beta flag, audience and shared scopes. Common Canvas defaults stay in the resolver; client modules declare only facts, notes and supported variations. Scope/audience rules must not be duplicated across client files. Unknown/computed/generated redirect states remain typed, not flattened into strings.

Components receive a resolved view model and return markup using shared escaping helpers. The controller owns browser history, storage, asynchronous callbacks, event dispatch and focus restoration. Client data modules never read the DOM or localStorage. Keep the dependency direction types/IDs → client data/state → resolvers → renderers → controller; avoid runtime cycles. An explicit registry makes additions reviewable and keeps existing URL aliases working. Do not add a component framework, runtime schema interpreter or client-specific rendering plugins for this refactor.

**Two guide presentations, one set of reusable blocks.** Model the actual order of work in each guide instead of assuming every client is Canvas-first and provider-second:

```ts
type GuideStep =
	| { id: string; kind: "canvas-key"; action: "create" | "update-redirect" }
	| { id: string; kind: "provider"; content: StructuredContent[] }
	| { id: string; kind: "verify"; content: StructuredContent[] };

type GuideFlow =
	| { presentation: "by-surface"; steps: GuideStep[] }
	| { presentation: "interleaved"; steps: GuideStep[] };
```

`StructuredContent` is a small typed collection of paragraphs, lists, safe links and code blocks using the existing approved tokens. It is content, not executable client-supplied rendering logic. The `canvas-key` references invoke shared `admin/key-settings` blocks with the same resolved values as today's admin view; the create action preserves the current Key Settings → Scopes → Save display. The update action renders only the relevant redirect edit instructions. Validate unique step IDs, valid block references and supported tokens. Add block variants only when a real guide requires them.

- **Ordinary clients (`by-surface`)**: group the guide into **Canvas** and **Provider** sections, using a Pantoken segmented control for the two views, or secondary tabs when the panels need tab semantics. Use one accessible pattern consistently for this pair; do not require three modes before secondary tabs are allowed. The same shared key-settings blocks render in the Canvas section; provider-specific content comes from the selected client module. Print both sections in order so the guide is complete on paper.
- **Copilot Studio (`interleaved`)**: show one continuous numbered guide: Canvas — create private key with Redirect URIs blank → Copilot Studio — configure/save connector → Canvas — add generated redirect URI → Copilot Studio — complete OAuth and verify. No Canvas/Provider switch is required to follow it. Reuse the same Canvas create/update blocks rather than maintaining a separate copy of the key-settings instructions in Copilot prose.
- **Guide availability and credentials**: reading the steps must not require a Client ID. An interleaved guide is available from Configure before the key exists; Connect can resume the same guide once its existing prerequisites are met. Gate generated connection actions and OAuth readiness at the relevant step, not access to the walkthrough. The app never captures a secret or treats displayed steps as proof the external work is completed.
- **Navigation dimensions**: Personal/Enterprise remains `state.install`; Canvas/Provider is a separate guide view, not another install mode. Preserve `page=admin|connect` and current links during extraction. If guide-view selection is shareable, validate an optional `surface=canvas|provider` query parameter (default Canvas), preserve it through URL rewrites/copy links, reset it for an interleaved flow and avoid adding it to saved preferences. Do not stack unnecessary controls: omit either selector when the selected guide has only one supported option. Presentation is selected per client/install guide, so a later verified workflow can differ by mode.

**Migration acceptance.** First extract the existing page/config/server-details/key-settings renderers with equivalent markup and behavior, keeping `mountApp` as the stable entry. Then move client definitions into typed modules and introduce guide composition. Existing rendering, shared-link and state tests remain the integration baseline. Add focused resolver/flow tests for substantive behavior: same Canvas values in every guide context, public default when both key types work, and Copilot's blank-create → provider-save → redirect-update → OAuth order. Update intentional navigation/content assertions when the new guide presentation lands. Do not copy the whole app into separate components with their own state or make maintainers edit a central vendor switch for every new client.

### A. OAuth facts model and data

Replace the booleans in `ClientDefinition` with typed facts owned by each client module under `src/clients/curated/<name>.ts`, using the shared contract in `src/clients/types.ts`. Use TypeScript exports checked with `satisfies ClientDefinition`; no separate JSON Schema or second central facts catalog is needed for this repository. A shared selector/resolver exposes facts to renderers and research tooling.

```ts
type Evidence = {
	method: "probe" | "source" | "vendor-doc" | "instructure" | "instructure-internal";
	url?: string; // public vendor/source link; omit for non-referenceable sources
	label: string; // public display label; no internal document titles
	sourceRevision?: string; // immutable source commit or document revision
	version?: string; // client version or doc revision checked
	verifiedAt: string; // ISO date of the actual check, not the date the entry was created
};

type RedirectUri =
	| { kind: "fixed"; uris: string[]; evidence: Evidence }
	| { kind: "computed"; recipe: "codex-callback-id"; base: string; evidence: Evidence }
	| { kind: "client-generated"; where: string; evidence: Evidence } // Copilot Studio
	| { kind: "configurable"; defaultUri: string; note: string; evidence: Evidence } // port or path set by the user
	| { kind: "unverified"; docsUrl?: string };

type Fact<T> =
	| { value: T; status: "verified" | "documented"; evidence: Evidence[] }
	| { value: "unknown"; status: "unverified"; evidence?: Evidence[] };

type ClientFacts = {
	redirectUri: RedirectUri;
	remoteHttp: Fact<"yes" | "no">;
	keyTypes: { public: Fact<"yes" | "no">; private: Fact<"yes" | "no"> };
	pkce: Fact<"required" | "optional" | "off">;
	sendsResource: Fact<"yes" | "no">;
	staticClientId: Fact<"yes" | "no">; // accepts preconfigured credentials
	registration: Fact<"static" | "dcr-only" | "both">;
};
```

Each assertion has its own evidence; the redirect kind carries its evidence or is explicitly unverified. One probed callback must not make all facts appear verified. Derive a conservative client summary from those facts, displaying individual unknowns; the summary is never an independent switch that can overstate certainty. Rulesync MCP support alone does not establish remote HTTP OAuth compatibility.

Rules the UI derives from it:

- A fact with `status: "documented"` shows the source in plain words ("From the Canvas MCP setup guide, Sept 11, 2026"), not a warning. `status: "unverified"` shows an "Unverified" badge with the evidence link and date, or "No source yet" when there is none. Facts the Doc states for Claude.ai, Copilot Studio and Gemini Enterprise are `documented`.
- `keyTypes`: allow `yes` and `unknown`, explicitly warn for an unknown selection, and disable/exclude `no`. When both types are supported (`yes`), prefer public by default and keep private selectable. Preserve an explicit valid private selection from the URL, saved preferences or user input. Otherwise prefer a supported `yes` type over an unknown type. If both are `no`, show an unsupported notice and no usable key choice. Unknown must never be presented as confirmed support.
- Evidence of `registration.value: "dcr-only"` or `staticClientId.value: "no"` blocks the supported setup flow and hides the Client ID field. Explain the evidenced limitation; use the dynamic-registration explanation only when DCR-only behavior was established. Unknown support shows a warning rather than a false incompatibility claim. `remoteHttp.value: "no"` also blocks the flow.
- Once the stated Google Doc sections are available and checked, correct Claude.ai and Claude Code to `public: yes, private: yes`, with `evidence.method: "instructure"`. Until then retain their inherited guidance without upgrading its evidence status.

Migration: facts become the single source of truth. Temporary derived adapters may keep renderers working within a staged change; update semantic tests in that change and remove adapters when the renderers migrate. Avoid a runtime import cycle: `state.ts` currently supplies types and IDs to `clients.ts`; keep shared IDs/types in the dependency-free client modules described above or use a pure normalization layer above both modules. Replace the positional `CLIENTS[1]` fallback with an explicit default ID so inserting/sorting clients cannot change fallback behavior.

### B. Fact-finding program

Triage by effort and certainty:

| Tier | Clients                                                                                                                           | Method                                                                                                                                                                                                                                                                              | Result                                                                                |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1a   | Curated, local or personal: Claude Code, Codex, Antigravity                                                                       | Probe with the stub (localhost), plus the vendor doc link                                                                                                                                                                                                                           | `status: "verified"`, `evidence.method: "probe"`                                      |
| 1b   | Curated, enterprise-hosted: Claude.ai/Desktop (Team and Enterprise), Copilot Studio, Gemini Enterprise                            | **Not probed for now.** The enterprise setup instructions and the facts (redirect URIs, key types) are already in the Instructure setup Google Doc (sections 2, 3a, 5, 6). Port them from the Doc; no separate vendor research is needed. Vendor docs are linked as `sources` only. | `status: "documented"`, `evidence.method: "instructure"`                              |
| 1c   | New curated clients: ChatGPT and Superhuman Go                                                                                    | Facts from supplied instructions or checked vendor documentation; probes are deferred until their connection surfaces and test requirements are established.                                                                                                                        | `status` per fact: `documented` if stated by the instructions, otherwise `unverified` |
| 2    | Open-source rulesync targets (for example Codex CLI, OpenCode, Goose, Cline, Roo/Zoo Code, Kilo, Continue, Zed, Qwen Code, Crush) | Read the source: search for redirect URI construction, `code_challenge`, `client_secret` handling                                                                                                                                                                                   | `evidence.method: "source"`, with the file link and version                           |
| 3    | Closed-source or unknown                                                                                                          | Vendor doc link only; otherwise `unverified`                                                                                                                                                                                                                                        | Page links to the doc and says what is unconfirmed                                    |

Source reading works well: the Codex finding in 3.1 took one file. Start with the clients that use the same MCP SDKs (TypeScript SDK and `rmcp`), since the redirect URI is usually a client-side setting there, then handle the rest.

**Probe harness** (dev-only script, lives in `apps/canvas-mcp/scripts/probe/`, not shipped):

- A small Node server bound explicitly to loopback, with protected-resource discovery (including the path-specific `/mcp` location), authorization-server metadata, `/authorize`, `/token`, optional `/register`, and a minimal valid Streamable HTTP `/mcp` initialization exchange. Use short-lived fake codes/tokens; validate configured redirect URIs, PKCE verifier/challenge matching and refresh requests. Preserve synthetic `state` in the redirect; do not persist raw state, Authorization headers, secrets, tokens or verifiers. Record auth method and parameter presence instead. Never accept arbitrary callback hosts or paths.
- Static client ID `probe-client`; optionally a DCR endpoint that logs the registration body and returns a client ID.
- Output: one sanitized JSON fixture per client/version/scenario in `scripts/probe/results/`. Keep raw captures ignored and ephemeral. A script may propose fact changes for manual review; it must not silently rewrite or commit curated facts. Automated harness tests cover discovery, initialize, PKCE, refresh, error paths and sanitization without launching vendor clients.
- Scope for now: local clients only (Claude Code, Codex, Antigravity, CLI targets), so the stub runs on localhost and needs no public tunnel. Cloud and enterprise clients (Claude.ai, Copilot Studio, Gemini Enterprise) are deferred; they would need a public HTTPS URL for the stub and enterprise tenants.
- Test data only. No Canvas tenant, real Client ID or secret is used. Review the harness with Security before using a public tunnel with vendor-hosted clients.
- Enterprise probing is a later option. Checked source-backed facts stay `documented` until probed; individual absent facts remain `unknown`/`unverified` (see tier 1b and open question 1).

**Refresh**: evidence records its check date and available version/revision. Add a non-blocking evidence report when a curated client's evidence is older than 180 days (with a fixed clock in tests); reserve failing tests for malformed dates or missing required evidence. Add a GitHub issue template "Report a client's OAuth requirements" so admins can send corrections.

### C. Redirect URI states in the UI

Replace the single "Redirect URIs" row logic in `adminDetails` with a renderer per `RedirectUri.kind`:

| Kind                                | Configure tab shows                                                                                                                                                                                                                                                                      | Connect tab shows                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fixed`                             | Copyable block, as now.                                                                                                                                                                                                                                                                  | Not needed.                                                                                                                                        |
| `computed` (Codex)                  | The URI computed from domain, region and the MCP URL, with a note: "Derived from your MCP Server URL. If the URL changes, update the key." Disabled until domain and region are set.                                                                                                     | A line confirming the same URI.                                                                                                                    |
| `client-generated` (Copilot Studio) | "Leave Redirect URIs blank when creating the key. Add the generated URI after saving the connector." Link back to the key's edit page on production Canvas (`https://<production-canvas-domain>/accounts/self/developer_keys`, including for beta setup). Does not block the Save steps. | Configure and save the connector using the private key, copy its generated redirect URI, add it to the Canvas key, then complete OAuth and verify. |
| `configurable`                      | Default URI plus the note (for example a port the user can change).                                                                                                                                                                                                                      | The matching config line.                                                                                                                          |
| `unverified`                        | "Not yet verified for this client." Link to `docsUrl` if known, and the "Report a client" link. Keep the existing key-type warning.                                                                                                                                                      | Same notice.                                                                                                                                       |

Add a `sha256-base64url` helper only after pinning the upstream algorithm, with a unit test using the pair from the real Codex run (3.1). Include production/beta, region changes, URL serialization, fragment removal and trailing-slash/query distinctions. Model shared versus per-server callback mode explicitly; when Canvas mode is unconfirmed, show guidance and no copyable computed URI. Do not fetch metadata from the browser.

`crypto.subtle.digest` is asynchronous while `render()` replaces `innerHTML` synchronously. Resolve the callback through a cache keyed by normalized MCP URL and callback configuration; render pending/error states and disable copy until ready. Ignore stale results after a domain, region, client or mode change. Test rejection and out-of-order resolution. Changing a URL must never briefly copy the previous tenant's callback.

### D. Enterprise install flag (Configure a Server)

- New state field `install: "personal" | "enterprise"`, query param `install`, saved with preferences, default `personal`. Added to `readState`, `stateQuery`, `savePreferences`, `pageQuery`, and the page-mode URL rewrite in `persist()`.
- New control in the Configuration card, next to Private key: a toggle labeled "Enterprise install (configured in an admin console)". Shown only for curated clients that define an enterprise guide. For enterprise-only clients (Copilot Studio, Gemini Enterprise) it is checked and disabled with a short reason. Hidden for non-curated clients.
- Per-client data: `installModes: ("personal" | "enterprise")[]` and optional `enterpriseSurface: { product: string; adminConsoleName: string }`. Keep supported modes distinct from guide availability: an enterprise-only client remains enterprise-only even when its guide is pending; show a content-pending notice rather than inventing personal support.
- Normalize key type, install mode and connection readiness together on initial load, client change and before persistence. Invalid or missing `install` falls back URL → valid saved preference → supported default; older `canvas-mcp:v1` objects remain readable. Unsupported combinations are corrected in the URL as well as in the UI. Continue excluding Client ID from localStorage.
- Replace duplicated readiness checks (`isConnectionReady`, `adminDetails`, server card and both Connect buttons) with one result including a reason. Unsupported/DCR-only clients remain blocked even with a numeric ID. Unknown facts remain visibly provisional. Keep region optional for creating a noncomputed key, and required for an actual MCP URL/Connect flow. A missing Client ID can still leave generated-redirect prerequisites visible in Configure so Copilot setup is not circular.
- When `install === "enterprise"`:
  - The Save section gains a "Next: configure the connector in <admin console>" block with a button that switches to the Connect tab (preserving `install`).
  - Enterprise-specific key notes appear in the Key Settings (for example Copilot Studio and Gemini Enterprise: Private key required; Claude Team and Enterprise: public or private, only the Owner enters the secret).
- Per curated client, with the source for each:

| Client              | Enterprise surface (from the Google Doc unless noted)                                                                                                                                                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude.ai / Desktop | **From the Doc (section 3a).** Team and Enterprise: an organization Owner adds a custom connector under Organization settings > Connectors; members then connect from their own settings.                                                                                                           |
| Copilot Studio      | **From the Doc (section 5).** Enterprise by nature: agent Tools > Add a tool > New tool > Model Context Protocol; OAuth 2.0 manual discovery; redirect URL generated on save; the Accept header policy workaround (Doc marks it temporary, so keep it behind a "verify this is still needed" note). |
| Gemini Enterprise   | **From the Doc (section 6).** Enterprise by nature: Google Cloud console > Gemini Enterprise > Data stores > Custom MCP Server; needs Discovery Engine Editor; enable tools under Actions; Doc says leave PKCE unchecked.                                                                           |
| Codex               | **Not in the Doc** (section 4 covers the CLI and IDE extension only). Instructions exist separately and are **not referenceable** (see below).                                                                                                                                                      |
| Claude Code         | **Not in the Doc** (section 3b covers the CLI only). Instructions exist separately, not referenceable.                                                                                                                                                                                              |
| Antigravity         | **Not in the Doc.** Instructions exist separately, not referenceable.                                                                                                                                                                                                                               |
| ChatGPT             | New curated client, see 4.G. Personal and enterprise instructions to be supplied.                                                                                                                                                                                                                   |
| Superhuman Go       | New curated client added alongside ChatGPT, see 4.G. Supported install modes and any enterprise surface require source-backed confirmation.                                                                                                                                                         |

**Non-referenceable sources.** The enterprise instructions for Codex, Claude Code, Antigravity and ChatGPT exist but cannot be cited or linked. Rules for them:

- The maintainer supplies the text (pasted into the session or a file outside the repo); we port it as our own content, in the same `Guide` shape as the Doc-sourced ones.
- Evidence is `method: "instructure-internal"` with no `url`. The page shows "Instructure setup guidance" and a date, never a link or a document title.
- Nothing from those sources that reads like an internal reference is copied: no internal URLs, ticket IDs, names or Slack links. Product or Legal confirms the content is cleared for a public page before release.
- Until the text arrives, the enterprise toggle for that client stays hidden. Do not infer steps.

### G. Add ChatGPT and Superhuman Go to the curated list in this phase

Both client entries are in scope together, including their facts, supported install modes and source-backed guides. Neither is deferred to a later phase. Missing evidence follows the same explicit unverified/pending behavior for both.

#### ChatGPT (chatgpt.com and ChatGPT Desktop)

ChatGPT is not a rulesync target, so it is a hand-defined curated client, like Claude.ai.

- `state.ts`: add `"chatgpt"` to `CLIENTS`. `clients.ts`: new `ClientDefinition` with id `chatgpt`, name "ChatGPT (chatgpt.com and ChatGPT Desktop)", group Curated. The Desktop app and the website share the same connector configuration, so one entry covers both.
- Both install modes are expected: personal (an individual account adding a custom connector) and enterprise (a workspace admin adding a connector for the organization). Exact surface names and steps come from the supplied instructions, not from this plan.
- Facts to establish before the entry is more than a stub (none are known to me yet, and I am not asserting any):
  - Redirect URI. The Maple onboarding doc gives `https://chatgpt.com/connectors/<name>/callback` only as an illustration of per-customer partner URIs. Treat it as unconfirmed.
  - Public key, private key, or both; PKCE; whether it sends `resource`; whether it lets the user type a Client ID and secret or only registers dynamically (Canvas has no dynamic registration).
  - Whether OpenAI-generated keys are subject to the hyperscaler limited-access rule. Maple's onboarding doc uses OpenAI as its example of a partner whose keys would get `https://sso.canvaslms.com/mcp-limited` automatically. Confirm whether a customer-created ChatGPT key should carry it. The decided default (parent plan, decision 17) is to exclude it.
- Until verified: `status: "unverified"` with the badge, key types both, redirect URI `unverified`, and a blocking note if it turns out to be registration-only.
- Tests: client selector includes it, `?client=chatgpt` round trips, both install modes appear once guides exist.

#### Superhuman Go

- Add `"superhuman-go"` to the accepted client IDs and a hand-defined Curated entry named "Superhuman Go". It is absent from the current pinned Rulesync list; no Rulesync pin change is needed.
- Establish its custom MCP connection surface, remote HTTP/OAuth support, redirect URI behavior, public/private key support, PKCE, `resource`, static Client ID/secret support and registration requirements from supplied instructions or checked vendor documentation.
- Establish supported personal/enterprise install modes and any admin-console surface before publishing those steps. Do not assume ChatGPT's modes, fields or callbacks apply to Superhuman Go.
- Add source-backed guides in the same guide workstream as ChatGPT. Until evidence is available, include the client with explicit unverified facts and pending guidance. Unknown key types may remain selectable with the existing warning; once both are confirmed supported, prefer public by default and preserve explicit valid private selections.
- Tests: selector includes Superhuman Go, `?client=superhuman-go` round trips, facts disclose unknowns, and mode normalization/guide visibility follow its evidenced support.

### E. Connect a Client tab (personal vs enterprise)

- Where both install modes are supported, show a Personal/Enterprise segmented control using the existing Pantoken `instui-button-set -toggle` pattern with accessible pressed states and keyboard behavior. Hide it for a single supported mode. Canvas/Provider navigation is a separate guide-presentation choice described above; an interleaved client such as Copilot Studio uses a continuous guide.
- Source of truth for the selection is `state.install`, shared with the Configure tab and the URL. Changing the control updates `install` and re-renders.
- Content model (from the earlier parent plan, now concrete):

```ts
type Guide = {
	prerequisites: string[];
	flow: GuideFlow; // shared Canvas blocks + structured provider/verify steps; approved tokens
	verify: string;
	troubleshooting: { symptom: string; cause: string; fix: string }[];
	sources: Evidence[]; // public links or approved internal guidance with label/date and no URL
	lastVerified: string;
};
type ClientGuides = { personal?: Guide; enterprise?: Guide };
```

- Content comes from the Google Doc (the Sept 11, 2026 version), ported once after its body is available and checked, per client. Its date alone does not count as a fresh verification date. Mapping:

| Doc section                                             | Guide                                                                               |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 3a Claude.ai and Claude Desktop                         | Claude.ai: personal (Pro and Max steps) and enterprise (Team and Enterprise steps)  |
| 3b Claude Code                                          | Claude Code: personal (the `claude mcp add-json` flow, with `/mcp` verify)          |
| 4 OpenAI Codex                                          | Codex: personal (`config.toml` settings, `codex mcp add`, `codex mcp login`)        |
| 5 Copilot Studio                                        | Copilot Studio: enterprise only                                                     |
| 6 Gemini Enterprise                                     | Gemini Enterprise: enterprise only                                                  |
| 7 Other MCP clients                                     | Generic: field table                                                                |
| (supplied separately)                                   | Codex, Claude Code, Antigravity and ChatGPT enterprise and ChatGPT personal guides  |
| (supplied instructions or checked vendor documentation) | Superhuman Go guides for its confirmed install modes, implemented alongside ChatGPT |
| 9 and 10                                                | Shared troubleshooting and FAQ, linked from every guide                             |

- Rulesync-sourced clients: no bespoke guides in this phase. They show the Generic field table and their OAuth facts (verified or not). To include snippets, first run the missing parent-plan Phase 0 spike for representative pinned targets and record which HTTP/OAuth fields survive generation. If this is not done, omit snippets and keep field-table guidance; do not install Rulesync as an app runtime dependency.
- Render guide prose as escaped text with explicit structured paragraphs/links/code, not interpolated raw HTML or an implicit Markdown engine. Validate known tokens, required derived values and `https:` evidence URLs. Never expose `{clientSecret}` as a value/parameter/input; instructions direct users to the vendor's secret field. Unresolved computed/client-generated callbacks use explanatory steps, never copyable placeholder strings.
- Print the **active top-level tab and selected install mode**, with the client/mode heading, permalink and generated date. Within that guide, expand both Canvas/Provider sections or the entire interleaved sequence so no necessary steps are omitted. Hide controls, expand overflow-limited scope/code blocks, and verify long guides and tables on Letter and A4. Do not print alternate install modes. Full embed work is deferred; document that limitation.

### F. Tests and release gate

- Unit: `clientFacts` invariants (all catalog IDs resolve to facts or an explicit unverified fallback; supported assertions have per-fact evidence; no `fixed` URI is empty; unsupported/unknown cases cannot be promoted by summary status; approved internal evidence may omit a public URL), the Codex callback ID vector, state round trips for `install` and any implemented `surface` parameter, shared key-settings resolver consistency, guide block references and Copilot interleaved ordering, key type normalization from facts (including public as the default when both types are supported and preservation of explicit valid private selections), enterprise-only clients force `install=enterprise`.
- UI (jsdom, extend `tests/app.test.ts`): redirect URI row per kind, asynchronous callback races/errors, blocked compatibility and readiness across both buttons, guide escaping/token validation, old storage and invalid query values, Copilot blank-redirect creation and add-generated-URI-before-OAuth instructions, enterprise toggle visibility rules, segmented control switching, URL and localStorage persistence, Connect tab content per mode, print styles hide the control.
- Accessibility: keyboard and screen reader pass on the segmented control and new states; focus returns to the active control after a full render, status changes are announced without announcing the entire guide. Check existing top-level tab keyboard behavior as well. Run `automatica11y` on applicable tab/mode combinations, light/dark and narrow layouts after implementation; jsdom assertions alone do not establish accessibility.
- Readme: document `install`, the facts model, the probe harness and how to refresh evidence. Update `tests/readme.test.ts` if it asserts sections.
- Release gate: scope manifest regenerated and reviewed (section 1), every `documented` fact names its source and check date, unknown facts are disclosed, every published curated guide has `lastVerified` and evidence. Pending guides must remain explicitly pending and cannot count as verified end-to-end support.
- Scope artifact: record the reviewed Maple commit, generation/check date and review status with the list (a typed module or generated data artifact). Validate line format, deduplication, the two required baseline scopes and exclusion of `mcp-limited`; replace the brittle 107-line test with semantic assertions and the reviewed fixture. UI and readme must agree about completeness. No invented per-tool additions without Maple evidence.
- Verification commands from repo root: `pnpm --filter @instructure.ai/canvas-mcp test`, `pnpm --filter @instructure.ai/canvas-mcp typecheck`, `pnpm --filter @instructure.ai/canvas-mcp build`; run repository-required formatting/lint on the changed files. Check the built `/canvas-mcp/` base path, favicon, query permalinks and production/beta derived URLs. No new admin-route smoke target is implied.
- Publishing constraint: `.github/workflows/deploy-apps.yml` deploys on pushes to `main` or manual dispatch and does not enforce the app test suite. Keep unreviewed work on `canvas-mcp`; before release, add an enforceable app test/readiness gate to the deployment path (or keep incomplete content clearly gated from production). A prose release blocker alone does not stop deployment.

## 5. Sequence

Work directly on the existing `canvas-mcp` branch after approval. Use reviewable commits; a new branch or PR is not required for each step. Preserve the pre-existing plan-file moves/deletions in the working tree.

1. **Baseline corrections and content inventory**: reconcile the scope/readme/UI discrepancy and define manifest provenance/readiness. Inventory source availability and catalog aliases. Extract page/config/server-details/key-settings into the maintenance structure above while preserving current rendering and behavior. Capture missing Doc/internal inputs as content dependencies; do not block unrelated model work on them.
2. **Facts, compatibility and state**: A plus `install` plumbing from D; move curated clients into their typed modules and introduce per-fact evidence, explicit unknown/no states, pure normalization and unified readiness. Add the ChatGPT and Superhuman Go catalog/query entries from G together with honest unverified facts. Apply Claude key corrections only once checked guidance is available. Migrate semantic tests alongside the model.
3. **Redirect rendering and Codex research**: C, initially with pending/unverified fallbacks. Pin the Codex source revision, confirm Canvas callback mode and capture a synthetic known-good vector before enabling its computed copy button. Implement asynchronous resolution and race/error handling. For Copilot, implement the confirmed blank-redirect key creation → connector save → generated URI added to key → OAuth/verification sequence; no placeholder URI is needed.
4. **Local probe and evidence batches**: B, first the harness tests and sanitized fixtures, then available tier 1a clients. Tier 1b facts are `documented` only after the Google Doc is checked; absent claims remain unknown. Record versions and tested modes. Research tier 2 clients in bounded batches of five to ten, but do not make completion of all 56 non-overlaid Rulesync entries a prerequisite for the core UI; explicit unverified fallbacks satisfy this phase's goal.
5. **Install controls and guides**: remaining D and E, Generic fields/shared troubleshooting first, then source-backed personal and enterprise guides using shared Canvas blocks. Add per-guide by-surface or interleaved composition, including the continuous Copilot flow. ChatGPT and Superhuman Go guides and facts are implemented together from supplied instructions or checked vendor documentation; do not assume both modes are supported merely because they are expected. Missing content gets an explicit pending state and no fabricated steps. Optional Rulesync snippets follow the compatibility spike.
6. **Hardening and release readiness**: F, print, focus/keyboard behavior, readme, built-path checks and deployment enforcement. Complete independent work while external gates are pending, then report exactly which content/compatibility checks prevent production release.

Implementation of steps 1–6 on `canvas-mcp` was approved on October 17, 2026. Approval does not assert that inherited OAuth facts are verified or that publication gates are satisfied. The implemented work and evidence-dependent items are tracked in section 10.

### External inputs and acceptance criteria

| Input                                                                                                                                                     | Needed for                                                   | Safe progress while pending                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Sept 11 setup guide body and allowed public citation                                                                                                      | Documented facts, Claude key correction, core curated guides | Typed model, unverified facts and Generic rendering                         |
| Publishable separate instructions for Codex/Claude Code/Antigravity/ChatGPT, plus supplied instructions or checked vendor documentation for Superhuman Go | Those guide modes and any new OAuth facts                    | Pending guide notice; no invented enterprise steps                          |
| Pinned Codex source plus real callback/mode check                                                                                                         | Copyable computed Codex callback                             | Redirect renderer with computed output disabled                             |
| Reviewed Maple manifest with commit/date                                                                                                                  | Production-ready scope block and release                     | Mark current list unreviewed, exclude `mcp-limited`, enforce release gate   |
| Available local clients/test tenants                                                                                                                      | Probe and end-to-end claims                                  | Harness fixtures and source/documented evidence without claiming a real run |

## 6. Data handling and review

The harness uses synthetic inputs and records normalized OAuth observations. Raw requests may contain sensitive values even during testing and must not be persisted. The static app handles the identifiers described below; it does not handle student records. Tenant subdomains and developer-key Client IDs are customer identifiers, not credentials, and Client Secrets are never requested or stored (unchanged). The probe runs against throwaway stubs with fake IDs. Security should review the harness before it is used through a public tunnel with vendor-hosted clients, and Product or Security still signs off on the scope manifest. Vendor documentation is linked and summarized in our own words, not copied.

## 7. Open questions

1. **Enterprise probing (deferred).** Decision: not now. The enterprise instructions and facts come from checked sections of the Instructure setup Google Doc, summarized in our own words and recorded as documented evidence, using a public citation only when available and approved. Revisit probing when enterprise test tenants are available; a public HTTPS probe would be separate follow-up work, not assumed to be supported by the initial localhost harness.
2. **Supplied instructions.** Send the enterprise (and, for ChatGPT, personal) instructions for Codex, Claude Code, Antigravity and ChatGPT, plus anything you can say about whether they may be published publicly. They are the source for those guides and the redirect URI and key type facts.
3. **New-client facts.** For ChatGPT and Superhuman Go: connection surface, redirect URI, key types, PKCE, remote HTTP support, static credentials, registration requirements and supported install modes. Separately confirm whether the partner limited-access rule affects customer-created ChatGPT keys; keep `mcp-limited` excluded by default.
4. **Copilot Studio ordering — resolved October 17, 2026.** Maintainer confirms Canvas accepts a key with no Redirect URIs. Create the key with that field blank, save the connector, add its generated URI to the key, then complete OAuth. This is no longer an external blocker.
5. **Codex callback mode.** Does Canvas's authorization server metadata advertise `authorization_response_iss_parameter_supported`? If it does, Codex reuses the shared callback and the computed path is wrong. One real run answers this.
6. **One key or many.** The page configures one key per client. Admins using Claude Enterprise and Codex together would create two keys. A "combine clients on one key" option (up to 64 URIs) is possible later; do we want it?
7. **Control wording and param name.** `install=enterprise` and the labels "Personal" and "Enterprise" are proposals. Change if the team prefers other words.
8. **Manifest owner.** Who with Maple access supplies and reviews the generated full list with its source commit/date, without `mcp-limited`, and when? Existing write/delete/introspection entries are not evidence of completeness.
9. **Facts distribution.** Typed exports under `clients/curated/` are the proposed source of truth, assembled by the registry. Publishing a separate JSON facts feed is deferred unless a consumer requires it; do not maintain duplicate sources.

## 8. Risks

- Vendor UIs and OAuth behavior change. Evidence carries a source/version and check date; a non-blocking report flags stale entries.
- A probe shows what a client does today with our stub, which can differ from its behavior against Canvas (for example when a client special-cases known domains). Treat probe results as strong evidence, and keep one end-to-end run against a beta key per curated client.
- The Codex ID depends on exact URL normalization. Match the Rust `url` crate behavior with a test vector, and recheck when Codex releases change the derivation.
- Enterprise guides will date quickly. Each has `lastVerified` and a visible date on the page.
- Enterprise guides rest on the Google Doc (Sept 11, 2026) without a hands-on check by us. The Copilot Studio Accept-header workaround is marked temporary in the Doc and may already be obsolete; the guide says so and links to Microsoft's current docs.

## 9. Revision summary for approval (October 17, 2026)

- Grounded the baseline in current source and a successful 31-test/typecheck/build run; clarified canonical SPA links, catalog counts and missing Phase 1 content/embed work.
- Corrected scope status: write/delete/introspection are present, `mcp-limited` is still included, provenance is absent, and UI/readme completeness claims disagree.
- Strengthened the facts sketch with per-fact evidence, remote-HTTP compatibility, honest unknown states, catalog aliases and deterministic normalization/readiness.
- Made Codex callback mode/source confirmation and asynchronous race handling explicit prerequisites; resolved Copilot ordering using the maintainer-confirmed empty-redirect behavior.
- Added ChatGPT and Superhuman Go together to the implementation sequence, source-availability gates, sanitized multi-scenario probes and a prerequisite for optional Rulesync snippets.
- Resolved contradictory documented/unverified statuses, stale-evidence warning behavior, internal guide sources and active-mode printing; added deployment enforcement and acceptance criteria.

- Follow-up decisions: prefer public by default when a client supports both key types; include Superhuman Go in the same phase and catalog/guide workstreams as ChatGPT.
- Follow-up confirmation (October 17, 2026): Canvas accepts keys with no Redirect URIs; Copilot Studio bootstrap ordering is resolved and removed from the external-input gates.
- Maintenance recommendation: extract shared page/admin components and colocate each curated client's typed facts/settings/guide exports; compose ordinary guides with Canvas/Provider views and Copilot Studio as a continuous interleaved walkthrough using the same Canvas blocks.

## 10. Implementation progress (October 17, 2026)

Core implementation was completed in incremental conventional commits beginning at `c0e7de4`, on top of `253a298`. Product release remains subject to the checks below.

| Workstream     | Implemented                                                                                                                                                                                                                                                                                            | Remaining                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components     | Shared `page`, `admin/config`, `admin/server-details`, `admin/key-settings`, pure key-settings resolver and UI helpers; curated client modules with shared contracts.                                                                                                                                  | Further decomposition only when a concrete maintenance need appears.                                                                                                                                                                                                                                                                          |
| Facts/state    | Per-fact evidence and unknown values, explicit aliases, public preferred when both types work, explicit private selections preserved, enterprise normalization, validated `install`/`surface`, shared readiness, blocked-client notices.                                                               | More source/probe evidence for unverified clients.                                                                                                                                                                                                                                                                                            |
| Guides         | Source-backed Claude personal/Code, Codex, Copilot, Gemini Enterprise, Antigravity CLI and Generic content. Shared Canvas/Provider sections and one continuous Copilot flow. Corrected October instructions incorporated; Bash/Zsh and PowerShell commands provided for Claude Code.                   | Claude organization instructions are explicitly unavailable in the updated source, so that mode is pending. Superhuman Go is included with unknown facts/pending guidance, as the maintainer has no guide. Antigravity IDE remains separate from CLI. Gemini CLI guidance stays provisional because its key-type and secret details conflict. |
| ChatGPT        | Included in the selector and query state. Updated guidance's Canvas MCP authentication bug is shown as an explicit connection blocker, without inventing a DCR limitation.                                                                                                                             | Upstream bug fix and confirmed setup instructions.                                                                                                                                                                                                                                                                                            |
| Redirects      | Typed fixed/computed/generated/configurable/unknown rendering, confirmed blank-URI Copilot bootstrap, pinned Codex derivation helper, asynchronous cache and stale-result/error handling.                                                                                                              | A real Canvas/Codex mode check and known-good callback URI are still needed before changing Codex's mode from unknown; computed copying remains disabled. Independent test vectors are not represented as real runs.                                                                                                                          |
| Scope manifest | Regenerated 121 lines using the supplied clean Maple checkout at `6368cd5b58b7a3f9d4c004c46f8779712cdb0d14`. Generator and provenance committed; `mcp-limited` excluded.                                                                                                                               | Product/Security release review; copying remains disabled while unreviewed.                                                                                                                                                                                                                                                                   |
| Probe/evidence | Loopback-only synthetic public/private/DCR server; discovery, PKCE, single-use expiring codes, refresh and MCP initialization; sanitized observations, fixture instructions, evidence-age report and correction issue template. Pure request tests and a real local HTTP discovery smoke check passed. | No vendor-client probe runs or beta-tenant end-to-end runs are recorded. Tier 2 clients retain explicit unverified fallbacks until research batches occur. Optional Rulesync snippets remain omitted pending the configuration spike.                                                                                                         |
| Hardening      | Keyboard tab navigation, focus restoration, live Client ID/configuration updates, safe guide interpolation/links, copy controls, print surface expansion and pagination fixes, app tests required before Pages deployment.                                                                             | Real screen-reader and Letter/A4 print checks; full embed support remains deferred.                                                                                                                                                                                                                                                           |

Evidence inputs were the supplied setup DOCX, corrected October Markdown guides, local Maple source and the pinned upstream Codex callback file. Private source files/paths and internal links were not added to the public app. The newer Microsoft authorization-URL typo was corrected against Maple and the original setup guide; source editor UI debris was omitted.

Verification: **11 test files / 66 tests pass**, app typecheck (including scripts) passes, production build passes, and Pages workflow YAML parses with the app test step. Lint reports no errors but retains warnings. Browser inspection confirmed the selected install/surface and no horizontal overflow at the inspected desktop size. The evidence report has two advisory entries: Antigravity IDE and Superhuman Go lack evidence.

Accessibility tooling: `npx --yes --prefer-online automatica11y@latest guide skill` returned its guide. The subsequent required version check failed with `ENOTFOUND registry.npmjs.org`; no audit, report, results or fixtures were generated. Browser AX/keyboard checks do not replace that audit or real assistive-technology testing.
