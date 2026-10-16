import "./main.css";
import { CLIENTS, clientDefinition, normalizeKeyType } from "./clients";
import {
	type AppState,
	type StorageLike,
	deriveUrls,
	isBetaDomain,
	normalizeCanvasDomain,
	readState,
	savePreferences,
	stateQuery,
} from "./state";

type PageMode = "user" | "admin";

const BASE_SCOPE = "https://sso.canvaslms.com/all-client-scopes",
	INTROSPECT_SCOPE = "url:POST|/api/v1/oauth2/introspect";

export function mountApp(mode: PageMode): void {
	const root = document.querySelector<HTMLElement>("#root");
	if (!root) {
		return;
	}
	const appRoot = root,
		state = readState(globalThis.location.search, getStorage());
	state.key = normalizeKeyType(state.client, state.key);
	const viewState = { domainInputValue: state.domain },
		copiedLabel = "";

	function render() {
		const client = clientDefinition(state.client),
			hasValidDomain = Boolean(normalizeCanvasDomain(state.domain)),
			urls = hasValidDomain
				? deriveUrls(state)
				: {
						auth: "https://<canvas-domain>/login/oauth2/auth",
						mcp: "https://<tenant>.maple.<region>.core.inseng.io/mcp",
						scope: BASE_SCOPE,
						token: "https://<canvas-domain>/login/oauth2/token",
					};

		appRoot.innerHTML = `
			<div class="site-shell" data-mode="${mode}">
				<header class="site-header" data-print="hidden">
					<a class="wordmark" href="${basePath()}" aria-label="Canvas MCP setup home"><span class="wordmark-mark" aria-hidden="true">C</span><span>Canvas <b>MCP</b></span></a>
					<nav class="header-actions" aria-label="Main navigation">
						<a class="nav-link ${mode === "user" ? "is-current" : ""}" href="${basePath()}">Connect a client</a>
						<a class="nav-link ${mode === "admin" ? "is-current" : ""}" href="${basePath()}admin/">Developer key</a>
						<label class="theme-control"><span class="visually-hidden">Color theme</span><select id="theme-select" aria-label="Color theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
						<button class="button button-quiet" type="button" data-action="print">Print</button>
					</nav>
				</header>
				<main class="page-content">
					<div class="page-heading"><div><p class="eyebrow">CANVAS MCP · ${mode === "user" ? "CLIENT SETUP" : "ADMIN SETUP"}</p><h1>${mode === "user" ? "Connect Canvas to your MCP client" : "Create a Canvas developer key"}</h1><p class="lede">${mode === "user" ? "Build the connection details for your Canvas environment." : "Configure one developer key for the client you are setting up."}</p></div>${mode === "user" ? `<button class="button button-outline" type="button" data-action="copy-link">Copy setup link</button>` : ""}</div>
					${mode === "admin" ? adminIntro() : ""}
					<div class="workspace-grid">
						<aside class="controls-panel" aria-label="Setup options">
							<h2>Environment</h2>
							<label class="field-label" for="domain-input">Canvas domain</label>
							<input id="domain-input" class="text-input" type="url" inputmode="url" autocomplete="url" placeholder="school.instructure.com" value="${escapeHtml(viewState.domainInputValue)}" aria-describedby="domain-hint" />
							<p class="field-hint" id="domain-hint">Use your school's instructure.com address. Beta domains end in .beta.instructure.com.</p>
							<div id="region-field" class="field-group ${mode === "admin" ? "is-hidden" : ""}">
								<label class="field-label" for="region-select">Canvas region</label>
								<select id="region-select" class="text-input" ${mode === "admin" ? "disabled" : ""}><option value="">Select a region</option>${regionOptions(state.region)}</select>
								<p class="field-hint">Use the region in your Canvas developer key's automatically populated Maple audience.</p>
							</div>
							<hr class="rule" />
							<h2>Client</h2>
							<label class="field-label" for="client-select">MCP client</label>
							<select id="client-select" class="text-input">${clientOptions(state.client)}</select>
							<p class="field-hint">${escapeHtml(client.group)} · ${escapeHtml(client.name)}</p>
							<label class="field-label" id="key-type-label">Developer key type</label>
							<div class="segmented-control" role="group" aria-labelledby="key-type-label">${keyTypeButton("public", state.key, client.keyTypes)}${keyTypeButton("private", state.key, client.keyTypes)}</div>
							<p class="field-hint">${client.keyTypes.length === 1 ? (client.keyTypes[0] === "private" ? "This client requires a confidential key." : "This client uses a public key with PKCE.") : "Choose the key type required by your client."}</p>
							${mode === "user" ? `<label class="field-label" for="client-id-input">Client ID <span class="optional">Optional</span></label><input id="client-id-input" class="text-input" inputmode="numeric" autocomplete="off" placeholder="Numeric ID from Developer Keys" value="${escapeHtml(state.clientId)}" /><p class="field-hint">Client IDs are public identifiers. Never enter a client secret here.</p>` : ""}
						</aside>
						<section class="details-panel" aria-live="polite">${mode === "user" ? userDetails(client, urls, hasValidDomain, state, copiedLabel) : adminDetails(client, urls, hasValidDomain, state, copiedLabel)}</section>
					</div>
					<footer class="page-footer"><p>No Canvas credentials or client secrets are collected. Domain, client, key type, and region preferences may be saved in this browser.</p><a href="https://developerdocs.instructure.com/services/canvas/oauth2/file.developer_keys.md" target="_blank" rel="noreferrer">Canvas developer key documentation</a></footer>
				</main>
				<div class="toast" role="status" aria-live="polite">${escapeHtml(copiedLabel)}</div>
			</div>
		`;
		bindEvents();
		applyTheme();
	}

	function bindEvents() {
		appRoot
			.querySelector<HTMLInputElement>("#domain-input")
			?.addEventListener("change", (event) => {
				viewState.domainInputValue = (event.currentTarget as HTMLInputElement).value;
				state.domain = normalizeCanvasDomain(viewState.domainInputValue) ?? "";
				persistAndRender();
			});
		appRoot
			.querySelector<HTMLSelectElement>("#region-select")
			?.addEventListener("change", (event) => {
				state.region = (event.currentTarget as HTMLSelectElement).value as AppState["region"];
				persistAndRender();
			});
		appRoot
			.querySelector<HTMLSelectElement>("#client-select")
			?.addEventListener("change", (event) => {
				state.client = (event.currentTarget as HTMLSelectElement).value as AppState["client"];
				state.key = normalizeKeyType(state.client, state.key);
				persistAndRender();
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-key-type]").forEach((button) => {
			button.addEventListener("click", () => {
				state.key = button.dataset.keyType as AppState["key"];
				persistAndRender();
			});
		});
		appRoot
			.querySelector<HTMLInputElement>("#client-id-input")
			?.addEventListener("input", (event) => {
				state.clientId = (event.currentTarget as HTMLInputElement).value.replace(/\D/gu, "");
				persist();
			});
		appRoot
			.querySelector<HTMLSelectElement>("#theme-select")
			?.addEventListener("change", (event) =>
				setTheme((event.currentTarget as HTMLSelectElement).value),
			);
		appRoot
			.querySelector<HTMLButtonElement>('[data-action="print"]')
			?.addEventListener("click", () => globalThis.print());
		appRoot
			.querySelector<HTMLButtonElement>('[data-action="copy-link"]')
			?.addEventListener("click", async () => {
				await copyToClipboard(
					new URL(
						`${globalThis.location.pathname}?${stateQuery(state)}`,
						globalThis.location.origin,
					).toString(),
					"Setup link copied",
				);
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
			button.addEventListener("click", async () =>
				copyToClipboard(button.dataset.copy ?? "", `${button.dataset.label ?? "Value"} copied`),
			);
		});
	}

	function persist() {
		savePreferences(state, getStorage());
		const search = stateQuery(state);
		globalThis.history.replaceState(
			null,
			"",
			`${globalThis.location.pathname}${search ? `?${search}` : ""}`,
		);
	}

	function persistAndRender() {
		persist();
		render();
	}

	render();
}

