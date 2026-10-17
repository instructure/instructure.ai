import "./main.css";
import { getLogoSvg } from "@pantoken/plugin-logos";
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
	INTROSPECT_SCOPE = "url:POST|/api/v1/oauth2/introspect",
	CANVAS_LOGO_FULL_COLOR = toSvgDataUri(getLogoSvg("canvas", "horizontal", "full-color")),
	CANVAS_LOGO_REVERSED = toSvgDataUri(getLogoSvg("canvas", "horizontal", "reversed"));

export function mountApp(mode: PageMode): void {
	const root = document.querySelector<HTMLElement>("#root");
	if (!root) {
		return;
	}
	const appRoot = root,
		state = readState(globalThis.location.search, getStorage());
	let pageMode = pageModeFromQuery(globalThis.location.search) ?? mode;
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
			<div class="site-shell" data-mode="${pageMode}">
				<main class="page-content">
					<div class="page-heading">
						<div class="page-heading-copy">
							<div class="eyebrow"><img class="eyebrow-logo" alt="Canvas" src="${canvasLogoUri()}" /></div>
							<h1 class="instui-heading -variant-title-page">${pageMode === "user" ? "Connect Canvas to your MCP client" : "Create a Canvas developer key"}</h1>
							<p class="lede">${pageMode === "user" ? "Build the connection details for your Canvas environment." : "Configure one developer key for the client you are setting up."}</p>
						</div>
						<div class="page-heading-actions" role="group" aria-label="Page actions">
							<button class="instui-button -color-tertiary -shape-square -icon-copy -size-sm" type="button" data-action="copy-link" aria-label="Copy setup link" title="Copy setup link"></button>
							<div class="instui-button-set -color-secondary -toggle -size-sm theme-toggle" role="group" aria-label="Color theme">
								${themeButton("system", "monitor", "Use system theme")}
								${themeButton("light", "sun", "Use light theme")}
								${themeButton("dark", "moon", "Use dark theme")}
							</div>
							<button class="instui-button -color-tertiary -shape-square -icon-printer -size-sm" type="button" data-action="print" aria-label="Print setup guide" title="Print"></button>
						</div>
					</div>
					<div class="instui-tabs page-tabs --mb-md">
						<div class="list" role="tablist" aria-label="Canvas MCP setup pages">
							<button id="tab-connect" class="tab ${pageMode === "user" ? "-selected" : ""}" type="button" role="tab" aria-selected="${pageMode === "user"}" aria-controls="setup-panel" data-page="connect">Connect a Client</button>
							<button id="tab-admin" class="tab ${pageMode === "admin" ? "-selected" : ""}" type="button" role="tab" aria-selected="${pageMode === "admin"}" aria-controls="setup-panel" data-page="admin">Developer Key</button>
						</div>
						<section id="setup-panel" class="panel" role="tabpanel" aria-labelledby="${pageMode === "user" ? "tab-connect" : "tab-admin"}">
					${pageMode === "admin" ? adminIntro() : ""}
					<div class="workspace-grid">
						<aside class="instui-card -variant-base controls-panel" aria-label="Setup options">
							<div class="content">
							<h2 class="instui-heading -level-h2">Environment</h2>
							<label class="field-label" for="domain-input">Canvas domain</label>
							<input id="domain-input" class="instui-text-input text-input" type="url" inputmode="url" autocomplete="url" placeholder="school.instructure.com" value="${escapeHtml(viewState.domainInputValue)}" aria-describedby="domain-hint" />
							<p class="field-hint" id="domain-hint">Use your school's instructure.com address. Beta domains end in .beta.instructure.com.</p>
							<div id="region-field" class="field-group ${pageMode === "admin" ? "is-hidden" : ""}">
								<label class="field-label" for="region-select">Canvas region</label>
								<select id="region-select" class="instui-simple-select text-input" ${pageMode === "admin" ? "disabled" : ""}><option value="">Select a region</option>${regionOptions(state.region)}</select>
								<p class="field-hint">Use the region in your Canvas developer key's automatically populated Maple audience.</p>
							</div>
							<hr class="rule" />
							<h2 class="instui-heading -level-h2">Client</h2>
							<label class="field-label" for="client-select">MCP client</label>
							<select id="client-select" class="instui-simple-select text-input">${clientOptions(state.client)}</select>
							<p class="field-hint">${escapeHtml(client.group)} · ${escapeHtml(client.name)}</p>
							<fieldset class="instui-radio-input-group -variant-toggle key-type-control"><legend>Developer key type</legend>${keyTypeButton("public", state.key, client.keyTypes)}${keyTypeButton("private", state.key, client.keyTypes)}</fieldset>
							<p class="field-hint">${client.keyTypes.length === 1 ? (client.keyTypes[0] === "private" ? "This client requires a confidential key." : "This client uses a public key with PKCE.") : "Choose the key type required by your client."}</p>
							${pageMode === "user" ? `<label class="field-label" for="client-id-input">Client ID <span class="optional">Optional</span></label><input id="client-id-input" class="instui-text-input text-input" inputmode="numeric" autocomplete="off" placeholder="Numeric ID from Developer Keys" value="${escapeHtml(state.clientId)}" /><p class="field-hint">Client IDs are public identifiers. Never enter a client secret here.</p>` : ""}
							</div>
						</aside>
						<section class="instui-card -variant-base details-panel" aria-live="polite"><div class="content">${pageMode === "user" ? userDetails(client, urls, hasValidDomain, state, copiedLabel) : adminDetails(client, urls, hasValidDomain, state, copiedLabel)}</div></section>
					</div>
					<footer class="page-footer"><p>No Canvas credentials or client secrets are collected. Domain, client, key type, and region preferences may be saved in this browser.</p><a href="https://developerdocs.instructure.com/services/canvas/oauth2/file.developer_keys.md" target="_blank" rel="noreferrer">Canvas developer key documentation</a></footer>
					</section>
					</div>
				</main>
				<div class="instui-screen-reader-content toast" role="status" aria-live="polite">${escapeHtml(copiedLabel)}</div>
			</div>
		`;
		bindEvents();
		applyTheme();
	}

	function bindEvents() {
		appRoot.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((tab) => {
			tab.addEventListener("click", () => {
				pageMode = tab.dataset.page === "admin" ? "admin" : "user";
				persistAndRender();
			});
		});
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
		appRoot.querySelectorAll<HTMLInputElement>('input[name="key-type"]').forEach((radio) => {
			radio.addEventListener("change", () => {
				state.key = radio.value as AppState["key"];
				persistAndRender();
			});
		});
		appRoot
			.querySelector<HTMLInputElement>("#client-id-input")
			?.addEventListener("input", (event) => {
				state.clientId = (event.currentTarget as HTMLInputElement).value.replace(/\D/gu, "");
				persist();
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
			button.addEventListener("click", () => setTheme(button.dataset.themeChoice ?? "system"));
		});
		appRoot
			.querySelector<HTMLButtonElement>('[data-action="print"]')
			?.addEventListener("click", () => globalThis.print());
		appRoot
			.querySelector<HTMLButtonElement>('[data-action="copy-link"]')
			?.addEventListener("click", async () => {
				await copyToClipboard(
					new URL(
						`${globalThis.location.pathname}?${pageQuery(state, "user")}`,
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
		const search = pageQuery(state, pageMode);
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
	if (!new URLSearchParams(globalThis.location.search).has("page")) {
		persist();
	}
}

function pageModeFromQuery(search: string): PageMode | null {
	const page = new URLSearchParams(search).get("page");
	if (page === "connect") return "user";
	if (page === "admin") return "admin";
	return null;
}

function pageQuery(state: AppState, pageMode: PageMode): string {
	const params = new URLSearchParams(stateQuery(state));
	params.set("page", pageMode === "admin" ? "admin" : "connect");
	return params.toString();
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
		<div class="section-heading"><div><p class="eyebrow">CONNECTION VALUES</p><h2 class="instui-heading -level-h2">Your server details</h2></div><span class="instui-pill -size-x-small -color-${copyableMcp ? "success" : "warning"} status-pill">${copyableMcp ? "Ready to configure" : "Needs environment details"}</span></div>
		<div class="value-list">${valueRow("MCP server URL", mcpUrl, copyableMcp)}${valueRow("Authorization URL", urls.auth, hasValidDomain)}${valueRow("Token URL", urls.token, hasValidDomain)}${valueRow("Scope", urls.scope, true)}</div>
		<section class="guide-section"><div class="section-heading"><div><p class="eyebrow">${escapeHtml(client.group.toUpperCase())}</p><h2 class="instui-heading -level-h2">${escapeHtml(client.name)}</h2></div></div><p>${escapeHtml(client.setupNote)}</p>
			<h3 class="instui-heading -level-h3">Register this redirect URI on the developer key</h3><ul class="uri-list">${client.redirectUris.map((uri) => `<li><code>${escapeHtml(uri)}</code><button class="instui-button -color-tertiary -size-sm text-button" type="button" data-copy="${escapeHtml(uri)}" data-label="Redirect URI">Copy</button></li>`).join("")}</ul>
			<div class="steps-list"><div><span class="instui-pill -color-info step-number">1</span><p>Ask your Canvas administrator to create a ${state.key === "private" ? "confidential" : "public"} developer key for this client and register the redirect URI above.</p></div><div><span class="instui-pill -color-info step-number">2</span><p>In ${escapeHtml(client.name)}, add the remote MCP URL and the Canvas authorization and token URLs shown above. Enter your Client ID in the client; keep any client secret there and never share it in a setup link.</p></div><div><span class="instui-pill -color-info step-number">3</span><p>${escapeHtml(client.verify)}</p></div></div>
			${isBetaDomain(state.domain) ? `<p class="instui-alert -color-warning -inline notice notice-warm" role="status"><b>Beta environment.</b> Use the beta MCP URL and beta Canvas OAuth URLs. Your administrator creates the key in production Canvas with Test Cluster Only enabled.</p>` : ""}
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
		<div class="section-heading"><div><p class="eyebrow">DEVELOPER KEY</p><h2 class="instui-heading -level-h2">Key settings for ${escapeHtml(client.name)}</h2></div><span class="instui-pill -size-x-small -color-${hasValidDomain ? "success" : "warning"} status-pill">${hasValidDomain ? "Environment set" : "Add a Canvas domain"}</span></div>
		<p class="intro-copy">Create one key for this client. If another client requires a different key type or callback, create a separate key.</p>
		<div class="admin-steps">
			<section class="guide-section"><span class="instui-pill -color-info step-kicker">01</span><div><h3 class="instui-heading -level-h3">Open Developer Keys</h3><p>In the Canvas root account, open Account → Developer Keys. Create an API key named <b>Canvas MCP — ${escapeHtml(client.name)}</b>.</p></div></section>
			<section class="guide-section"><span class="instui-pill -color-info step-kicker">02</span><div><h3 class="instui-heading -level-h3">Set OAuth details</h3><dl class="settings-table">${settingRow("Owner Email", "An administrator or team mailbox")}${settingRow("Client Credentials Audience", "Canvas")}${settingRow("Allowed Audiences", "Use the region-specific Maple audience Canvas automatically populates. Keep the Canvas-provided value; do not type or guess a region.")}${settingRow("Redirect URIs", redirects, true)}${settingRow("Authorized Flows", state.key === "private" ? "Token Exchange" : "None / null")}${settingRow("Client Type", state.key === "private" ? "Confidential (private key)" : "Public (PKCE)")}${settingRow("Enforce Scopes", "On")}${settingRow("Allow Include Parameters", "On")}${settingRow("Linked Partner App / Vendor Code", "Leave blank")}</dl></div></section>
			<section class="guide-section"><span class="instui-pill -color-info step-kicker">03</span><div><h3 class="instui-heading -level-h3">Paste scopes</h3><p>Paste each scope on its own line. This app currently contains only the baseline scopes; it is not a complete production scope list.</p><div class="instui-alert -color-warning -inline notice notice-warm" role="alert"><b>Not ready for key creation:</b> add the per-tool scope manifest from a reviewed Maple revision before using this block. Do not omit the required tool scopes.</div>${copyBlock("Known baseline scopes (incomplete)", scopes, "Baseline scopes")}</div></section>
			<section class="guide-section"><span class="instui-pill -color-info step-kicker">04</span><div><h3 class="instui-heading -level-h3">Save and verify</h3><p>Turn the key on. Copy its numeric Client ID from the Developer Keys list. A private key also has a secret; enter that only in the client that needs it.</p>${isBetaDomain(state.domain) ? `<p class="instui-alert -color-info -inline notice" role="status"><b>Beta tenant:</b> sign in to production Canvas at <code>${escapeHtml(productionDomain || "<tenant>.instructure.com")}</code>, enable Test Cluster Only, and create the key there. Canvas copies it to beta.</p>` : ""}${valueRow("Canvas authorization URL", urls.auth, hasValidDomain)}${valueRow("Canvas token URL", urls.token, hasValidDomain)}</div></section>
		</div><p class="inline-status">${escapeHtml(copiedLabel)}</p>`;
}

