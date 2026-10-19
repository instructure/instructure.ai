import { connectionReadiness } from "../setup";
import { type CallbackResolution } from "../oauth/codex-callback";
import { type ClientDefinition } from "../clients/types";
import { type AppState, deriveUrls } from "../state";
import { renderKeyCreation } from "../admin/key-settings";
import { type KeySettingsModel, resolveKeySettings } from "../admin/key-settings-model";
import { escapeHtml } from "../ui/html";
import { type PlatformPreference, commandPlatform } from "../platform";
import { highlightCode } from "./highlight";
import { screenshotSource } from "./screenshots";
import { clientGuide, clientSetup, serverSetupSteps } from "./shared";
import { type CodeSnippet, type Guide, type GuideStep, type StructuredContent } from "./types";

export function guideValues(
	client: ClientDefinition,
	state: AppState,
	model = resolveKeySettings(client, state),
): Record<string, string> {
	const urls = deriveUrls(state);
	return {
		mcpUrl: state.domain && state.region ? urls.mcp : "Select a Canvas domain and region first",
		authUrl: state.domain ? urls.auth : "Enter your Canvas domain first",
		tokenUrl: state.domain ? urls.token : "Enter your Canvas domain first",
		clientId: state.clientId || "Enter the Client ID from your Canvas key",
		scope: urls.scope,
		redirectUri: model.redirect.text,
	};
}
export function interpolate(text: string, values: Record<string, string>): string {
	return text.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/gu, (_, token: string) => {
		if (!Object.hasOwn(values, token)) throw new Error(`Unknown guide token: ${token}`);
		return values[token];
	});
}
export function resolveCodeBlock(template: string, values: Record<string, string>) {
	const text = interpolate(template, values);
	const referenced = [...template.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/gu)].map(
		(match) => match[1],
	);
	return {
		text,
		ready: referenced.every((token) => !/^(Enter |Select |Confirm |Not yet )/u.test(values[token])),
	};
}
function renderCode(block: CodeSnippet, values: Record<string, string>): string {
	const { text: resolved, ready } = resolveCodeBlock(block.text, values);
	const highlighted = [...block.text.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/gu)].reduce(
		(html, [, token]) => {
			if (!Object.hasOwn(values, token)) throw new Error(`Unknown guide token: ${token}`);
			return html.replaceAll(
				`{${token}}`,
				`<span data-guide-token="${token}">${escapeHtml(values[token])}</span>`,
			);
		},
		highlightCode(block.text, block.language),
	);
	return `<div class="shiki-block language-${block.language}"><button class="instui-button -color-tertiary -shape-square -icon-copy -size-sm shiki-copy" type="button" data-copy-template="${escapeHtml(block.text)}" data-copy="${escapeHtml(resolved)}" data-label="Configuration" aria-label="Copy configuration" title="Copy configuration" ${ready ? "" : "disabled"}></button>${highlighted}</div>`;
}

