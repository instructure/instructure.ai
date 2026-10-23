// Unverified client facts are tracked in clients/*.ts, not displayed as admin warnings.
import { CLIENTS, clientDefinition, clientLabel, allowedKeyTypes } from "../clients";
import { clientStatus } from "../clients/status";
import { type AppState, isTestDomain } from "../state";
import { escapeHtml } from "../ui/html";
export function renderConfig(state: AppState, domainInputValue: string): string {
	const testDomain = isTestDomain(domainInputValue),
		client = clientDefinition(state.client),
		status = client.blocker
			? { kind: "known-issue" as const, reason: client.blocker.reason }
			: clientStatus(client, state.install);
	return `<aside class="instui-card -variant-base controls-panel" aria-labelledby="configuration-heading">
							<div class="content">
							<h2 id="configuration-heading" class="instui-heading -variant-title-card-regular">Configuration</h2>
							<label class="field-label" for="domain-input">Canvas domain</label>
							<div class="instui-input-group"><input id="domain-input" class="instui-text-input text-input${testDomain ? " -invalid" : ""}" type="text" inputmode="url" autocomplete="off" placeholder="school" value="${escapeHtml(domainInputValue)}" aria-invalid="${testDomain}" aria-describedby="domain-hint${testDomain ? " test-domain-alert" : ""}" /><span class="after">.instructure.com</span></div>
							<p class="field-hint" id="domain-hint">Enter your Canvas tenant name. For a beta domain, add .beta after the tenant name.</p>
							<div id="region-field" class="field-group">
								<label class="field-label" for="region-select">Canvas region</label>
								<select id="region-select" class="instui-simple-select text-input" aria-describedby="region-hint" ${testDomain ? "disabled" : ""}><option value="">Select a region</option>${regionOptions(state.region)}</select>
								<p class="field-hint" id="region-hint">Use the region in your Canvas developer key's automatically populated Maple audience.</p>
							</div>
							<div class="client-select-label-row"><label class="field-label" for="client-select">MCP Client</label>${clientStatusPill(status)}</div>
							<select id="client-select" class="instui-simple-select text-input" aria-describedby="client-status" ${testDomain ? "disabled" : ""}>${clientOptions(client.id)}</select>
							<label class="instui-checkbox -variant-toggle private-key-toggle"><input id="private-key-input" type="checkbox" name="private-key" ${state.key === "private" ? "checked" : ""} ${testDomain || allowedKeyTypes(client).length < 2 ? "disabled" : ""}>Private key</label>
							${client.installModes.length > 1 || client.installModes[0] === "enterprise" ? `<label class="instui-checkbox -variant-toggle"><input id="enterprise-install-input" type="checkbox" ${state.install === "enterprise" ? "checked" : ""} ${testDomain || client.installModes.length === 1 ? "disabled" : ""}>Enterprise install</label>` : ""}
</div>
						</aside>`;
}
function clientStatusPill(status: ReturnType<typeof clientStatus>): string {
	const color =
			status.kind === "validated"
				? " -color-success"
				: status.kind === "known-issue"
					? " -color-danger"
					: "",
		icon =
			status.kind === "validated"
				? "-icon-check"
				: status.kind === "known-issue"
					? "-icon-triangle-alert"
					: "-icon-info",
		label =
			status.kind === "validated"
				? "Validated"
				: status.kind === "known-issue"
					? "Known issue"
					: "Untested";
	return `<span id="client-status" class="instui-pill${color} ${icon} client-status-pill" data-client-status="${status.kind}">${label}</span>`;
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
