import "./main.css";
import { getLogoSvg } from "@pantoken/plugin-logos";
import { CLIENTS, clientDefinition, normalizeKeyType } from "./clients";
import { SCOPE_MANIFEST } from "./scopes";
import {
	type AppState,
	type StorageLike,
	REGIONS,
	deriveUrls,
	isBetaDomain,
	normalizeCanvasDomain,
	readState,
	savePreferences,
	stateQuery,
} from "./state";

type PageMode = "user" | "admin";

const BASE_SCOPE = "https://sso.canvaslms.com/all-client-scopes",
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
	function isConnectionReady(): boolean {
		return (
			Boolean(normalizeCanvasDomain(state.domain)) &&
			Boolean(state.region) &&
			Boolean(state.client) &&
			Boolean(state.clientId)
		);
	}
	if (pageMode === "user" && !isConnectionReady()) {
		pageMode = "admin";
	}
	const viewState = { domainInputValue: state.domain },
		copiedLabel = "";

	function render() {
		const client = clientDefinition(state.client),
			hasValidDomain = Boolean(normalizeCanvasDomain(state.domain)),
			canConnect = isConnectionReady(),
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
							<h1 class="instui-heading -variant-title-page">${pageMode === "user" ? "Connect Canvas to your MCP client" : "Configure a Canvas MCP Server"}</h1>
							<p class="lede">${pageMode === "user" ? "Build the connection details for your Canvas environment." : "Configure one developer key for the client you are setting up."}</p>
						</div>
						<div class="page-heading-actions" role="group" aria-label="Page actions">
							<div class="instui-button-set -color-secondary -toggle -size-sm theme-toggle" role="group" aria-label="Color theme">
								${themeButton("system", "monitor", "Use system theme")}
								${themeButton("light", "sun", "Use light theme")}
								${themeButton("dark", "moon", "Use dark theme")}
							</div>
              <button class="instui-button -color-tertiary -shape-square -icon-send -size-md" type="button" data-action="copy-link" aria-label="Copy setup link" title="Copy setup link"></button>
							<button class="instui-button -color-tertiary -shape-square -icon-printer -size-md" type="button" data-action="print" aria-label="Print setup guide" title="Print"></button>
						</div>
					</div>
					<div class="instui-tabs page-tabs --mb-md">
						<div class="list" role="tablist" aria-label="Canvas MCP setup pages">
							<button id="tab-admin" class="tab ${pageMode === "admin" ? "-selected" : ""}" type="button" role="tab" aria-selected="${pageMode === "admin"}" aria-controls="setup-panel" data-page="admin">Configure a Server</button>
							<button id="tab-connect" class="tab ${pageMode === "user" ? "-selected" : ""}" type="button" role="tab" aria-selected="${pageMode === "user"}" aria-controls="setup-panel" data-page="connect" ${pageMode === "admin" && !canConnect ? "disabled" : ""}>Connect a Client</button>
						</div>
						<section id="setup-panel" class="panel" role="tabpanel" aria-labelledby="${pageMode === "user" ? "tab-connect" : "tab-admin"}">
					<div class="workspace-grid --mt-xl">
						${pageMode === "admin" ? `<div class="configuration-stack"><aside class="instui-card -variant-base controls-panel" aria-label="Setup options">
							<div class="content">
							<h2 class="instui-heading -variant-title-card-regular">Configuration</h2>
							<label class="field-label" for="domain-input">Canvas domain</label>
							<input id="domain-input" class="instui-text-input text-input" type="url" inputmode="url" autocomplete="url" placeholder="school.instructure.com" value="${escapeHtml(viewState.domainInputValue)}" aria-describedby="domain-hint" />
							<p class="field-hint" id="domain-hint">Use your school's instructure.com address. Beta domains end in .beta.instructure.com.</p>
							<div id="region-field" class="field-group">
								<label class="field-label" for="region-select">Canvas region</label>
								<select id="region-select" class="instui-simple-select text-input"><option value="">Select a region</option>${regionOptions(state.region)}</select>
								<p class="field-hint">Use the region in your Canvas developer key's automatically populated Maple audience.</p>
							</div>
							<label class="field-label" for="client-select">MCP client</label>
							<select id="client-select" class="instui-simple-select text-input">${clientOptions(state.client)}</select>
							<label class="instui-checkbox -variant-toggle private-key-toggle"><input id="private-key-input" type="checkbox" name="private-key" ${state.key === "private" ? "checked" : ""} ${client.keyTypes.length === 1 ? "disabled" : ""}>Private key</label>
							</div>
						</aside>${serverDetailsCard(urls, state, canConnect, true)}</div>` : ""}
						${pageMode === "user" ? serverDetailsCard(urls, state, canConnect, false) : ""}
						<section class="instui-card -variant-base details-panel" aria-live="polite"><div class="content">${pageMode === "user" ? userDetails(client) : adminDetails(client, hasValidDomain, state, copiedLabel)}</div></section>
					</div>
					<footer class="page-footer"><p>Copyright &copy; ${new Date().getFullYear()} Instructure, Inc.</p></footer>
					</section>
					</div>
				</main>
				<div class="instui-screen-reader-content toast" role="status" aria-live="polite">${escapeHtml(copiedLabel)}</div>
			</div>
		`;
		updatePrintPageBreaks(appRoot);
		bindEvents();
		applyTheme();
	}

	function syncConnectTab(): void {
		const connectTab = appRoot.querySelector<HTMLButtonElement>('[data-page="connect"]');
		if (pageMode === "admin" && connectTab) {
			const ready = isConnectionReady();
			connectTab.disabled = !ready;
			appRoot
				.querySelectorAll<HTMLButtonElement>("[data-configure-client]")
				.forEach((button) => (button.disabled = !ready));
		}
	}

	function bindEvents() {
		appRoot.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((tab) => {
			tab.addEventListener("click", () => {
				if (tab.hasAttribute("data-configure-client")) {
					globalThis.scrollTo({ top: 0, behavior: "smooth" });
				}
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
				state.key = normalizeKeyType(state.client, "public");
				persistAndRender();
			});
		appRoot.querySelector<HTMLInputElement>("#private-key-input")?.addEventListener("change", (event) => {
			state.key = normalizeKeyType(
				state.client,
				(event.currentTarget as HTMLInputElement).checked ? "private" : "public",
			);
			persistAndRender();
		});
		appRoot
			.querySelector<HTMLInputElement>("#client-id-input")
			?.addEventListener("input", (event) => {
				state.clientId = (event.currentTarget as HTMLInputElement).value.replace(/\D/gu, "");
				persist();
				const generatedClientIdInput = appRoot.querySelector<HTMLInputElement>("#generated-client-id"),
					generatedClientIdCopy = appRoot.querySelector<HTMLButtonElement>("#generated-client-id-copy");
				if (generatedClientIdInput) {
					generatedClientIdInput.value = state.clientId;
				}
				if (generatedClientIdCopy) {
					generatedClientIdCopy.dataset.copy = state.clientId;
					generatedClientIdCopy.disabled = !state.clientId;
				}
				appRoot
					.querySelector(".server-details-card")
					?.classList.toggle("is-hidden", !isConnectionReady());
				updatePrintPageBreaks(appRoot);
				syncConnectTab();
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
	if (
		!new URLSearchParams(globalThis.location.search).has("page") ||
		pageModeFromQuery(globalThis.location.search) !== pageMode
	) {
		persist();
	}
}

function updatePrintPageBreaks(root: HTMLElement): void {
	const cards = [...root.querySelectorAll<HTMLElement>(".instui-card:not(.controls-panel)")].filter(
		(card) => !card.classList.contains("is-hidden"),
	);
	cards.forEach((card, index) =>
		card.classList.toggle("print-page-break-after", index < cards.length - 1),
	);
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

function userDetails(client: ReturnType<typeof clientDefinition>): string {
	return `<h2 class="instui-heading -level-h2">${escapeHtml(client.name)}</h2>`;
}

function serverDetailsCard(
	urls: ReturnType<typeof deriveUrls>,
	state: AppState,
	canConfigureClient: boolean,
	showConfigureClient: boolean,
): string {
	const client = clientDefinition(state.client),
		canCopyMcpUrl = Boolean(state.region),
		mcpUrl = canCopyMcpUrl ? urls.mcp : "Select a Canvas region to build this URL";
	return `<section class="instui-card -variant-base server-details-card${canConfigureClient ? "" : " is-hidden"}" aria-label="Server Details"><div class="content"><h2 class="instui-heading -variant-title-card-regular">Server Details</h2>${generatedValueRow("generated-mcp-url", "MCP server URL", mcpUrl, "generated-mcp-url-copy", canCopyMcpUrl)}${generatedValueRow("generated-auth-url", "Canvas authorization URL", urls.auth)}${generatedValueRow("generated-token-url", "Canvas token URL", urls.token)}${generatedValueRow("generated-scope-url", "Scope", urls.scope)}${client.requiresClientId ? `<div id="generated-client-id-field" class="generated-client-id-field">${generatedValueRow("generated-client-id", "Client ID", state.clientId, "generated-client-id-copy", Boolean(state.clientId))}</div>` : ""}${showConfigureClient ? `<button id="configure-client-button" class="instui-link instui-button -color-primary" type="button" data-page="connect" data-configure-client ${canConfigureClient ? "" : "disabled"}>Configure a client</button>` : ""}</div></section>`;
}

function adminDetails(
	client: ReturnType<typeof clientDefinition>,
	hasValidDomain: boolean,
	state: AppState,
	copiedLabel: string,
): string {
	const productionDomain = state.domain.replace(".beta.instructure.com", ".instructure.com"),
		redirects = client.redirectUris.join("\n"),
		canConfigureClient = hasValidDomain && Boolean(state.region) && (!client.requiresClientId || Boolean(state.clientId)),
		keyTypeSaveSteps =
			state.key === "private"
				? `<div class="instui-banner -color-sea -size-compact -icon-key private-key-save-steps" role="status"><h4 class="instui-heading -level-h4">Private key setup</h4><ol class="instui-list -ordered"><li>Click <b>Save</b>.</li><li>In the <b>Developer Key Created</b> modal, copy the <b>API Key Secret</b> and store it securely.</li><li><p class="secret-warning"><b>Security warning:</b> This secret is shown only once. Store it in a trusted secrets manager; never commit it to source code, add it to a setup link, or share it.</p></li><li>Click <b>Close</b> on the modal.</li></ol></div>`
				: `<ol class="instui-list -ordered public-key-save-steps"><li>Click <b>Save</b>.</li></ol>`,
		sharedKeySaveSteps = `<ol start="${state.key === "private" ? 5 : 2}" class="instui-list -ordered shared-key-save-steps"><li>In the <b>Developer Keys</b> table, under the <b>State</b> column, toggle your new key to <b>on</b>.</li><li>Copy the Client ID from the <b>Details</b> column and paste it below. Do not copy or paste the API Key Secret; never share or store it in this setup.</li></ol>`;
	return `
		<h2 class="instui-heading -level-h2 --mb-2xl">Key settings for ${escapeHtml(client.name)}</h2>
		<div class="admin-steps">
			<section class="guide-section"><div><h3 class="instui-heading -level-h3">Open Developer Keys</h3><ol class="instui-list -ordered"><li>In the Canvas root account, open Account → Developer Keys.</li><li>Select <b>+ Developer Key</b>, open its menu, then choose <b>+ API Key</b>.</li></ol></div></section>
			<section class="guide-section"><div><h3 class="instui-heading -level-h3">Key Settings</h3>${settingsTable("Setting", `${settingRow("Key name", `Canvas MCP — ${client.name}`)}${settingRow("Owner Email", "An administrator or team mailbox")}${client.redirectUriKnown === false ? settingRow("Redirect URIs", redirects, true) : settingCodeRow("Redirect URIs", redirects, true)}${settingRow("Linked Partner App", "Leave blank")}${settingRow("Vendor Code (LTI 2):", "Leave blank")}${settingRow("Icon URL:", "Leave blank")}${settingRow("Notes", "Leave blank")}${settingCheckboxRow("Test Cluster Only", isBetaDomain(state.domain), false)}${settingRow("Client Credentials Audience", "Canvas")}${allowedAudiencesRow()}${settingRow("Authorized Flows", state.key === "private" ? "Token Exchange" : "Leave blank")}${settingRow("Client Type", state.key === "private" ? "Confidential" : "Public")}`)}</div></section>
			<section class="guide-section"><div><h3 class="instui-heading -level-h3">Scopes</h3>${settingsTable("Option", `${settingCheckboxRow("Enforce Scopes", true)}${settingRow("Method", "Paste scopes")}${settingCheckboxRow("Allow Include Parameters", true, false)}`)}<h4 class="instui-heading -level-h4 scope-manifest-title">Paste Scopes</h4><p>Paste the complete per-tool scope list, one scope per line.</p><div class="instui-card -variant-nested scope-card"><div class="content"><div class="scope-card-header"><h4 class="instui-heading -variant-title-card-regular">Per-tool scope manifest</h4><button class="instui-button -color-tertiary -shape-square -icon-copy -size-sm" type="button" aria-label="Copy scope manifest" title="Copy scope manifest" data-copy="${escapeHtml(SCOPE_MANIFEST)}" data-label="Scope manifest"></button></div><pre class="scope-manifest" tabindex="0" role="region" aria-label="Full Canvas scope manifest"><code>${escapeHtml(SCOPE_MANIFEST)}</code></pre></div></div></div></section>
			<section class="guide-section"><div><h3 class="instui-heading -level-h3">Save</h3>${keyTypeSaveSteps}${sharedKeySaveSteps}${client.requiresClientId ? `<label class="field-label" for="client-id-input">Client ID</label><input id="client-id-input" class="instui-text-input text-input" inputmode="numeric" autocomplete="off" maxlength="17" pattern="[0-9]{17}" placeholder="12345000000000001" value="${escapeHtml(state.clientId)}" required aria-describedby="client-id-hint" /><p class="field-hint" id="client-id-hint">Required by the Canvas OAuth flow. Enter the 17-digit ID from the Canvas Developer Keys page.</p>` : ""}${isBetaDomain(state.domain) ? `<p class="instui-alert -color-info -inline notice" role="status"><b>Beta tenant:</b> sign in to production Canvas at <code>${escapeHtml(productionDomain || "<tenant>.instructure.com")}</code>, enable Test Cluster Only, and create the key there. Canvas copies it to beta.</p>` : ""}</div></section>
		</div><p class="inline-status">${escapeHtml(copiedLabel)}</p><div class="admin-footer-action"><button id="configure-client-button-bottom" class="instui-link instui-button -color-primary" type="button" data-page="connect" data-configure-client ${canConfigureClient ? "" : "disabled"}>Configure a client</button></div>`;
}

function generatedValueRow(
	id: string,
	label: string,
	value: string,
	copyButtonId = `${id}-copy`,
	canCopy = true,
): string {
	return `<div class="generated-value-row"><label class="field-label" for="${id}">${escapeHtml(label)}</label><div class="generated-value-control"><input id="${id}" class="instui-text-input text-input" type="text" value="${escapeHtml(value)}" readonly aria-readonly="true" /><button id="${copyButtonId}" class="instui-button -color-tertiary -shape-square -icon-copy -size-sm" type="button" aria-label="Copy ${escapeHtml(label)}" title="Copy ${escapeHtml(label)}" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}" ${canCopy ? "" : "disabled"}></button></div></div>`;
}