function userDetails(
	client: ReturnType<typeof clientDefinition>,
	urls: ReturnType<typeof deriveUrls>,
	hasValidDomain: boolean,
	state: AppState,
	copiedLabel: string,
): string {
	const copyableMcp = hasValidDomain && Boolean(state.region),
		mcpUrl = copyableMcp ? urls.mcp : "Select a Canvas domain and region to build this URL";
	return `
		<div class="section-heading"><div><p class="eyebrow">CONNECTION VALUES</p><h2>Your server details</h2></div><span class="status-pill ${copyableMcp ? "status-ready" : "status-pending"}">${copyableMcp ? "Ready to configure" : "Needs environment details"}</span></div>
		<div class="value-list">${valueRow("MCP server URL", mcpUrl, copyableMcp)}${valueRow("Authorization URL", urls.auth, hasValidDomain)}${valueRow("Token URL", urls.token, hasValidDomain)}${valueRow("Scope", urls.scope, true)}</div>
		<section class="guide-section"><div class="section-heading"><div><p class="eyebrow">${escapeHtml(client.group.toUpperCase())}</p><h2>${escapeHtml(client.name)}</h2></div></div><p>${escapeHtml(client.setupNote)}</p>
			<h3>Register this redirect URI on the developer key</h3><ul class="uri-list">${client.redirectUris.map((uri) => `<li><code>${escapeHtml(uri)}</code><button class="text-button" type="button" data-copy="${escapeHtml(uri)}" data-label="Redirect URI">Copy</button></li>`).join("")}</ul>
			<div class="steps-list"><div><span class="step-number">1</span><p>Ask your Canvas administrator to create a ${state.key === "private" ? "confidential" : "public"} developer key for this client and register the redirect URI above.</p></div><div><span class="step-number">2</span><p>In ${escapeHtml(client.name)}, add the remote MCP URL and the Canvas authorization and token URLs shown above. Enter your Client ID in the client; keep any client secret there and never share it in a setup link.</p></div><div><span class="step-number">3</span><p>${escapeHtml(client.verify)}</p></div></div>
			${isBetaDomain(state.domain) ? `<p class="notice notice-warm"><b>Beta environment.</b> Use the beta MCP URL and beta Canvas OAuth URLs. Your administrator creates the key in production Canvas with Test Cluster Only enabled.</p>` : ""}
		</section><p class="inline-status">${escapeHtml(copiedLabel)}</p>`;
}

