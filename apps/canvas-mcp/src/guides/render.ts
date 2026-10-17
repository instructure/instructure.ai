import { connectionReadiness } from "../setup";
import { type CallbackResolution } from "../oauth/codex-callback";
import { type ClientDefinition } from "../clients/types";
import { type AppState, deriveUrls } from "../state";
import { renderKeyCreation } from "../admin/key-settings";
import { type KeySettingsModel, resolveKeySettings } from "../admin/key-settings-model";
import { escapeHtml } from "../ui/html";
import { renderEvidence } from "../ui/oauth-facts";
import { clientGuide, sharedTroubleshooting } from "./shared";
import { type Guide, type GuideStep, type StructuredContent } from "./types";

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
export function renderContent(
	content: StructuredContent[],
	values: Record<string, string>,
): string {
	const text = (value: string) =>
		escapeHtml(value).replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/gu, (_, token: string) => {
			if (!Object.hasOwn(values, token)) throw new Error(`Unknown guide token: ${token}`);
			return `<span data-guide-token="${token}">${escapeHtml(values[token])}</span>`;
		});
	return content
		.map((block) => {
			switch (block.kind) {
				case "paragraph":
					return `<p>${text(block.text)}</p>`;
				case "code": {
					const { text: resolved, ready } = resolveCodeBlock(block.text, values);
					return `<div class="copy-block"><div class="copy-block-heading">Configuration<button class="instui-button -color-tertiary -size-sm" type="button" data-copy-template="${escapeHtml(block.text)}" data-copy="${escapeHtml(resolved)}" data-label="Configuration" ${ready ? "" : "disabled"}>Copy</button></div><pre><code>${text(block.text)}</code></pre></div>`;
				}
				case "list":
					return `<ol class="instui-list -ordered">${block.items.map((item) => `<li>${text(item)}</li>`).join("")}</ol>`;
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
	return `<section class="guide-section" data-guide-step="${step.id}" data-surface="provider"><h3 class="instui-heading -level-h3">${escapeHtml(step.title)}</h3>${renderContent(step.content, guideValues(client, state, model))}</section>`;
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
	const heading = `<h2 class="instui-heading -level-h2 --mb-2xl">${editable && guide.presentation === "by-surface" && activeSurface === "canvas" ? "Key settings for " : ""}${escapeHtml(client.name)}</h2>`;
	if (client.blocker) return heading + (editable ? "" : renderEvidence(client.blocker.evidence));
	const install =
		!editable && client.installModes.length > 1
			? `<div class="instui-button-set -toggle install-modes" role="group" aria-label="Install mode">${client.installModes.map((mode) => `<button id="install-${mode}" class="instui-button -color-secondary" type="button" data-install="${mode}" aria-pressed="${state.install === mode}">${mode === "personal" ? "Personal" : "Enterprise"}</button>`).join("")}</div>`
			: "";
	const pending =
		!editable && guide.status === "pending"
			? '<p class="guide-pending">Provider instructions are awaiting source verification. The connection fields and workflow below are provisional.</p>'
			: "";
	const steps = guide.steps.filter(
		(step) => step.kind === "canvas-key" || !step.key || step.key === state.key,
	);
	const surfaceControl = splitEnterprise
		? `<fieldset class="instui-segmented-control guide-surfaces" aria-label="Setup instructions"><div class="viewport"><div class="track">${(["canvas", "provider"] as const).map((surface) => `<label><input id="guide-surface-${surface}" type="radio" name="guide-surface" value="${surface}" data-guide-surface="${surface}" aria-controls="guide-${surface}" ${activeSurface === surface ? "checked" : ""}>${surface === "canvas" ? "1. Canvas" : `2. ${escapeHtml(provider)}`}</label>`).join("")}</div></div></fieldset>`
		: "";
	const body =
		guide.presentation === "interleaved"
			? `<div class="interleaved-guide">${steps.map((step, index) => `<div class="workflow-step"><p class="workflow-label">Step ${index + 1} · ${step.kind === "canvas-key" ? "Canvas" : escapeHtml(client.name)}</p>${renderStep(step, client, state, editable, model)}</div>`).join("")}</div>${editable ? renderAdminAction(client, state, "client") : ""}`
			: surfaceControl +
				(["canvas", "provider"] as const)
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

	return (
		heading +
		install +
		pending +
		(!editable && guide.prerequisites.length
			? `<ul>${guide.prerequisites.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
			: "") +
		body +
		(editable
			? ""
			: `<details class="shared-troubleshooting"><summary>Troubleshooting and OAuth FAQ</summary><p>Public keys use PKCE without a secret; confidential keys use the provider's supported secret authentication. Always select the key's pre-populated Maple audience, including when the client does not send a resource parameter.</p>${sharedTroubleshooting.map((item) => `<h3 class="instui-heading -level-h3">${escapeHtml(item.symptom)}</h3><p>${escapeHtml(item.fix)}</p>`).join("")}</details>` +
				(guide.lastVerified ? `<p>Last checked: ${escapeHtml(guide.lastVerified)}</p>` : "") +
				renderEvidence(guide.sources))
	);
}