function inlineMarkup(text: string): string {
	return text.replace(
		/`([^`\n]+)`|\*\*((?:`[^`\n]+`|[^*`\n])+)\*\*/gu,
		(_, code: string | undefined, strong: string | undefined) =>
			code !== undefined ? `<code>${code}</code>` : `<strong>${inlineMarkup(strong!)}</strong>`,
	);
}

export function renderContent(
	content: StructuredContent[],
	values: Record<string, string>,
	platform: PlatformPreference = "auto",
): string {
	const text = (value: string) =>
		inlineMarkup(escapeHtml(value)).replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/gu, (_, token: string) => {
			if (!Object.hasOwn(values, token)) throw new Error(`Unknown guide token: ${token}`);
			return `<span data-guide-token="${token}">${escapeHtml(values[token])}</span>`;
		});
	const showPlaceholders =
		import.meta.env.DEV || new URLSearchParams(globalThis.location.search).has("dev");
	return content
		.map((block) => {
			switch (block.kind) {
				case "paragraph":
					return `<p>${text(block.text)}</p>`;
				case "code":
					return renderCode(block, values);
				case "code-group": {
					const selected = commandPlatform(platform);
					return `<div class="shiki-code-group"><div class="instui-button-set -color-secondary -toggle -size-sm code-platform-toggle" role="group" aria-label="Command platform">${(["windows", "mac"] as const).map((choice) => `<button class="instui-button" type="button" data-platform-choice="${choice}" aria-pressed="${selected === choice}" title="${choice === "windows" ? "Windows (PowerShell)" : "macOS / Linux (Bash)"}">${choice === "windows" ? "Windows" : "macOS / Linux"}</button>`).join("")}</div>${(["windows", "mac"] as const).map((choice) => `<div data-code-platform="${choice}" role="region" aria-label="${choice === "windows" ? "Windows PowerShell command" : "macOS / Linux Bash command"}"${selected === choice ? "" : " hidden"}>${block.variants[choice].description ? `<p>${text(block.variants[choice].description)}</p>` : ""}${renderCode(block.variants[choice], values)}</div>`).join("")}</div>`;
				}
				case "list":
					return `<ol class="instui-list -ordered">${block.items.map((item) => `<li>${text(item)}</li>`).join("")}</ol>`;
				case "table":
					return `<table class="instui-table"><thead><tr><th scope="col">Field</th><th scope="col">Value</th></tr></thead><tbody>${block.rows.map(([field, value]) => `<tr><th scope="row">${text(field)}</th><td>${text(value)}</td></tr>`).join("")}</tbody></table>`;
				case "image": {
					if (block.placeholder && !showPlaceholders) return "";
					if (!Number.isInteger(block.width) || block.width <= 0)
						throw new Error("Guide image width must be a positive integer");
					if (!Number.isInteger(block.height) || block.height <= 0)
						throw new Error("Guide image height must be a positive integer");
					const source = screenshotSource(block.name, block.placeholder);
					return `<img class="guide-screenshot instui-img" src="${escapeHtml(source)}" alt="${escapeHtml(block.alt)}" width="${block.width}" height="${block.height}" loading="lazy" decoding="async" data-placeholder="${block.placeholder}" />`;
				}
				case "link": {
					const url = new URL(interpolate(block.url, values));
					if (url.protocol !== "https:") throw new Error("Guide links must use HTTPS");
					return `<p><a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${text(block.label)}</a></p>`;
				}
			}
		})
		.join("");
}
export function validateGuide(guide: Guide): void {
	const ids = new Set<string>();
	for (const step of guide.steps) {
		if (!/^[a-z][a-z0-9-]*$/u.test(step.id) || ids.has(step.id))
			throw new Error("Guide step IDs must be unique slugs");
		ids.add(step.id);
		if (step.kind === "canvas-key" && step.action !== "create" && step.action !== "update-redirect")
			throw new Error("Unknown Canvas guide action");
	}
	if (guide.status === "documented" && (!guide.lastVerified || !guide.sources.length))
		throw new Error("Documented guides require dated evidence");
}
function renderFields(
	client: ClientDefinition,
	state: AppState,
	model: KeySettingsModel,
	editable: boolean,
): string {
	const values = guideValues(client, state, model),
		fields = [
			["MCP server URL", values.mcpUrl],
			["Authorization URL", values.authUrl],
			["Token URL", values.tokenUrl],
			["Client ID", values.clientId],
			["Scope", values.scope],
			[
				"PKCE",
				state.key === "public"
					? "Required (S256) for a Canvas public key"
					: client.facts.pkce.value === "off"
						? "Leave disabled for this client"
						: "Optional for a Canvas private key",
			],
		];
	return `<section class="guide-fields"><h3 class="instui-heading -level-h3">Connection fields</h3><table class="instui-table"><thead><tr><th scope="col">Field</th><th scope="col">Value</th></tr></thead><tbody>${fields.map(([name, value]) => `<tr><th scope="row">${escapeHtml(name)}</th><td><code${name === "Client ID" ? ' data-guide-token="clientId"' : ""}>${escapeHtml(value)}</code></td></tr>`).join("")}</tbody></table>${editable ? "" : state.key === "private" ? "<p>Enter the key secret directly in the provider's secret field. Never paste it into this guide or a setup link.</p>" : "<p>A public key uses the Client ID without a client secret. Public is preferred when the client supports both key types.</p>"}</section>`;
}
function renderStep(
	step: GuideStep,
	client: ClientDefinition,
	state: AppState,
	editable: boolean,
	model: KeySettingsModel,
): string {
	if (step.kind === "canvas-key") {
		if (step.action === "create")
			return `<div data-guide-step="${step.id}" data-surface="canvas">${renderKeyCreation(client, state, editable, model)}</div>`;
		const domain = model.productionDomain;
		return `<section class="guide-section" data-guide-step="${step.id}" data-surface="canvas"><h3 class="instui-heading -level-h3">Canvas — add the generated redirect URI</h3><p>Copy the redirect URI generated by the saved connector. Edit the same Canvas developer key, add that URI to Redirect URIs, and save before completing OAuth.</p>${domain ? `<p><a href="https://${escapeHtml(domain)}/accounts/self/developer_keys" target="_blank" rel="noopener noreferrer">Open Canvas Developer Keys</a></p>` : "<p>Enter your Canvas domain to build the Developer Keys link.</p>"}</section>`;
	}
	const callbackField =
		editable && client.id === "generic" && step.id === "provider-callback"
			? `<label class="field-label" for="redirect-uris-input">Callback URIs</label><textarea id="redirect-uris-input" class="instui-text-area text-input${state.redirectUris ? "" : " -invalid"}" rows="4" spellcheck="false" required aria-invalid="${!state.redirectUris}" aria-describedby="redirect-uris-hint">${escapeHtml(state.redirectUris)}</textarea><p id="redirect-uris-hint" class="field-hint">Copy the exact OAuth callback URI(s) from your MCP client, one per line. Register all of them on the Canvas key before connecting.</p>`
			: "";
	return `<section class="guide-section" data-guide-step="${step.id}" data-surface="provider">${step.title ? `<h3 class="instui-heading -level-h3">${escapeHtml(step.title)}</h3>` : ""}${renderContent(step.content, guideValues(client, state, model), state.platform)}${callbackField}</section>`;
}
function renderAdminAction(
	client: ClientDefinition,
	state: AppState,
	target: "provider" | "client",
): string {
	const provider = client.enterpriseSurface ?? client.name;
	return `<div class="admin-footer-action">${
		target === "provider"
			? `<button id="configure-provider-button-bottom" class="instui-button -color-primary" type="button" data-guide-surface="provider" data-scroll-guide>Configure ${escapeHtml(provider)}</button>`
			: `<button id="configure-client-button-bottom" class="instui-button -color-primary" type="button" data-page="connect" data-configure-client ${connectionReadiness(state, client).ready ? "" : "disabled"}>Configure a Client</button>`
	}</div>`;
}
export function renderGuide(
	client: ClientDefinition,
	state: AppState,
	editable: boolean,
	callback?: CallbackResolution,
): string {
	const model = resolveKeySettings(client, state, callback);
	const guide = clientGuide(client, state.install);
	validateGuide(guide);
	const activeSurface = editable
		? state.install === "enterprise"
			? state.surface
			: "canvas"
		: "provider";
	const splitEnterprise =
		editable && state.install === "enterprise" && guide.presentation === "by-surface";
	const provider = client.enterpriseSurface ?? client.name;
	const heading = `<div class="guide-heading"><h2 class="instui-heading -level-h2 --mb-2xl">${editable && guide.presentation === "by-surface" && activeSurface === "canvas" ? "Key settings for " : ""}${escapeHtml(client.name)}</h2></div>`;
	// A connection blocker does not hide the administrator's provisioning instructions.
	if (client.blocker && !editable) return heading;
	const pending =
		!editable && guide.status === "pending"
			? '<p class="guide-pending">Provider instructions are awaiting source verification. The connection fields and workflow below are provisional.</p>'
			: "";
	const steps = (
		editable ? serverSetupSteps(guide, state.install) : clientSetup(client, state.install).steps
	).filter((step) => step.kind === "canvas-key" || !step.key || step.key === state.key);
	const surfaceControl = splitEnterprise
		? `<fieldset class="instui-segmented-control guide-surfaces" aria-label="Setup instructions"><div class="viewport"><div class="track">${(["canvas", "provider"] as const).map((surface) => `<label><input id="guide-surface-${surface}" type="radio" name="guide-surface" value="${surface}" data-guide-surface="${surface}" aria-controls="guide-${surface}" ${activeSurface === surface ? "checked" : ""}>${surface === "canvas" ? "1. Canvas" : `2. ${escapeHtml(provider)}`}</label>`).join("")}</div></div></fieldset>`
		: "";
	const body = !editable
		? `<section id="guide-provider" class="guide-surface" aria-label="${escapeHtml(client.name)} setup">${steps.map((step) => renderStep(step, client, state, false, model)).join("")}</section>`
		: guide.presentation === "interleaved"
			? `<div class="interleaved-guide">${steps.map((step, index) => `<div class="workflow-step"><p class="workflow-label">${step.kind === "canvas-key" ? '<span class="workflow-logo workflow-logo--canvas" aria-hidden="true"></span>' : client.id === "generic" ? '<span class="instui-icon -icon-modelcontextprotocol workflow-logo" aria-hidden="true"></span>' : '<img class="workflow-logo" src="/canvas-mcp/images/CopilotStudio.svg" alt="" />'}Step ${index + 1} · ${step.kind === "canvas-key" ? "Canvas" : escapeHtml(client.name)}</p>${renderStep(step, client, state, editable, model)}</div>`).join("")}</div>${editable ? renderAdminAction(client, state, "client") : ""}`
			: surfaceControl +
				(splitEnterprise ? (["canvas", "provider"] as const) : (["canvas"] as const))
					.map(
						(surface) =>
							`<section id="guide-${surface}" class="guide-surface" aria-label="${surface === "canvas" ? "Canvas setup" : `${escapeHtml(provider)} setup`}" ${activeSurface !== surface ? "hidden" : ""}>${surface === "provider" ? renderFields(client, state, model, editable) : ""}${steps
								.filter((step) =>
									surface === "canvas" ? step.kind === "canvas-key" : step.kind !== "canvas-key",
								)
								.map((step) => renderStep(step, client, state, editable, model))
								.join(
									"",
								)}${editable && (surface === "canvas" || splitEnterprise) ? renderAdminAction(client, state, surface === "canvas" && splitEnterprise ? "provider" : "client") : ""}</section>`,
					)
					.join("");

	return heading + pending + body;
}
