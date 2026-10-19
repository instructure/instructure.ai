import { connectionReadiness } from "./setup";
import { type CallbackResolution } from "./oauth/codex-callback";
import { clientDefinition } from "./clients";
import { type AppState, deriveUrls } from "./state";
import { renderConfig } from "./admin/config";
import { serverDetailsCard } from "./admin/server-details";
import { renderContent, renderGuide } from "./guides/render";
import { clientStatus } from "./clients/status";
import { escapeHtml } from "./ui/html";
import { activeTheme, canvasLogoUri } from "./ui/theme";
export type PageMode = "user" | "admin";
export function renderPage(
	state: AppState,
	pageMode: PageMode,
	domainInputValue: string,
	canConnect: boolean,
	callback?: CallbackResolution,
): string {
	const client = clientDefinition(state.client),
		status = clientStatus(client, state.install),
		knownIssue = status.kind === "known-issue" ? status.reason : "",
		isGeminiNotice = client.id === "gemini-cli" && Boolean(knownIssue),
		hasValidDomain = Boolean(state.domain),
		installLabel = client.installModes.length === 0 ? "install flow unverified" : state.install,
		copiedLabel = "",
		urls = hasValidDomain
			? deriveUrls(state)
			: {
					auth: "https://<canvas-domain>/login/oauth2/auth",
					mcp: "https://<tenant>.maple.<region>.core.inseng.io/mcp",
					scope: "https://sso.canvaslms.com/all-client-scopes",
					token: "https://<canvas-domain>/login/oauth2/token",
				};
	return `
			<div class="site-shell" data-mode="${pageMode}">
				<main class="page-content">
					<div class="page-heading">
						<div class="page-heading-copy">
							<div class="eyebrow"><img class="eyebrow-logo" alt="Canvas" src="${canvasLogoUri()}" /></div>
							<h1 class="instui-heading -variant-title-page">${pageMode === "user" ? "Connect Canvas to your MCP client" : "Configure a Canvas MCP Server"}</h1>
							${pageMode === "user" ? '<p class="lede">Follow the setup instructions for your MCP client.</p>' : ""}
						</div>
						<div class="page-heading-actions" role="group" aria-label="Page actions">
							<button class="instui-button -color-tertiary -shape-square -icon-sliders-horizontal -size-md" type="button" popovertarget="settings-tray" aria-controls="settings-tray" aria-label="Open settings" title="Settings"></button>
						</div>
					</div>
					<div class="instui-tabs page-tabs --mb-md">
						<div class="list" role="tablist" aria-label="Canvas MCP setup pages">
							<button id="tab-admin" class="tab ${pageMode === "admin" ? "-selected" : ""}" type="button" role="tab" aria-selected="${pageMode === "admin"}" aria-controls="setup-panel" data-page="admin" tabindex="${pageMode === "admin" ? "0" : "-1"}">Configure a Server</button>
							<button id="tab-connect" class="tab ${pageMode === "user" ? "-selected" : ""}" type="button" role="tab" aria-selected="${pageMode === "user"}" aria-controls="setup-panel" data-page="connect" tabindex="${pageMode === "user" ? "0" : "-1"}" ${pageMode === "admin" && !canConnect ? "disabled" : ""}>Connect a Client</button>
						</div>
						<section id="setup-panel" class="panel" role="tabpanel" aria-labelledby="${pageMode === "user" ? "tab-connect" : "tab-admin"}">
					<div class="workspace-grid${pageMode === "admin" ? "" : " workspace-grid--single"} --mt-xl">
						${pageMode === "admin" ? renderConfig(state, domainInputValue) : ""}
						${knownIssue ? `<div class="instructions-column"><div class="instui-alert -color-danger -inline known-issue-alert${isGeminiNotice ? " gemini-deprecation-notice" : ""}" role="alert"><b>Known issue:</b> ${escapeHtml(knownIssue)}${status.kind === "known-issue" && status.diagnostic ? renderContent([{ kind: "code", language: "text", text: status.diagnostic }], {}, state.platform) : ""}</div>` : ""}
						<section class="instui-card -variant-base details-panel" ><div class="content">${pageMode === "user" && connectionReadiness(state, client).blocked && status.kind !== "known-issue" ? `<p class="instui-alert -color-warning -inline" role="status">${escapeHtml(connectionReadiness(state, client).reason)}</p>` : ""}${renderGuide(client, state, pageMode === "admin", callback)}</div></section>
						${knownIssue ? "</div>" : ""}
					</div>
					<footer class="page-footer"><p>Copyright &copy; ${new Date().getFullYear()} Instructure, Inc.</p><p class="print-context">${escapeHtml(client.name)} · ${escapeHtml(installLabel)} · ${new Date().toISOString().slice(0, 10)}<br /><span class="print-permalink">${escapeHtml("/canvas-mcp/?" + new URLSearchParams({ domain: state.domain, client: state.client, key: state.key, ...(client.installModes.length ? { install: state.install } : {}), platform: state.platform, region: state.region, clientId: state.clientId, ...(client.id === "generic" && state.redirectUris ? { redirectUris: state.redirectUris } : {}), page: pageMode === "admin" ? "admin" : "connect" }).toString())}</span></p></footer>
					</section>
					</div>
				</main>
				<aside id="settings-tray" class="instui-tray -placement-end -size-md" popover role="region" aria-label="Settings" padding="var(--instui-spacing-space-md)">
					<div class="settings-tray-header">
						<h2 class="instui-heading -variant-title-card-regular">Settings</h2>
						<button class="instui-close-button -size-sm" type="button" popovertarget="settings-tray" popovertargetaction="hide" aria-label="Close settings"></button>
					</div>
					<section class="settings-tray-section" aria-labelledby="settings-appearance-heading">
						<h3 id="settings-appearance-heading" class="instui-heading -level-h3">Appearance</h3>
						<div class="instui-button-set -color-secondary -toggle -size-sm theme-toggle" role="group" aria-label="Color theme">
							${themeButton("system", "monitor", "Use system theme")}
							${themeButton("light", "sun", "Use light theme")}
							${themeButton("dark", "moon", "Use dark theme")}
						</div>
					</section>
					<section class="settings-tray-section" aria-labelledby="settings-platform-heading">
						<h3 id="settings-platform-heading" class="instui-heading -level-h3">Platform</h3>
						<div class="instui-button-set -color-secondary -toggle -size-sm platform-toggle" role="group" aria-label="Platform">
							${platformButton("windows", "Windows", "Windows (PowerShell)", state.platform)}
							${platformButton("mac", "Mac", "macOS / Linux (Bash)", state.platform)}
							${platformButton("auto", "Auto", "Detect this device's platform automatically", state.platform)}
						</div>
					</section>
					<section class="settings-tray-section" aria-labelledby="settings-sharing-heading">
						<h3 id="settings-sharing-heading" class="instui-heading -level-h3">Sharing</h3>
						<div class="settings-tray-actions">
							<button class="instui-button -color-secondary" type="button" data-action="print"><span class="instui-icon -icon-printer" aria-hidden="true"></span>Print this page</button>
							<button class="instui-button -color-secondary" type="button" data-action="copy-link"><span class="instui-icon -icon-send" aria-hidden="true"></span>Copy this link</button>
						</div>
					</section>
					${serverDetailsCard(urls, state)}
				</aside>
				<div class="instui-screen-reader-content toast" role="status" aria-live="polite">${escapeHtml(copiedLabel)}</div>
			</div>
		`;
}
function themeButton(theme: string, icon: string, label: string): string {
	const selected = activeTheme() === theme;
	return `<button class="instui-button -shape-square -icon-${icon}" type="button" data-theme-choice="${theme}" aria-label="${label}" title="${label}" aria-pressed="${selected}"></button>`;
}
function platformButton(choice: string, label: string, title: string, selected: string): string {
	return `<button class="instui-button" type="button" data-platform-choice="${choice}" aria-label="${escapeHtml(title)}" title="${escapeHtml(title)}" aria-pressed="${selected === choice}">${label}</button>`;
}
