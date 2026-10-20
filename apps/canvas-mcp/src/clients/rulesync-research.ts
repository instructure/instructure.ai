import { RULESYNC_COMMIT, type RulesyncTargetId } from "../rulesyncTargets";
import { unknownFacts, unverified } from "./facts";
import {
	type ClientDefinition,
	type ClientFacts,
	type Evidence,
	type Fact,
	type RedirectUri,
	type LifecycleNotice,
} from "./types";

// Reviewed against vendor documentation/source on this date. These are capability
// findings, not successful Canvas sign-ins. Missing documentation is not a "no".
const checkedAt = "2026-10-20";
function source(label: string, url: string): Evidence {
	const version = url.match(/\/blob\/([^/]+)/u)?.[1];
	return {
		method: url.includes("github.com/") ? "source" : "vendor-doc",
		label,
		url,
		...(version && !["main", "main-v2", "master"].includes(version) ? { version } : {}),
		verifiedAt: checkedAt,
	};
}
function fact<T>(value: T, evidence: Evidence): Fact<T> {
	return { value, status: "documented", evidence: [evidence] };
}
function fixed(evidence: Evidence, ...uris: string[]): RedirectUri {
	return { kind: "fixed", uris, status: "documented", evidence: [evidence] };
}
function configurable(evidence: Evidence, defaultUri: string, note: string): RedirectUri {
	return { kind: "configurable", defaultUri, note, evidence: [evidence] };
}
function runtime(evidence: Evidence, description: string): RedirectUri {
	return { kind: "runtime", description, evidence: [evidence] };
}
type Research = {
	source: Evidence;
	additionalSources?: Evidence[];
	lifecycleNotice?: LifecycleNotice;
	status?: ClientDefinition["status"];
	configurationUrl?: string;
	note: string;
	personal?: boolean;
	enterprise?: Evidence;
	enterpriseSurface?: string;
	remote?: boolean;
	keys?: ("public" | "private")[];
	unsupportedKeys?: ("public" | "private")[];
	staticId?: boolean;
	redirect?: RedirectUri;
	enterpriseRedirect?: RedirectUri;
	registration?: "static" | "dcr-only" | "both";
	blocker?: string;
};

