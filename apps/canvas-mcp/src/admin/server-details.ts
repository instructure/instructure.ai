import { clientDefinition } from "../clients";
import { type AppState, deriveUrls } from "../state";
import { escapeHtml } from "../ui/html";
export function serverDetailsCard(urls: ReturnType<typeof deriveUrls>, state: AppState): string {
	const client = clientDefinition(state.client),
		canCopyMcpUrl = Boolean(state.region),
		mcpUrl = canCopyMcpUrl ? urls.mcp : "Select a Canvas region to build this URL";
	return `<section class="server-details-card" aria-labelledby="tray-server-details-heading"><h3 id="tray-server-details-heading" class="instui-heading -level-h3">Server details</h3>${generatedValueRow("generated-mcp-url", "MCP server URL", mcpUrl, "generated-mcp-url-copy", canCopyMcpUrl)}${generatedValueRow("generated-auth-url", "Canvas authorization URL", urls.auth)}${generatedValueRow("generated-token-url", "Canvas token URL", urls.token)}${generatedValueRow("generated-scope-url", "Scope", urls.scope)}${client.facts.staticClientId.value !== "no" ? `<div id="generated-client-id-field" class="generated-client-id-field">${generatedValueRow("generated-client-id", "Client ID", state.clientId, "generated-client-id-copy", Boolean(state.clientId))}</div>` : ""}${client.id === "generic" ? generatedValueRow("generated-redirect-uris", "Callback URIs", state.redirectUris, "generated-redirect-uris-copy", Boolean(state.redirectUris), true) : ""}</section>`;
}

function generatedValueRow(
	id: string,
	label: string,
	value: string,
	copyButtonId = `${id}-copy`,
	canCopy = true,
	multiline = false,
): string {
	return `<div class="generated-value-row"><label class="field-label" for="${id}">${escapeHtml(label)}</label><div class="generated-value-control">${multiline ? `<textarea id="${id}" class="instui-text-area text-input" rows="3" readonly aria-readonly="true">${escapeHtml(value)}</textarea>` : `<input id="${id}" class="instui-text-input text-input" type="text" value="${escapeHtml(value)}" readonly aria-readonly="true" />`}<button id="${copyButtonId}" class="instui-button -color-tertiary -shape-square -icon-copy -size-sm" type="button" aria-label="Copy ${escapeHtml(label)}" title="Copy ${escapeHtml(label)}" data-copy="${escapeHtml(value)}" data-label="${escapeHtml(label)}" ${canCopy ? "" : "disabled"}></button></div></div>`;
}
