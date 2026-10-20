# Rulesync v38.0.0 review

Reviewed October 20, 2026 against [v36.0.2…v38.0.0](https://github.com/dyoshikawa/rulesync/compare/v36.0.2...v38.0.0), including [v37.0.0](https://github.com/dyoshikawa/rulesync/releases/tag/v37.0.0), [v37.1.0](https://github.com/dyoshikawa/rulesync/releases/tag/v37.1.0), and [v38.0.0](https://github.com/dyoshikawa/rulesync/releases/tag/v38.0.0).

This app consumes a researched target snapshot, not the Rulesync CLI package. The snapshot is pinned to `335de85dbd42b5df255ff55148a325ce9d95d0e0` in `src/rulesyncTargets.ts`; there is no runtime package or lockfile upgrade.

## Target membership

Comparing the upstream MCP processor tuples gives 60 → 61 targets: **OpenClaw added; no removals or renames**. OpenClaw previously supported other Rulesync features and now supports global MCP configuration. As before, `claudecode-legacy` is represented by the curated Claude Code option. The app therefore contains 60 Rulesync targets, including 56 Other entries and four curated overlays.

Letta Code gains commands, not MCP support, so it remains excluded. Trae gains global permissions without changing MCP membership. Roo remains an upstream target and remains a Known issue here because the product shut down.

## MCP changes and application impact

| Target | Upstream change | Result here |
| --- | --- | --- |
| OpenClaw | Global-only `~/.openclaw/openclaw.json`, `mcp.servers`; HTTP/SSE, OAuth and tool filters. | Added researched personal/operator-managed Gateway modes and vendor documentation link. Per-requester callback is `<gateway.publicOrigin>/oauth/mcp/callback`; shared login uses a separate loopback callback. Neither a placeholder nor an unknown loopback URI is copyable. Static Canvas registration and public/private key support remain unverified. |
| ZCode / plugin | Maps `zcodeOauth` to native `oauth`, including authorization-code client ID/optional secret/redirect path; adds timeout, protocol version, and stdio cwd mapping. Keeps client secrets scoped to ZCode. | Research note updated. Vendor docs confirm browser OAuth but do not specify the credential schema or full callback URI. Upstream runtime-derived mapping alone does not establish Canvas compatibility; existing unknown facts remain. |
| Copilot CLI | Uses `disabledMcpServers` in separate settings instead of emitting per-server `disabled`; malformed disable lists fail closed. | No OAuth/key/callback change. This app does not generate or import these configuration files. |
| Crush | Adds channel configuration mapping and validation. | No change to researched static credentials or callback. |
| Kimi Code | MCP executor now accepts only `local` for the 2.2 schema. | Existing native static-registration limitation remains; no executor configuration is generated here. |
| OpenCode | Imports nested `.opencode/opencode.json(c)` and reports override conflicts while preserving shared configuration. | Existing OAuth/key/callback findings unchanged; no client-file importer here. |

OpenClaw findings use its [v2026.10.4 OAuth reference](https://github.com/openclaw/openclaw/blob/v2026.10.4/docs/cli/mcp/transports.md) and [MCP schema](https://github.com/openclaw/openclaw/blob/v2026.10.4/src/config/zod-schema.mcp-server.ts). Its `clientCert`/`clientKey` fields configure mTLS, not Canvas developer keys. `oauth.clientMetadataUrl` also does not prove static Canvas client registration. ZCode findings distinguish [vendor documentation](https://zcode.z.ai/en/docs/mcp-services) from [Rulesync's runtime-derived converter](https://github.com/dyoshikawa/rulesync/blob/335de85dbd42b5df255ff55148a325ce9d95d0e0/src/features/mcp/zcode-mcp.ts).

## Other breaking changes reviewed

These affect Rulesync users but do not change this application's target capabilities or generated Canvas settings:

- v37: frozen installs restore curated skills matching lock integrity; Copilot CLI disable storage changes; Rulesync's own MCP server switches from FastMCP to the MCP SDK, changing invalid-argument/schema behavior.
- v38: GitLab Duo project skills move from `skills/` to `.agents/skills`; old output requires manual migration. Reasonix trust-sensitive sandbox fields become global-only. Grok CLI hook `if` is skipped and hook arguments are forwarded. Kimi executor restriction is covered above.
- Other additions include Trae global permissions, Letta commands, hook ordering/preservation and sandbox updates, Qoder settings, Devin plugin/hook governance, and Muse skill metadata. This app does not generate those features.

Help continues to display status labels. Configuration research feeds Configure a Server and Key Settings; documentation links appear in the shared client configuration step. No bespoke client guide was added, and no Canvas sign-in was performed for the new target.

## README caveats follow-up

Reviewed the requested main-branch README separately from the v38 target snapshot, pinned to [52ec6c88](https://github.com/dyoshikawa/rulesync/blob/52ec6c88ff7c72313050474f2400565e16822fa4/README.md#target-and-deprecation-notes). Main includes later additions, such as Firebender and Xum; this follow-up does not add them to the v38 snapshot.

| Caveat | Treatment |
| --- | --- |
| Continue is end of life; Rulesync retains frozen compatibility. | Known issue and blocked for new connections, matching Roo. Removed claims of currently supported personal/organization installs. The [first-party final-release README](https://github.com/continuedev/continue/blob/5522c6f44ca0ac3528b37244818fbfa39b5af470/README.md) confirms it is unmaintained and read-only; the live GitHub API's archive flag alone is not the lifecycle evidence. |
| Roo is end of life; Zoo Code continues the project. | Existing Known issue retained. Keep Roo and Zoo as distinct clients; retained configuration compatibility does not establish support or validation. Rulesync warns against enabling both generators against the same files. |
| Tabnine CLI is in maintenance through December 31, 2026. | Label the target **Tabnine CLI (Legacy)** and retain Untested status. Record its `tabnine-legacy` command and that the new Tabnine CLI uses the OpenCode entry. [Vendor notice](https://docs.tabnine.com/main/getting-started/tabnine-cli) still supports critical updates; maintenance alone does not establish an MCP blocker. |
| Kiro is a deprecated alias for diverging CLI/IDE targets. | Label **Kiro (deprecated alias)** and retain Untested status. Notes direct new configurations to the explicit CLI or IDE entry; preserve their different private-key support. The alias's shared MCP configuration is not itself broken. |
| Rovo Dev standalone retirement is announced; dates and CLI migration are pending. | Record the lifecycle warning with [Atlassian's notice](https://www.atlassian.com/licensing/rovo-dev), retaining Untested status and existing capabilities. Atlassian explicitly advises continued CLI use until migration instructions arrive. December 3 pricing changes are not its retirement date. |
| Plugin targets package components inside existing plugin directories and are excluded from wildcard generation. | Clarify the shared packaging note and retain host OAuth facts without granting enterprise distribution or treating packaging as a separate runtime. |
| Antigravity has separate IDE/CLI surfaces and some shared global configuration. | Keep separate curated overlays. Existing IDE guidance already uses `~/.gemini/config/mcp_config.json`; CLI guidance uses project `.agents/mcp_config.json`. Rules/skills/workflow migrations do not establish changes to Canvas OAuth facts. |
| A feature checkmark means at least one supported project/global/simulated mode. | Continue to derive enterprise provisioning, static OAuth credentials, callbacks, and validation from separate evidence. Rulesync support alone establishes none of these. Ignore-feature deprecation concerns Rulesync generation and does not imply client retirement. |

Lifecycle details remain in research records and this review; Supported Clients continues to show status labels only.