function adminDetails(
	client: ReturnType<typeof clientDefinition>,
	urls: ReturnType<typeof deriveUrls>,
	hasValidDomain: boolean,
	state: AppState,
	copiedLabel: string,
): string {
	const productionDomain = state.domain.replace(".beta.instructure.com", ".instructure.com"),
		redirects = client.redirectUris.join("\n"),
		scopes = `${BASE_SCOPE}\n${INTROSPECT_SCOPE}`;
	return `
		<div class="section-heading"><div><p class="eyebrow">DEVELOPER KEY</p><h2>Key settings for ${escapeHtml(client.name)}</h2></div><span class="status-pill ${hasValidDomain ? "status-ready" : "status-pending"}">${hasValidDomain ? "Environment set" : "Add a Canvas domain"}</span></div>
		<p class="intro-copy">Create one key for this client. If another client requires a different key type or callback, create a separate key.</p>
		<div class="admin-steps">
			<section class="guide-section"><span class="step-kicker">01</span><div><h3>Open Developer Keys</h3><p>In the Canvas root account, open Account → Developer Keys. Create an API key named <b>Canvas MCP — ${escapeHtml(client.name)}</b>.</p></div></section>
			<section class="guide-section"><span class="step-kicker">02</span><div><h3>Set OAuth details</h3><dl class="settings-table">${settingRow("Owner Email", "An administrator or team mailbox")}${settingRow("Client Credentials Audience", "Canvas")}${settingRow("Allowed Audiences", "Use the region-specific Maple audience Canvas automatically populates. Keep the Canvas-provided value; do not type or guess a region.")}${settingRow("Redirect URIs", redirects, true)}${settingRow("Authorized Flows", state.key === "private" ? "Token Exchange" : "None / null")}${settingRow("Client Type", state.key === "private" ? "Confidential (private key)" : "Public (PKCE)")}${settingRow("Enforce Scopes", "On")}${settingRow("Allow Include Parameters", "On")}${settingRow("Linked Partner App / Vendor Code", "Leave blank")}</dl></div></section>
			<section class="guide-section"><span class="step-kicker">03</span><div><h3>Paste scopes</h3><p>Paste each scope on its own line. This app currently contains only the baseline scopes; it is not a complete production scope list.</p><div class="notice notice-warm"><b>Not ready for key creation:</b> add the per-tool scope manifest from a reviewed Maple revision before using this block. Do not omit the required tool scopes.</div>${copyBlock("Known baseline scopes (incomplete)", scopes, "Baseline scopes")}</div></section>
			<section class="guide-section"><span class="step-kicker">04</span><div><h3>Save and verify</h3><p>Turn the key on. Copy its numeric Client ID from the Developer Keys list. A private key also has a secret; enter that only in the client that needs it.</p>${isBetaDomain(state.domain) ? `<p class="notice"><b>Beta tenant:</b> sign in to production Canvas at <code>${escapeHtml(productionDomain || "<tenant>.instructure.com")}</code>, enable Test Cluster Only, and create the key there. Canvas copies it to beta.</p>` : ""}${valueRow("Canvas authorization URL", urls.auth, hasValidDomain)}${valueRow("Canvas token URL", urls.token, hasValidDomain)}</div></section>
		</div><p class="inline-status">${escapeHtml(copiedLabel)}</p>`;
}