function settingsTable(heading: string, rows: string): string {
	return `<table class="instui-table settings-table"><thead><tr><th scope="col">${escapeHtml(heading)}</th><th scope="col">Value</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function settingRow(label: string, value: string, muted = false): string {
	muted ||= value === "Leave blank" || value === "An administrator or team mailbox";
	return `<tr><th scope="row">${escapeHtml(label)}</th><td>${muted ? `<span class="setting-value-muted">${escapeHtml(value)}</span>` : escapeHtml(value)}</td></tr>`;
}

function settingCodeRow(label: string, value: string, canCopy: boolean): string {
	return `<tr><th scope="row">${escapeHtml(label)}</th><td><div class="table-copy-cell"><pre><code>${escapeHtml(value)}</code></pre><button class="instui-button -color-tertiary -shape-square -icon-copy -size-sm" type="button" aria-label="Copy ${escapeHtml(label)}" title="Copy ${escapeHtml(label)}" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}" ${canCopy ? "" : "disabled"}></button></div></td></tr>`;
}

function allowedAudiencesRow(): string {
	const regions = REGIONS.map((region) => `<li><code>${escapeHtml(region)}</code></li>`).join("");
	return `<tr><th scope="row">Allowed Audiences</th><td><pre><code>https://{{tenant_name}}.maple.&lt;region&gt;.core.inseng.io/</code></pre><p class="setting-helper audience-region-lead"><code>&lt;region&gt;</code> will be one of:</p><ul class="instui-list audience-regions">${regions}</ul><p class="setting-helper audience-tenant-note"><code>{{tenant_name}}</code> is a literal string in the Audiences list.</p></td></tr>`;
}

function settingCheckboxRow(label: string, checked: boolean, toggle = true): string {
	return `<tr><th scope="row">${escapeHtml(label)}</th><td><label class="instui-checkbox${toggle ? " -variant-toggle" : ""} setting-checkbox"><input type="checkbox" aria-label="${escapeHtml(label)}" ${checked ? "checked" : ""} disabled>${checked ? "Checked" : "Unchecked"}</label></td></tr>`;
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