function adminIntro(): string {
	return `<p class="instui-alert -color-info -inline notice notice-cool" role="status"><b>Audience behavior:</b> Canvas automatically populates the tenant's region-specific Maple audience in production. Use the value Canvas provides; this guide does not ask you to select or enter a region.</p>`;
}

function valueRow(label: string, value: string, canCopy: boolean): string {
	return `<div class="value-row"><div><span class="value-label">${escapeHtml(label)}</span><code>${escapeHtml(value)}</code></div><button class="instui-button -color-secondary -size-sm" type="button" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}" ${canCopy ? "" : "disabled"}>Copy</button></div>`;
}

function copyBlock(label: string, value: string, copyLabel: string): string {
	return `<div class="copy-block"><div class="copy-block-heading"><span>${escapeHtml(label)}</span><button class="instui-button -color-tertiary -size-sm" type="button" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(copyLabel)}" disabled>Copy</button></div><pre><code>${escapeHtml(value)}</code></pre></div>`;
}

function settingRow(label: string, value: string, copy = false): string {
	return `<div class="setting-row"><dt>${escapeHtml(label)}</dt><dd>${copy ? `<code>${escapeHtml(value)}</code><button class="instui-button -color-tertiary -size-sm text-button" type="button" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}">Copy</button>` : escapeHtml(value)}</dd></div>`;
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
	return `<label class="instui-radio -variant-toggle"><input type="radio" name="key-type" value="${key}" ${selected === key ? "checked" : ""} ${allowed.includes(key) ? "" : "disabled"}>${title}</label>`;
}