function adminIntro(): string {
	return `<p class="notice notice-cool"><b>Audience behavior:</b> Canvas automatically populates the tenant's region-specific Maple audience in production. Use the value Canvas provides; this guide does not ask you to select or enter a region.</p>`;
}

function valueRow(label: string, value: string, canCopy: boolean): string {
	return `<div class="value-row"><div><span class="value-label">${escapeHtml(label)}</span><code>${escapeHtml(value)}</code></div><button class="button button-small" type="button" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}" ${canCopy ? "" : "disabled"}>Copy</button></div>`;
}

function copyBlock(label: string, value: string, copyLabel: string): string {
	return `<div class="copy-block"><div class="copy-block-heading"><span>${escapeHtml(label)}</span><button class="text-button" type="button" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(copyLabel)}" disabled>Copy</button></div><pre><code>${escapeHtml(value)}</code></pre></div>`;
}

function settingRow(label: string, value: string, copy = false): string {
	return `<div class="setting-row"><dt>${escapeHtml(label)}</dt><dd>${copy ? `<code>${escapeHtml(value)}</code><button class="text-button" type="button" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}">Copy</button>` : escapeHtml(value)}</dd></div>`;
}

function regionOptions(selected: string): string {
	const regions = [
		["us-east-1", "US East (N. Virginia)"],
		["us-west-2", "US West (Oregon)"],
		["eu-west-1", "Europe (Ireland)"],
		["eu-central-1", "Europe (Frankfurt)"],
		["ca-central-1", "Canada (Central)"],
		["ap-southeast-1", "Asia Pacific (Singapore)"],
		["ap-southeast-2", "Asia Pacific (Sydney)"],
	];
	return regions
		.map(
			([value, label]) =>
				`<option value="${value}" ${selected === value ? "selected" : ""}>${label} · ${value}</option>`,
		)
		.join("");
}

function clientOptions(selected: string): string {
	const groups = [...new Set(CLIENTS.map((client) => client.group))];
	return groups
		.map(
			(group) =>
				`<optgroup label="${escapeHtml(group)}">${CLIENTS.filter((client) => client.group === group)
					.map(
						(client) =>
							`<option value="${client.id}" ${selected === client.id ? "selected" : ""}>${escapeHtml(client.name)}</option>`,
					)
					.join("")}</optgroup>`,
		)
		.join("");
}

function keyTypeButton(key: "public" | "private", selected: string, allowed: string[]): string {
	const title = key === "public" ? "Public · PKCE" : "Private · secret";
	return `<button class="segment ${selected === key ? "is-selected" : ""}" type="button" data-key-type="${key}" aria-pressed="${selected === key}" ${allowed.includes(key) ? "" : "disabled"}>${title}</button>`;
}

function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/gu,
		(character) =>
			({ '"': "&quot;", "&": "&amp;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[character] ??
			character,
	);
}

function getStorage(): StorageLike | null {
	try {
		return globalThis.localStorage;
	} catch {
		return null;
	}
}

const basePath = (): string => {
	const baseUrl = import.meta.env.BASE_URL;
	return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

function applyTheme(): void {
	let theme = "system";
	try {
		theme = globalThis.localStorage.getItem("canvas-mcp:theme") ?? "system";
	} catch {
		theme = "system";
	}
	document.documentElement.dataset.theme = theme === "light" || theme === "dark" ? theme : "system";
	const select = document.querySelector<HTMLSelectElement>("#theme-select");
	if (select) {
		select.value = document.documentElement.dataset.theme;
	}
}

function setTheme(theme: string): void {
	const selected = theme === "light" || theme === "dark" ? theme : "system";
	document.documentElement.dataset.theme = selected;
	try {
		globalThis.localStorage.setItem("canvas-mcp:theme", selected);
	} catch {
		return;
	}
}

async function copyToClipboard(value: string, label: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(value);
	} catch {
		const temporary = document.createElement("textarea");
		temporary.value = value;
		temporary.setAttribute("readonly", "");
		temporary.style.position = "fixed";
		temporary.style.opacity = "0";
		document.body.append(temporary);
		temporary.select();
		document.execCommand("copy");
		temporary.remove();
	}
	const toast = document.querySelector<HTMLElement>(".toast");
	if (toast) {
		toast.textContent = label;
	}
}
