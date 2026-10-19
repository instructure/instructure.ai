# Plan: Canvas MCP Help tab

## Goal

Add **Help** immediately after **Connect a Client** in the main tab list:

`Configure a Server | Connect a Client | Help`

Help contains the existing Pantoken segmented-control component with:

- **FAQs** (default)
- **Common Issues**
- **Supported Clients**

This is an implementation plan only; no application behavior changes are included.

## 1. Navigation and state

- Extend `PageMode` in `apps/canvas-mcp/src/page.ts` to include Help, and update the explicit page parsing, click handling, and query serialization in `src/app.ts`.
- Use `page=help` and `help=faqs|issues|clients`. Missing or invalid Help section values select FAQs.
- Keep Help view state separate from setup state and the existing Canvas/provider `surface` control. Do not add Help preferences to localStorage.
- Help is always available, even with no domain, region, Client ID, or callback URI, or when the selected client has a known issue.
- Preserve setup selections and incomplete domain input when entering and leaving Help. Do not change `surface` just to visit Help; apply existing setup-page behavior when returning.
- Keep Connect gated by connection readiness on every other page, including Help. Currently its disabled state is conditional on the admin page; audit that condition when adding a third page.
- Update copy-link and print permalinks to include the active Help section. Keep existing admin/connect URLs compatible.
- Give Help an appropriate heading and panel association, without rendering setup instructions or selected-client alerts above the Help content.

## 2. Help presentation

- Add a focused `src/help/render.ts` renderer, composed by `src/page.ts`, with typed editorial content in `src/help/content.ts`.
- Reuse the `instui-segmented-control` fieldset/radio structure already used in `src/guides/render.ts`. Use a separate radio name and Help-specific data attributes.
- Render only the selected section on screen. Preserve focus on the selected radio after rerendering; keep the existing main-tab manual activation pattern and keyboard navigation.
- Use existing cards, alerts, badges, tables, spacing, and inline-content escaping. Do not add dependencies, raw editorial HTML, or a second component system.
- Keep the shared settings tray and footer available, but make Help print context describe Help rather than the currently selected setup guide.

### FAQs

Start with short, source-backed answers to:

- What is Canvas MCP, and what does this setup guide do?
- What is the difference between personal and enterprise setup?
- What is the difference between public and private Canvas keys? Explain that public/private is the OAuth client type, not content visibility.
- Which Canvas domain and region should I use?
- Where do Client IDs, secrets, and callback URIs belong?
- Does the app contact Canvas or store credentials?
- What do Verified, Untested, and Known issue mean?

Link to relevant setup views or public documentation where helpful. Links must preserve applicable setup context without embedding secrets. Do not imply that unreviewed scope provisioning is approved for production.

### Common Issues

Organize entries by symptom, with a cause or uncertainty statement, actionable next steps, and affected clients/configurations where known:

- Connect is disabled because required setup values are missing or invalid.
- OAuth callback mismatch or an unconfirmed computed callback.
- Wrong domain, region, or environment.
- Enterprise policy or permissions preventing connection.
- Key-type/PKCE incompatibility.
- Current client-specific authentication blockers.

Read client-specific blockers from shared client data rather than copying their reasons into editorial content. Keep broad troubleshooting advice distinct from confirmed defects. Preserve current blocker scope: for example, Gemini CLI's personal-only issue must not become an enterprise issue.

Avoid claiming an OAuth root cause that has not been established. Do not expose private research links, internal source paths, raw OAuth diagnostics, tokens, or secrets.

## 3. Supported Clients matrix

Use a semantic table with two-level column headers:

| Client | Enterprise: Public | Enterprise: Private | Personal: Public | Personal: Private |
| --- | --- | --- | --- | --- |
| Each curated client | Status | Status | Status | Status |