function themeButton(theme: string, icon: string, label: string): string {
	const selected = activeTheme() === theme;
	return `<button class="instui-button -shape-square -icon-${icon}" type="button" data-theme-choice="${theme}" aria-label="${label}" title="${label}" aria-pressed="${selected}"></button>`;
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

function activeTheme(): string {
	try {
		const stored = globalThis.localStorage.getItem("canvas-mcp:theme");
		return stored === "light" || stored === "dark" ? stored : "system";
	} catch {
		return "system";
	}
}

function canvasLogoUri(): string {
	const scheme = document.documentElement.dataset.pantokenScheme;
	const systemPrefersDark =
		typeof globalThis.matchMedia === "function" &&
		globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
	return scheme === "dark" || (!scheme && systemPrefersDark)
		? CANVAS_LOGO_REVERSED
		: CANVAS_LOGO_FULL_COLOR;
}

function toSvgDataUri(svg: string | undefined): string {
	return svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "";
}

function applyTheme(): void {
	const theme = activeTheme();
	if (theme === "light" || theme === "dark") {
		document.documentElement.dataset.pantokenScheme = theme;
	} else {
		delete document.documentElement.dataset.pantokenScheme;
	}
	syncThemeButtons(theme);
	syncCanvasLogo();
}

function setTheme(theme: string): void {
	const selected = theme === "light" || theme === "dark" ? theme : "system";
	if (selected === "light" || selected === "dark") {
		document.documentElement.dataset.pantokenScheme = selected;
	} else {
		delete document.documentElement.dataset.pantokenScheme;
	}
	syncThemeButtons(selected);
	syncCanvasLogo();
	try {
		globalThis.localStorage.setItem("canvas-mcp:theme", selected);
	} catch {
		return;
	}
}

function syncThemeButtons(selected: string): void {
	document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
		button.setAttribute("aria-pressed", String(button.dataset.themeChoice === selected));
	});
}

function syncCanvasLogo(): void {
	const image = document.querySelector<HTMLImageElement>(".eyebrow-logo");
	if (image) {
		image.src = canvasLogoUri();
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