const amp = source(
	"Amp MCP configuration and manual OAuth registration",
	"https://ampcode.com/docs/customize/mcp",
);
const bob = source(
	"IBM Bob MCP OAuth parameters and loopback callbacks",
	"https://bob.ibm.com/docs/ide/configuration/mcp/mcp-oauth",
);
const buddy = source("CodeBuddy Code MCP configuration", "https://www.codebuddy.ai/docs/cli/mcp");
const whale = source(
	"Codewhale MCP configuration and remote authentication",
	"https://github.com/codewhale-hq/Codewhale/blob/main/docs/MCP.md",
);
const command = source("Command Code MCP configuration", "https://commandcode.ai/docs/mcp");
const vscode = source(
	"VS Code MCP static OAuth and redirect URLs",
	"https://code.visualstudio.com/api/extension-guides/ai/mcp",
);
const vscodePolicy = source(
	"VS Code enterprise MCP policy",
	"https://code.visualstudio.com/docs/enterprise/overview",
);
const copilotCli = source(
	"Copilot CLI remote MCP OAuth configuration",
	"https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference",
);
const crush = source(
	"Crush MCP pre-registered OAuth clients",
	"https://github.com/charmbracelet/crush",
);
const goose = source(
	"Goose remote extensions and pre-registered OAuth clients",
	"https://goose-docs.ai/docs/mcp/filesystem-mcp/",
);
const hermes = source(
	"Hermes MCP OAuth client and redirect configuration",
	"https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp",
);
const factory = source(
	"Factory Droid MCP OAuth overrides and managed policy",
	"https://docs.factory.com/harness/mcp",
);
const openCode = source(
	"OpenCode remote MCP and pre-registered OAuth",
	"https://opencode.ai/docs/mcp-servers/",
);
const openClaw = source(
	"OpenClaw MCP transports, operator configuration, and per-requester OAuth (v2026.10.4)",
	"https://github.com/openclaw/openclaw/blob/v2026.10.4/docs/cli/mcp/transports.md",
);
const cursor = source(
	"Cursor static MCP OAuth credentials and callbacks",
	"https://cursor.com/docs/mcp",
);
const cursorPolicy = source(
	"Cursor enterprise MCP controls",
	"https://cursor.com/docs/enterprise/model-and-integration-management",
);
const gitlab = source(
	"GitLab Duo CLI MCP configuration and group controls",
	"https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_clients/",
);
const clineSource = source(
	"Cline OAuth static credentials and callback listener (0870796)",
	"https://github.com/cline/cline/blob/0870796e9e0c640408bb87d9503514a83f57d470/sdk/packages/core/src/extensions/mcp/oauth.ts",
);
const clineExtension = source(
	"Cline extension callback port range (0870796)",
	"https://github.com/cline/cline/blob/0870796e9e0c640408bb87d9503514a83f57d470/apps/vscode/src/services/mcp/McpOAuthManager.ts",
);
const crushSource = source(
	"Crush callback path and fixed-port handling (2ec8c1e)",
	"https://github.com/charmbracelet/crush/blob/2ec8c1ef54d0bb9b38c2410d14fa36828ea56422/internal/oauth/mcp/handler.go",
);
const gooseSource = source(
	"Goose loopback callback implementation (9920efa)",
	"https://github.com/aaif-goose/goose/blob/9920efa16d078777a4d9715b2f00d8800a4da188/crates/goose/src/oauth/mod.rs",
);
const kiloSource = source(
	"Kilo OAuth credentials and callback (5cc65d1)",
	"https://github.com/Kilo-Org/kilocode/blob/5cc65d1212b00609f9bba7bd25780aa5e64f516d/packages/opencode/src/mcp/oauth-provider.ts",
);
const openCodeV2 = source(
	"OpenCode V2 OAuth credentials and pinned callback",
	"https://opencode.ai/v2/docs/mcp-servers",
);
const grok = source(
	"Grok Build MCP credentials and managed configuration (2bdd1d6a)",
	"https://github.com/xai-org/grok-build/blob/2bdd1d6a/crates/codegen/xai-grok-pager/docs/user-guide/26-config-reference.md",
);
const kimi = source(
	"Kimi CLI OAuth construction without static credentials (9ab1286)",
	"https://github.com/MoonshotAI/kimi-cli/blob/9ab1286b8fe4e6bcd116949a27ce5e0ac3389c82/src/kimi_cli/mcp_oauth.py",
);
const zoo = source(
	"Zoo Code MCP configuration",
	"https://docs.zoocode.dev/features/mcp/using-mcp-in-roo",
);
const rovo = source(
	"Rovo Dev CLI remote MCP configuration",
	"https://support.atlassian.com/rovo/docs/connect-to-an-mcp-server-in-rovo-dev-cli/",
);
const takt = source(
	"TAKT runtime MCP configuration",
	"https://github.com/nrslib/takt/blob/main/docs/configuration.md",
);
const tabnine = source(
	"Tabnine CLI MCP commands",
	"https://docs.tabnine.com/main/getting-started/tabnine-cli/features/commands",
);
const continueSunset = source(
	"Continue final release and read-only maintenance notice",
	"https://github.com/continuedev/continue/blob/5522c6f44ca0ac3528b37244818fbfa39b5af470/README.md",
);
const continueShutdownReason =
	"Continue is end of life and no longer actively maintained. Its final release is 2.0.0. Rulesync retains a frozen compatibility target; choose an actively maintained client for a new Canvas connection.";
const tabnineLifecycle = source(
	"Tabnine legacy CLI maintenance period and OpenCode replacement",
	"https://docs.tabnine.com/main/getting-started/tabnine-cli",
);
const rovoLifecycle = source(
	"Atlassian Rovo Dev transition and pending retirement dates",
	"https://www.atlassian.com/licensing/rovo-dev",
);
const targetCaveats = source(
	"Rulesync target lifecycle, alias, and plugin packaging caveats (reviewed main)",
	"https://github.com/dyoshikawa/rulesync/blob/52ec6c88ff7c72313050474f2400565e16822fa4/README.md#target-and-deprecation-notes",
);
const cortex = source(
	"Cortex Code MCP OAuth configuration",
	"https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code-mcp",
);
const vibe = source(
	"Vibe Code CLI MCP transports and OAuth limitation",
	"https://docs.mistral.ai/vibe/code/cli/mcp-servers",
);
const qoder = source(
	"Qoder cloud MCP OAuth API (distinct from IDE configuration)",
	"https://docs.qoder.com/cloud-agents/api/vaults/start-oauth",
);
const qwen = source(
	"Qwen Code MCP OAuth credentials and callbacks",
	"https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/",
);
const muse = source("Muse Code MCP extensions", "https://dev.meta.ai/docs/muse-code/extending");
const reasonix = source(
	"Reasonix remote MCP transports",
	"https://github.com/loserbcc/reasonix/blob/main-v2/docs/GUIDE.md",
);
const kiro = source(
	"Kiro MCP OAuth credentials and redirect configuration",
	"https://kiro.dev/docs/mcp/configuration/",
);
const assistant = source(
	"JetBrains AI Assistant remote MCP and centrally managed servers",
	"https://www.jetbrains.com/help/ai-assistant/mcp.html",
);
const junie = source(
	"Junie MCP remote servers and OAuth",
	"https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html",
);
const augment = source(
	"Augment Code MCP documentation",
	"https://docs.augmentcode.com/setup-augment/mcp",
);
const warp = source(
	"Warp remote MCP, OAuth, and team sharing",
	"https://docs.warp.dev/agents/capabilities/mcp/",
);
const warpCli = source(
	"Warp Agent CLI MCP OAuth uses desktop credentials",
	"https://docs.warp.dev/changelog/2026/",
);
const omp = source(
	"oh-my-pi explicit MCP OAuth configuration",
	"https://github.com/can1357/oh-my-pi/blob/main/docs/mcp-config.md",
);
const zed = source("Zed remote MCP configuration", "https://zed.dev/docs/ai/mcp");
const zedSource = source(
	"Zed ephemeral loopback MCP callback (1d8a29e)",
	"https://github.com/zed-industries/zed/blob/1d8a29e1e2f65b6be6c176f90af801286ac11cc4/crates/context_server/src/oauth.rs",
);
const zcode = source(
	"ZCode remote and plugin MCP configuration",
	"https://zcode.z.ai/en/docs/mcp-services",
);
const pool = source("Pool MCP configuration", "https://docs.poolside.ai/mcp-servers");
const dsh = source(
	"DeepSeek Harness MCP client",
	"https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md",
);
const rulesync = source(
	"Rulesync supported targets (configuration generation only)",
	`https://github.com/dyoshikawa/rulesync/blob/${RULESYNC_COMMIT}/docs/reference/supported-tools.md`,
);