- Group Enterprise and Personal above their Public/Private subcolumns using explicit header associations.
- Derive rows from the existing registry's `group === "Curated"` entries, using `clientLabel` and existing order. Include Generic MCP because it is currently curated; exclude Rulesync-only entries and avoid alias duplicates.
- Show a short legend and a clear disclaimer: this is recorded Canvas MCP compatibility, not blanket vendor certification.
- Each applicable cell displays **Verified**, **Untested**, or **Known issue**, with text and an existing status icon/color rather than color alone.
- Show verification date, tested client version when recorded, and a concise note or public evidence link in accessible cell details. Known issues include their reason.
- Keep the table readable on narrow screens with a labeled horizontal-scroll region; avoid hiding any of the four combinations.

### Evidence and status model

The existing `ClientStatus` is scoped only by install mode. It cannot establish which key type was tested, and fact-level `verified` can mean a source/probe observation rather than an end-to-end Canvas connection.

- Extend the existing compatibility status model with explicit key-type scope and sufficient test provenance. Resolve status through one shared helper used by both the matrix and current client status surfaces.
- **Verified** requires a recorded successful Canvas connection for the exact install/key combination. Vendor documentation, guide availability, and synthetic probes are not sufficient.
- **Untested** means no qualifying end-to-end result exists for that combination. Do not copy a client-wide validation into all four cells.
- **Known issue** applies only to combinations covered by a recorded issue or explicit incompatibility; a matching active issue takes precedence over an older successful result.
- Preserve the existing "Validated" label on setup surfaces unless a separate label change is requested; map the same qualifying result to "Verified" in Help.
- Audit current records before migration. Preserve known-issue behavior and connection blocking. If a validation lacks key-type provenance, show its matrix cells as Untested until the evidence is clarified rather than guessing.
- For explicitly unavailable install modes, display **Not applicable** as a non-status marker with an explanation, not a false Untested result. An empty/unknown mode list is not proof of incompatibility: show Untested with "install flow unverified."
- If a key type is explicitly incompatible, show Known issue with the recorded reason/evidence. Unknown key support remains Untested.
- Keep facts, compatibility results, and issues in existing curated client definitions; do not create a separately maintained matrix dataset.

## 4. Implementation sequence

1. Define combination-aware compatibility resolution and audit/migrate existing records with regression tests for current blockers.
2. Add the typed FAQ/issue content and Help renderer; generate matrix rows from the client registry and shared resolver.
3. Wire the Help tab, section controls, URL handling, focus restoration, sharing, and printing.
4. Add responsive styling, update directly related app documentation, and complete validation.

## 5. Tests and acceptance criteria

- Extend `tests/app.test.ts` for the exact three-tab order, panel labels, manual keyboard activation, disabled-tab skipping, and Help access without setup prerequisites.
- Test Help deep links, invalid section fallback, segment changes, copy-link output, and preservation of setup inputs and install/key/platform/surface selections across navigation.
- Test Connect gating from Help and unchanged admin/connect deep-link behavior.
- Add focused Help rendering tests for FAQs, Common Issues, escaping, safe links, section visibility, focus restoration, and issue explanations.
- Add table/model tests covering every curated row and all four columns, grouped header associations, status precedence, missing key-type evidence, unsupported modes, unknown modes, and incompatible key types.
- Verify that documented facts and synthetic probes never produce Verified cells and that personal-only issues never leak into enterprise cells.
- Extend print tests so the selected Help section and its permalink print correctly, all matrix columns remain available, and existing setup printing is unchanged.
- Manually check keyboard-only operation, visible focus, mobile overflow, light/dark themes, and print layout.

Run focused Vitest files first, followed by package typecheck and production build. Run the package suite if shared status/navigation changes require wider regression coverage. Use the existing package scripts; no new tooling is required.

## 6. Documentation and boundaries

Update `apps/canvas-mcp/readme.md` with Help URLs, section behavior, status definitions, and how maintainers record exact-combination verification and issues.

No new vendor verification is implied by this feature. Missing evidence remains visibly Untested. Live client testing, a full accessibility audit, and resolution of existing OAuth blockers are separate work.
