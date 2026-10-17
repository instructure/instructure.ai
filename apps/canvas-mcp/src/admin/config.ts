// Unverified client facts are tracked in clients/*.ts, not displayed as admin warnings.
import { CLIENTS, clientDefinition, clientLabel, allowedKeyTypes } from "../clients";
import { type AppState } from "../state";
import { escapeHtml } from "../ui/html";
export function renderConfig(state: AppState, domainInputValue: string): string {
	const client = clientDefinition(state.client);
	return `<aside class="instui-card -variant-base controls-panel" aria-label="Setup options">
							<div class="content">
							<h2 class="instui-heading -variant-title-card-regular">Configuration</h2>
							<label class="field-label" for="domain-input">Canvas domain</label>
							<input id="domain-input" class="instui-text-input text-input" type="url" inputmode="url" autocomplete="url" placeholder="school.instructure.com" value="${escapeHtml(domainInputValue)}" aria-describedby="domain-hint" />
							<p class="field-hint" id="domain-hint">Use your school's instructure.com address. Beta domains end in .beta.instructure.com.</p>
							<div id="region-field" class="field-group">
								<label class="field-label" for="region-select">Canvas region</label>
								<select id="region-select" class="instui-simple-select text-input"><option value="">Select a region</option>${regionOptions(state.region)}</select>
								<p class="field-hint">Use the region in your Canvas developer key's automatically populated Maple audience.</p>
							</div>
							<label class="field-label" for="client-select">MCP client</label>
							<select id="client-select" class="instui-simple-select text-input">${clientOptions(client.id)}</select>
							<label class="instui-checkbox -variant-toggle private-key-toggle"><input id="private-key-input" type="checkbox" name="private-key" ${state.key === "private" ? "checked" : ""} ${allowedKeyTypes(client).length < 2 ? "disabled" : ""}>Private key</label>
							${client.installModes.length > 1 || client.installModes[0] === "enterprise" ? `<label class="instui-checkbox -variant-toggle"><input id="enterprise-install-input" type="checkbox" ${state.install === "enterprise" ? "checked" : ""} ${client.installModes.length === 1 ? "disabled" : ""}>Enterprise install</label><p class="field-hint">${client.installModes.length === 1 ? "This client is configured by an organization administrator." : client.id === "claude-code" ? "Configured through managed settings or device management." : client.id === "gemini-cli" ? "Approved through Gemini CLI enterprise controls, with local client configuration." : "Configured in the provider's admin console."}</p>` : ""}
</div>
						</aside>`;
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
							`<option value="${client.id}" ${selected === client.id ? "selected" : ""}>${escapeHtml(clientLabel(client))}</option>`,
					)
					.join("")}</optgroup>`,
		)
		.join("");
}