const unknownOAuth =
	"Remote MCP is documented; pre-registered Canvas OAuth credentials, public/private key support, and the exact callback are unverified. Static bearer tokens do not establish Canvas OAuth support.";
const unknownEnterprise =
	" Personal/project configuration is documented; centrally managed enterprise configuration is unverified.";
const rooSunset = source(
	"Roo Code official shutdown notice",
	"https://github.com/RooCodeInc/Roo-Code-Docs/blob/main/docs/sunset.md",
);
const rooShutdownReason =
	"Roo Code shut down on May 15, 2026, including the VS Code extension, Cloud, and Router. The extension repository was archived and the product is no longer supported.";

// Enterprise means an organization-managed configuration/catalog/policy, not just
// a project file in version control or an enterprise subscription to the product.
const research: Partial<Record<RulesyncTargetId, Research>> = {
	amp: {
		source: amp,
		personal: true,
		enterprise: amp,
		enterpriseSurface: "Amp workspace MCP settings",
		remote: true,
		staticId: true,
		keys: ["private"],
		redirect: fixed(amp, "http://localhost:8976/oauth/callback"),
		enterpriseRedirect: runtime(
			amp,
			"Workspace remote MCP definitions use hosted OAuth through ampcode.com. Confirm the exact hosted callback in Amp; the local http://localhost:8976/oauth/callback does not apply to that flow.",
		),
		note: "The callback below applies to local Amp OAuth. Workspace remote definitions use hosted OAuth; their exact callback and public-client support remain unverified.",
	},
	bob: {
		source: bob,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: fixed(
			bob,
			...Array.from({ length: 10 }, (_, i) => `http://127.0.0.1:${33418 + i}/callback`),
		),
		note: "Register the primary loopback callback and fallback ports 33419–33427 if the primary port is occupied. Enterprise user sign-in is distinct from centrally managed MCP configuration, which remains unverified.",
	},
	codebuddy: {
		source: buddy,
		personal: true,
		remote: true,
		note: unknownOAuth + unknownEnterprise,
	},
	codewhale: {
		source: whale,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public"],
		redirect: configurable(
			whale,
			"http://127.0.0.1:1455/callback",
			"Set user-level mcp_oauth_callback_port=1455 and mcp_oauth_callback_url to this exact URI. Project overlays cannot set callback behavior.",
		),
		note:
			"Codewhale accepts oauth.client_id for a pre-registered public client. A static client-secret field and confidential-client support remain unverified." +
			unknownEnterprise,
	},
	commandcode: {
		source: command,
		personal: true,
		remote: true,
		note:
			"MCP browser OAuth is documented, but the current reference does not establish the complete static Canvas credential and callback contract." +
			unknownEnterprise,
	},
	cursor: {
		source: cursor,
		personal: true,
		enterprise: cursorPolicy,
		enterpriseSurface: "Cursor enterprise MCP controls",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: fixed(
			cursor,
			"https://www.cursor.com/agents/mcp/oauth/callback",
			"http://localhost:8787/callback",
		),
		note: "Register the web/Agents callback and desktop callback for the surfaces in use. Static auth accepts CLIENT_ID, optional CLIENT_SECRET, and scopes.",
	},
	copilot: {
		source: vscode,
		personal: true,
		enterprise: vscodePolicy,
		enterpriseSurface: "VS Code enterprise MCP policy",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: fixed(vscode, "http://127.0.0.1:33418", "https://vscode.dev/redirect"),
		note: "This target is GitHub Copilot in VS Code. Static Client ID/secret fallback is documented; the recorded Canvas metadata-discovery failure still applies.",
	},
	copilotcli: {
		source: copilotCli,
		personal: true,
		enterprise: copilotCli,
		enterpriseSurface: "Copilot CLI organization MCP policy",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		note: "Use authorization_code for Canvas. Confidential clients use oauthPublicClient=false and a stored secret. The headless client_credentials grant is a different flow; its lack of callback does not apply to Canvas. Exact browser callback remains unverified.",
	},
	crush: {
		source: crush,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			crushSource,
			"http://localhost:40704/callback",
			"Pin oauth_callback_port=40704 for this URI. Without a pinned port, Crush tries ports 40704–40713; register each callback that may be used.",
		),
		note: "Static OAuth uses oauth_client_id and optional oauth_client_secret." + unknownEnterprise,
	},
	goose: {
		source: goose,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			gooseSource,
			"http://127.0.0.1:8081/oauth_callback",
			"Set GOOSE_OAUTH_CALLBACK_PORT=8081 to use this chosen fixed port. Without the environment override, Goose selects an ephemeral port.",
		),
		note:
			"Public clients omit client_secret_key; confidential clients resolve the secret from the named secret key." +
			unknownEnterprise,
	},
	hermesagent: {
		source: hermes,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			hermes,
			"http://localhost:27890/callback",
			"Set oauth.redirect_host=localhost and oauth.redirect_port=27890 to use this documented pinned callback. Without pinning, the runtime callback can differ.",
		),
		note:
			"Hermes accepts pre-registered client_id/client_secret; per-profile OAuth credentials are separate from shared server definitions." +
			unknownEnterprise,
	},
	grokcli: {
		source: grok,
		personal: true,
		enterprise: grok,
		enterpriseSurface: "Grok managed MCP configuration",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		note: "Grok Build exposes oauth_client_id, oauth_client_secret_env_var, and managed_mcps. The exact MCP OAuth callback remains unverified; model-provider login callbacks are separate.",
	},
	deepagents: {
		source: source(
			"Deep Agents Code MCP OAuth login",
			"https://docs.langchain.com/oss/deepagents/code/mcp-tools",
		),
		personal: true,
		remote: true,
		registration: "dcr-only",
		note:
			"The documented generic-server login uses Dynamic Client Registration with PKCE and a pasted redirect URL. Pre-registered Canvas client credentials and the exact callback are not exposed by the documented configuration. The Slack/GitHub provider-specific flows do not apply to Canvas." +
			unknownEnterprise,
	},
	factorydroid: {
		source: factory,
		personal: true,
		enterprise: factory,
		enterpriseSurface: "Factory org-managed MCP settings",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: runtime(
			factory,
			"Pin oauth.callbackPort for a pre-registered client, then confirm the complete localhost callback URI in Droid. The vendor reference does not specify the callback path.",
		),
		note: "Pre-registered credentials require authorizationServerIssuer. Droid supports none, client_secret_basic, and client_secret_post token authentication.",
	},
	opencode: {
		source: openCode,
		personal: true,
		enterprise: openCode,
		enterpriseSurface: "OpenCode organization remote configuration",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			openCodeV2,
			"http://127.0.0.1:19876/callback",
			"For OpenCode V2, set oauth.redirect_uri to this exact URI and callback_port=19876. V1 uses a different schema; this callback must not be assumed for V1.",
		),
		note: "V2 uses client_id and optional client_secret; V1 uses clientId/clientSecret. Organization defaults can be delivered through .well-known/opencode. The populated callback is for V2.",
	},
	mimocode: {
		source: source(
			"MiMo Code MCP commands",
			"https://github.com/XiaomiMiMo/MiMo-Code/blob/main/packages/web/src/content/docs/cli.mdx",
		),
		personal: true,
		note: "MiMo documents MCP OAuth commands. Do not inherit OpenCode's OAuth or enterprise contract merely because MiMo is derived from OpenCode; static credentials and callbacks remain unverified.",
	},
	gitlabduo: {
		source: gitlab,
		personal: true,
		enterprise: gitlab,
		enterpriseSurface: "GitLab Duo group MCP controls",
		remote: true,
		note:
			unknownOAuth +
			" Group administrators control access to external MCP tools; users still configure servers locally.",
	},
	cline: {
		source: clineSource,
		configurationUrl: "https://docs.cline.bot/mcp/mcp-overview",
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: fixed(
			clineExtension,
			...Array.from({ length: 6 }, (_, i) => `http://127.0.0.1:${1456 + i}/mcp/oauth/callback`),
		),
		note:
			"Cline accepts oauthClient.clientId and optional clientSecret. Its extension tries callback ports 1456–1461; the shared CLI defaults use 1456–1458. Register the fallback URIs for the installed surface." +
			unknownEnterprise,
	},
	kilo: {
		source: kiloSource,
		configurationUrl: "https://kilo.ai/docs/automate/mcp/using-in-kilo-code",
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			kiloSource,
			"http://127.0.0.1:19876/mcp/oauth/callback",
			"This is the current Kilo OAuth provider default. oauth.redirectUri/callbackPort can override it; register the exact configured URI.",
		),
		note:
			"Current Kilo OAuth accepts clientId, optional clientSecret, scope, callbackPort, and redirectUri. Older Roo-based extensions may differ." +
			unknownEnterprise,
	},
	"kimi-code": {
		source: kimi,
		configurationUrl: "https://moonshotai.github.io/kimi-cli/en/customization/mcp",
		personal: true,
		remote: true,
		staticId: false,
		blocker:
			"Kimi CLI's built-in auth=oauth path constructs the OAuth client without a pre-registered client ID or secret. It cannot supply the static Canvas Client ID required by this setup flow.",
		note:
			"The reviewed native OAuth implementation does not forward static client credentials or a pinned callback. Public/private Canvas-key compatibility and exact callback remain unverified." +
			unknownEnterprise,
	},
	roo: {
		source: rooSunset,
		status: { kind: "known-issue", category: "lifecycle", reason: rooShutdownReason },
		lifecycleNotice: {
			title: "Roo Code has been discontinued",
			message:
				rooShutdownReason +
				" Zoo Code is a separate community continuation; select its client entry for new configurations.",
			url: rooSunset.url,
		},
		blocker: rooShutdownReason,
		note: "Roo Code was discontinued on May 15, 2026. Rulesync retains its legacy configuration target; this does not indicate ongoing product support. Zoo Code is a separate client.",
	},
	zoocode: {
		source: zoo,
		personal: true,
		note: "Zoo documents global and project MCP definitions. Native remote HTTP, pre-registered OAuth credentials, enterprise management, and callbacks remain unverified from the reviewed reference.",
	},
	rovodev: {
		source: rovo,
		lifecycleNotice: {
			title: "Rovo Dev CLI migration is pending",
			message:
				"Atlassian has announced Rovo Dev standalone retirement and a transition to the unified Rovo CLI. The final retirement date and migration instructions are pending. Continue using Rovo Dev CLI until Atlassian publishes the migration instructions.",
			url: rovoLifecycle.url,
		},
		additionalSources: [rovoLifecycle, targetCaveats],
		personal: true,
		remote: true,
		note:
			"Rovo Dev standalone retirement is announced, but the final date and unified Rovo CLI migration instructions are pending. Atlassian says to continue using Rovo Dev CLI until migration instructions arrive. This is not a current connection blocker. " +
			unknownOAuth +
			unknownEnterprise,
	},
	takt: {
		source: takt,
		personal: true,
		remote: true,
		note: "TAKT injects stdio/HTTP/SSE server definitions into provider runtimes. OAuth behavior and callback belong to the selected provider; a provider-independent Canvas key contract and enterprise provisioning remain unverified.",
	},
	trae: {
		source: source(
			"TRAE enterprise MCP configuration (cloud surfaces)",
			"https://docs.trae.cn/enterprise_model-context-protocol",
		),
		note: "The reviewed enterprise-console documentation applies to TraeWork cloud desktop/web, not necessarily the Rulesync IDE target. IDE-specific enterprise provisioning, static OAuth credentials, and callbacks remain unverified.",
	},
	tabnine: {
		source: tabnine,
		lifecycleNotice: {
			title: "Tabnine CLI (Legacy) is in maintenance mode",
			message:
				"The legacy CLI receives only critical updates through December 31, 2026. The new Tabnine CLI uses OpenCode configuration; select OpenCode for that replacement. After installing the replacement, the legacy command is tabnine-legacy.",
			url: tabnineLifecycle.url,
		},
		additionalSources: [tabnineLifecycle, targetCaveats],
		configurationUrl: "https://docs.tabnine.com/main/getting-started/tabnine-cli",
		personal: true,
		note: "This target represents Tabnine CLI (Legacy), in maintenance mode with critical updates only through December 31, 2026. Installing Tabnine's OpenCode replacement reassigns tabnine to the new CLI and renames the legacy command tabnine-legacy. Use the OpenCode client entry for the replacement; do not transfer legacy OAuth assumptions to it. Legacy CLI HTTP transport, static credentials, callback, and centrally managed configuration remain unverified.",
	},
	continue: {
		source: continueSunset,
		additionalSources: [targetCaveats],
		configurationUrl: "https://docs.continue.dev/customize/deep-dives/mcp-examples",
		status: { kind: "known-issue", category: "lifecycle", reason: continueShutdownReason },
		lifecycleNotice: {
			title: "Continue has reached end of life",
			message: continueShutdownReason,
			url: continueSunset.url,
		},
		blocker: continueShutdownReason,
		note: "Continue is end of life. Its first-party README describes a final 2.0.0 release and a read-only, unmaintained source tree. Rulesync's retained target is frozen compatibility, not ongoing product support. Historical personal/organization documentation does not establish a currently supported installation mode.",
	},
	cortexcode: {
		source: cortex,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public"],
		redirect: runtime(
			cortex,
			"Cortex Code uses a local callback with redirect_port defaulting to 8585. Confirm the exact host and path in the client; the reference only specifies the port.",
		),
		note: "The documented OAuth schema accepts a pre-registered client_id without a secret. Confidential-client and centrally managed MCP configuration support remain unverified.",
	},
	vibe: {
		source: vibe,
		personal: true,
		remote: true,
		unsupportedKeys: ["public", "private"],
		staticId: false,
		blocker:
			"Vibe Code CLI does not support MCP servers requiring OAuth. Canvas requires OAuth; static API-key or bearer-header configuration does not replace this flow.",
		note: "No OAuth callback applies to the documented CLI implementation. Enterprise-managed CLI MCP configuration remains unverified.",
	},
	qoder: {
		source: qoder,
		note: "Qoder's cloud API accepts static OAuth credentials but uses a service-configured callback. This does not establish the Rulesync IDE target's credentials, callback, or enterprise configuration; these remain unverified.",
	},
	qwencode: {
		source: qwen,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			qwen,
			"http://localhost:7777/oauth/callback",
			"This is the local default. A remote deployment needs an explicitly configured public callback ending in /oauth/callback and a proxy to the local listener; register that exact configured URI instead.",
		),
		note:
			"OAuth accepts clientId, optional clientSecret, authorizationUrl, tokenUrl, redirectUri, and scopes." +
			unknownEnterprise,
	},
	musecode: { source: muse, personal: true, remote: true, note: unknownOAuth + unknownEnterprise },
	reasonix: {
		source: reasonix,
		personal: true,
		remote: true,
		note: "HTTP/SSE and static headers are documented. An OAuth authorization-code flow, static OAuth client credentials, callback, and centrally managed MCP configuration remain unverified.",
	},
	codebuff: {
		source: source("Codebuff source", "https://github.com/CodebuffAI/codebuff"),
		note: "Rulesync configuration output alone does not establish Codebuff/Freebuff static Canvas OAuth support. Enterprise provisioning, public/private credentials, and callbacks remain unverified.",
	},
	kiro: {
		source: kiro,
		lifecycleNotice: {
			title: "Kiro is a deprecated compatibility alias",
			message:
				"Select Kiro CLI or Kiro IDE for new configurations. Their configuration formats differ, and the legacy alias retains its old mixed behavior. This deprecation does not by itself prevent MCP connections.",
			url: targetCaveats.url,
		},
		additionalSources: [targetCaveats],
		personal: true,
		enterprise: kiro,
		enterpriseSurface: "Kiro enterprise MCP registry",
		remote: true,
		staticId: true,
		keys: ["public"],
		redirect: configurable(
			kiro,
			"http://localhost:7778/oauth/callback",
			"Set oauth.redirectUri to this exact full URL; without an override Kiro selects a random localhost port.",
		),
		note: "Rulesync's kiro target is a deprecated compatibility alias. Select Kiro CLI or Kiro IDE for new configurations: their non-MCP formats diverge, while the alias retains its old mixed behavior. Shared MCP support alone is not a connection blocker. Public clients are documented for both; clientSecret is CLI-only.",
	},
	"kiro-cli": {
		source: kiro,
		personal: true,
		enterprise: kiro,
		enterpriseSurface: "Kiro enterprise MCP registry",
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: configurable(
			kiro,
			"http://localhost:7778/oauth/callback",
			"Set oauth.redirectUri to this exact full URL; without an override Kiro selects a random localhost port.",
		),
		note: "The CLI accepts an optional clientSecret for confidential clients. The IDE does not support this field.",
	},
	"kiro-ide": {
		source: kiro,
		personal: true,
		enterprise: kiro,
		enterpriseSurface: "Kiro enterprise MCP registry",
		remote: true,
		staticId: true,
		keys: ["public"],
		unsupportedKeys: ["private"],
		redirect: configurable(
			kiro,
			"http://localhost:7778/oauth/callback",
			"Set oauth.redirectUri to this exact full URL; without an override Kiro selects a random localhost port.",
		),
		note: "Kiro documents clientSecret as CLI-only. Use a public Canvas key for the IDE.",
	},
	aiassistant: {
		source: assistant,
		personal: true,
		enterprise: assistant,
		enterpriseSurface: "JetBrains IDE Services / Central MCP settings",
		remote: true,
		note:
			unknownOAuth +
			" Administrators can preconfigure servers and control user-added servers through IDE Services or Central.",
	},
	junie: { source: junie, personal: true, remote: true, note: unknownOAuth + unknownEnterprise },
	augmentcode: {
		source: augment,
		personal: true,
		remote: true,
		note: "Augment documents manual remote HTTP/SSE servers and curated Easy MCP OAuth integrations. Generic static Canvas OAuth credentials, callbacks, and centrally managed provisioning remain unverified; Code Review and CLI policies must be checked separately.",
	},
	devin: {
		source: source(
			"Devin local MCP configuration",
			"https://docs.devin.ai/cli/extensibility/mcp/configuration",
		),
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		note: "Devin's local runtime accepts oauthClientId and optional oauthClientSecret. The exact callback and Desktop-specific enterprise provisioning remain unverified; cloud connector settings do not establish them.",
	},
	warp: {
		source: warp,
		personal: true,
		enterprise: warp,
		enterpriseSurface: "Warp shared team MCP settings",
		remote: true,
		note:
			unknownOAuth +
			" Teams can share MCP definitions; each member installs the shared configuration and authenticates on their device.",
	},
	warpcli: {
		source: warpCli,
		personal: true,
		remote: true,
		note: "Warp Agent CLI can reuse MCP OAuth authenticated in the desktop app. CLI-specific static client credentials, exact callbacks, and centrally provisioned configuration remain unverified.",
	},
	pi: {
		source: source(
			"Pi extension-based agent harness",
			"https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md",
		),
		note: "Pi is an extensible harness. MCP capabilities depend on the installed extension/package; Rulesync's target does not identify an OAuth implementation. Enterprise configuration, key types, and callbacks remain unverified.",
	},
	omp: {
		source: omp,
		personal: true,
		remote: true,
		staticId: true,
		keys: ["public", "private"],
		redirect: runtime(
			omp,
			"OMP defaults to callback port 3000 and path /callback. Set an explicit loopback oauth.redirectUri (and matching listener options) and register that exact URI; no host is assumed here.",
		),
		note:
			"Explicit OAuth supports clientId, optional clientSecret, redirectUri, callbackPort, and callbackPath." +
			unknownEnterprise,
	},
	zed: {
		source: zed,
		personal: true,
		remote: true,
		redirect: runtime(
			zedSource,
			"Zed starts a loopback callback at http://127.0.0.1:<ephemeral-port>/callback for each OAuth flow. The port is assigned at runtime; this is a URI pattern, not a callback to copy into Canvas.",
		),
		note: "Zed supports remote MCP OAuth. Its May 2026 release notes add client ID/secret pre-registration, but the reviewed configuration reference does not specify the exact credential schema or a fixed callback-port setting. Key types and enterprise provisioning remain unverified.",
	},
	openclaw: {
		source: openClaw,
		configurationUrl: "https://docs.openclaw.ai/tools/mcp",
		personal: true,
		remote: true,
		enterprise: openClaw,
		enterpriseSurface: "Operator-managed Gateway MCP registry with per-requester OAuth accounts",
		redirect: runtime(
			openClaw,
			"Shared OAuth login uses a loopback callback printed by OpenClaw. The reviewed reference does not establish an exact default URI; do not register a guessed callback. Per-requester accounts instead use the Gateway callback.",
		),
		enterpriseRedirect: runtime(
			openClaw,
			"For per-requester OAuth, set gateway.publicOrigin to the externally reachable Gateway HTTPS origin and register <gateway.publicOrigin>/oauth/mcp/callback, substituting the actual origin. Shared operator credentials use the separate CLI loopback callback.",
		),
		note: "Rulesync writes global-only ~/.openclaw/openclaw.json under mcp.servers. OpenClaw supports operator-managed shared credentials and separate per-requester accounts. Its documented OAuth settings include redirectUrl and clientMetadataUrl, but do not establish a static Canvas Client ID/secret configuration. Public/private key compatibility remains unverified; clientCert/clientKey are mTLS settings, not Canvas developer keys.",
	},
	zcode: {
		source: zcode,
		personal: true,
		remote: true,
		note:
			"Rulesync v38 maps zcodeOauth to native oauth, including authorization_code clientId, optional clientSecret, and redirectPath, based on runtime schema research. The vendor documentation confirms OAuth but does not document those credential fields or the complete callback URI. Keep Canvas key types and static registration unverified pending first-party evidence or testing." +
			unknownEnterprise,
	},
	pool: {
		source: pool,
		personal: true,
		remote: true,
		note: "Pool documents HTTP/SSE and OAuth-based sign-in. Pre-registered client credentials, enterprise provisioning, and exact callbacks remain unverified.",
	},
	dsh: {
		source: dsh,
		personal: true,
		note: "The first-party MCP client must be distinguished from third-party OAuth manager plugins. Native static Canvas credentials, callbacks, and enterprise provisioning remain unverified.",
	},
};

