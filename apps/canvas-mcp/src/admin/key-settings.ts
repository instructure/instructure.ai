import { clientDefinition } from "../clients";
import { SCOPE_MANIFEST } from "../scopes";
import { type AppState, REGIONS, isBetaDomain } from "../state";
import { escapeHtml } from "../ui/html";
export function adminDetails(
	client: ReturnType<typeof clientDefinition>,
	hasValidDomain: boolean,
	state: AppState,
	copiedLabel: string,
): string {
	const productionDomain = state.domain.replace(".beta.instructure.com", ".instructure.com"),
		redirects = client.redirectUris.join("\n"),
		canConfigureClient =
			hasValidDomain &&
			Boolean(state.region) &&
			(!client.requiresClientId || Boolean(state.clientId)),
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
