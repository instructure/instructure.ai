import { clientDefinition } from "../clients";
import { type AppState, deriveUrls } from "../state";
import { escapeHtml } from "../ui/html";
export function serverDetailsCard(
	urls: ReturnType<typeof deriveUrls>,
	state: AppState,
	canConfigureClient: boolean,
	showConfigureClient: boolean,
): string {
	const client = clientDefinition(state.client),
		canCopyMcpUrl = Boolean(state.region),
		mcpUrl = canCopyMcpUrl ? urls.mcp : "Select a Canvas region to build this URL";
	return `<section class="instui-card -variant-base server-details-card${canConfigureClient ? "" : " is-hidden"}" aria-label="Server Details"><div class="content"><h2 class="instui-heading -variant-title-card-regular">Server Details</h2>${generatedValueRow("generated-mcp-url", "MCP server URL", mcpUrl, "generated-mcp-url-copy", canCopyMcpUrl)}${generatedValueRow("generated-auth-url", "Canvas authorization URL", urls.auth)}${generatedValueRow("generated-token-url", "Canvas token URL", urls.token)}${generatedValueRow("generated-scope-url", "Scope", urls.scope)}${client.facts.staticClientId.value !== "no" ? `<div id="generated-client-id-field" class="generated-client-id-field">${generatedValueRow("generated-client-id", "Client ID", state.clientId, "generated-client-id-copy", Boolean(state.clientId))}</div>` : ""}${showConfigureClient ? `<button id="configure-client-button" class="instui-link instui-button -color-primary" type="button" data-page="connect" data-configure-client ${canConfigureClient ? "" : "disabled"}>Configure a client</button>` : ""}</div></section>`;
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
