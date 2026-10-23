# Rulesync v40.2.0 review

Reviewed October 23, 2026 against [v38.0.0…v40.2.0](https://github.com/dyoshikawa/rulesync/compare/v38.0.0...v40.2.0), including [v39.0.0](https://github.com/dyoshikawa/rulesync/releases/tag/v39.0.0), [v40.0.0](https://github.com/dyoshikawa/rulesync/releases/tag/v40.0.0), [v40.1.0](https://github.com/dyoshikawa/rulesync/releases/tag/v40.1.0), and [v40.2.0](https://github.com/dyoshikawa/rulesync/releases/tag/v40.2.0).

This app consumes a researched target snapshot, not the Rulesync CLI package. The snapshot is pinned to `4094b14918f6d4bb418447df41c7fa638f31939a` in `src/rulesyncTargets.ts`; there is no runtime package or lockfile upgrade. `claudecode-legacy` remains represented by the curated Claude Code entry.

## Target membership

Comparing the upstream MCP processor tuples gives 61 → 63 entries, including the separately listed `claudecode-legacy` alias. The app omits that duplicate alias, so its manifest grows from 60 to 62 targets and the Other client list grows from 56 to 58. The only additions are **Firebender** and **Xum**; there are no removals or renames.

| Target | Upstream support | App treatment |
| --- | --- | --- |
| Firebender | Added as a Rulesync MCP target in v39. Firebender documents remote HTTP/SSE transports, OAuth sign-in, and URL/header configuration. | Added as an Untested personal client. Remote HTTP is documented. Its docs do not specify static Canvas Client ID/secret fields or an exact callback URI; public/private key compatibility and enterprise-managed MCP provisioning remain unverified. |
| Xum | Added as a Rulesync MCP target in v39. User-configured MCP entries launch local stdio processes; remote Agent Plugin servers separately support OAuth sign-in with client, scopes, and authorization-server metadata. | Added as an Untested personal client. Remote plugin OAuth is documented, but static Canvas Client ID/secret support, public/private key compatibility, and an exact callback URI are not specified. Centrally managed enterprise provisioning remains unverified. |

Sources: [Firebender MCP overview](https://docs.firebender.com/context/mcp/overview), [Firebender configuration](https://docs.firebender.com/api-reference/syntax), [Firebender RevenueCat OAuth flow](https://docs.firebender.com/context/mcp/revenuecat), [Xum MCP server configuration](https://xum.cdr.dev/config/mcp-servers), [Agent Plugins specification](https://agent-plugins.org/specification), and the pinned [Rulesync MCP target tuple](https://github.com/dyoshikawa/rulesync/blob/4094b14918f6d4bb418447df41c7fa638f31939a/src/types/tool-target-tuples.ts).

## MCP changes reviewed

| Release | Upstream change | Result here |
| --- | --- | --- |
| v39 | Adds Firebender and Xum MCP targets. | Added both manifest entries and dated client research above. |
| v40 | Kimi Code adds `default_deferred`; ZCode adds the per-server `alwaysLoad` flag; DeepAgents maps an OAuth field to a Dcode Slack-specific `client_id`. | No Canvas credential or callback evidence changes. The Dcode-specific mapping is not treated as general Canvas OAuth support. |
| v40.1 | Expands the Rulesync **MCP server** to expose CLI operations and enforce CLI/MCP API parity. | Not a client-target change: this app does not embed or operate the Rulesync MCP server. |
| v40.2 | Adds opt-in OpenCode V2 `mcp.servers` output; V1 remains the default. The OpenCode/Kilo/MiMo plugin hook payload also changes. | No generated client configuration exists here. No change to OpenCode's researched Canvas credential facts or callback; plugin hook behavior is outside this setup guide. |

Other v38–v40 changes to hooks, skills, commands, permissions, nested agents, npm token handling, and symlink safety do not establish new Canvas MCP client capabilities and are not reflected as OAuth facts.

## Deprecated and lifecycle targets

The v40.2.0 target-lifecycle notes confirm the compatibility targets already recorded in client research; none is newly removed from the MCP tuple. They remain visible with their existing labels/statuses:

| Client | Current lifecycle note | App treatment |
| --- | --- | --- |
| Continue | End of life; Rulesync retains a frozen compatibility target. | Known issue; blocked for new connections. |
| Roo Code | End of life; Zoo Code is the community continuation and uses a distinct target. | Known issue; blocked. Zoo Code remains separate. |
| Kiro | `kiro` remains a deprecated alias after the CLI/IDE targets split. | Label the alias and direct new setups to Kiro CLI or Kiro IDE; not itself a connection blocker. |
| Tabnine CLI | Legacy CLI remains in maintenance; the new Tabnine CLI uses OpenCode configuration. | Keep **Tabnine CLI (Legacy)** and its existing lifecycle notice; use OpenCode for the replacement. |
| Rovo Dev | Standalone retirement and unified CLI transition remain pending final dates/instructions. | Retain the pending-migration notice without blocking connection. |

Lifecycle evidence is pinned to the [v40.2.0 Rulesync target notes](https://github.com/dyoshikawa/rulesync/blob/4094b14918f6d4bb418447df41c7fa638f31939a/README.md#target-and-deprecation-notes). Rulesync support or a retained legacy target does not establish an active vendor product, Canvas OAuth compatibility, or successful Canvas validation.
