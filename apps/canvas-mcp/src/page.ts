import { renderOAuthFacts } from "./ui/oauth-facts";
import { clientDefinition } from "./clients";
import { type AppState, deriveUrls } from "./state";
import { renderConfig } from "./admin/config";
import { serverDetailsCard } from "./admin/server-details";
import { adminDetails } from "./admin/key-settings";
import { escapeHtml } from "./ui/html";
import { activeTheme, canvasLogoUri } from "./ui/theme";
export type PageMode = "user" | "admin";
export function renderPage(
	state: AppState,
	pageMode: PageMode,
	domainInputValue: string,
	canConnect: boolean,
): string {
	const client = clientDefinition(state.client),
		hasValidDomain = Boolean(state.domain),
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
						${pageMode === "admin" ? `<div class="configuration-stack">${renderConfig(state, domainInputValue)}${serverDetailsCard(urls, state, canConnect, true)}</div>` : ""}
						${pageMode === "user" ? serverDetailsCard(urls, state, canConnect, false) : ""}
						<section class="instui-card -variant-base details-panel" aria-live="polite"><div class="content">${pageMode === "user" ? userDetails(client) : adminDetails(client, hasValidDomain, state, copiedLabel)}${renderOAuthFacts(client)}</div></section>
					</div>
					<footer class="page-footer"><p>Copyright &copy; ${new Date().getFullYear()} Instructure, Inc.</p></footer>
					</section>
					</div>
				</main>
				<div class="instui-screen-reader-content toast" role="status" aria-live="polite">${escapeHtml(copiedLabel)}</div>
			</div>
		`;
}
function userDetails(client: ReturnType<typeof clientDefinition>): string {
	return `<h2 class="instui-heading -level-h2">${escapeHtml(client.name)}</h2>`;
}

function themeButton(theme: string, icon: string, label: string): string {
	const selected = activeTheme() === theme;
	return `<button class="instui-button -shape-square -icon-${icon}" type="button" data-theme-choice="${theme}" aria-label="${label}" title="${label}" aria-pressed="${selected}"></button>`;
}