// Plugin targets are packaging formats, not independent OAuth clients. Reuse only
// the host's researched facts, never its bespoke instructions or validation status.
const pluginHosts: Partial<Record<RulesyncTargetId, RulesyncTargetId>> = {
	"claudecode-plugin": "claudecode",
	"vibe-plugin": "vibe",
	"antigravity-plugin": "antigravity-cli",
	"augmentcode-plugin": "augmentcode",
	"devin-plugin": "devin",
	"zcode-plugin": "zcode",
};

export function researchedClient(
	target: RulesyncTargetId,
	curated: ClientDefinition[],
): Pick<
	ClientDefinition,
	| "facts"
	| "installModes"
	| "research"
	| "setupNote"
	| "blocker"
	| "enterpriseSurface"
	| "redirectUriOverrides"
	| "configurationUrl"
	| "status"
	| "lifecycleNotices"
> {
	const host = pluginHosts[target];
	if (host) {
		const curatedHost = curated.find((client) => client.rulesyncTarget === host);
		const parent = curatedHost ?? researchedClient(host, curated);
		return {
			facts: structuredClone(parent.facts),
			configurationUrl:
				parent.configurationUrl ??
				Object.values(curatedHost?.guides ?? {})
					.flatMap((guide) => guide?.sources ?? [])
					.find((evidence) => evidence.method === "vendor-doc" && evidence.url)?.url,
			installModes: parent.installModes.includes("personal") ? ["personal"] : [],
			blocker: parent.blocker,
			setupNote:
				"This is a project-only plugin packaging target inside an existing plugin directory, not a separate installed client. Rulesync excludes plugin packaging from wildcard generation. OAuth is handled by the host client's configuration and authentication controls.",
			research: {
				checkedAt,
				installSupport: {
					personal:
						parent.research?.installSupport.personal ??
						(parent.installModes.includes("personal") ? fact("yes", rulesync) : unverified()),
					enterprise: unverified(),
				},
				sources: [
					...(parent.research?.sources ??
						Object.values(parent.facts.keyTypes).flatMap((value) => value.evidence)),
					targetCaveats,
				],
				note: `OAuth facts are inherited from the host client; plugin enterprise distribution is unverified. ${parent.research?.note ?? "Use the host client's documented credential and callback settings."}`,
			},
		};
	}
	const entry = research[target];
	if (!entry) throw new Error(`Missing Rulesync client research: ${target}`);
	const facts: ClientFacts = unknownFacts();
	if (entry.remote !== undefined)
		facts.remoteHttp = fact(entry.remote ? "yes" : "no", entry.source);
	if (entry.staticId !== undefined) {
		facts.staticClientId = fact(entry.staticId ? "yes" : "no", entry.source);
		if (entry.staticId) facts.registration = fact("static", entry.source);
	}
	for (const key of entry.keys ?? []) facts.keyTypes[key] = fact("yes", entry.source);
	for (const key of entry.unsupportedKeys ?? []) facts.keyTypes[key] = fact("no", entry.source);
	if (entry.redirect) facts.redirectUri = entry.redirect;
	if (entry.registration) facts.registration = fact(entry.registration, entry.source);
	const installSupport = {
		personal: entry.personal ? fact("yes" as const, entry.source) : unverified<"yes" | "no">(),
		enterprise: entry.enterprise
			? fact("yes" as const, entry.enterprise)
			: unverified<"yes" | "no">(),
	};
	return {
		facts,
		status: entry.status,
		...(entry.lifecycleNotice
			? { lifecycleNotices: { personal: entry.lifecycleNotice, enterprise: entry.lifecycleNotice } }
			: {}),
		configurationUrl:
			entry.configurationUrl ?? (entry.source === rulesync ? undefined : entry.source.url),
		installModes: (["personal", "enterprise"] as const).filter(
			(mode) => installSupport[mode].value === "yes",
		),
		enterpriseSurface: entry.enterpriseSurface,
		...(entry.enterpriseRedirect
			? { redirectUriOverrides: { enterprise: entry.enterpriseRedirect } }
			: {}),
		setupNote: entry.note,
		research: {
			checkedAt,
			installSupport,
			sources: [
				...new Set([
					entry.source,
					...(entry.additionalSources ?? []),
					...(entry.enterprise ? [entry.enterprise] : []),
					...(entry.redirect && entry.redirect.kind !== "unverified"
						? entry.redirect.evidence
						: []),
					...(entry.enterpriseRedirect && entry.enterpriseRedirect.kind !== "unverified"
						? entry.enterpriseRedirect.evidence
						: []),
				]),
			],
			note: entry.note,
		},
		...(entry.blocker || entry.registration === "dcr-only"
			? {
					blocker: {
						reason:
							entry.blocker ??
							"The documented generic MCP OAuth flow requires Dynamic Client Registration. Canvas does not support dynamic registration; a static Canvas Client ID flow is required.",
						evidence: [entry.source],
					},
				}
			: {}),
	};
}
