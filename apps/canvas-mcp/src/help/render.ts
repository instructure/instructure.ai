import { CLIENTS, clientLabel } from "../clients";
import { clientStatus } from "../clients/status";
import { type InstallMode, type KeyType } from "../clients/ids";
import { type ClientDefinition } from "../clients/types";
import { escapeHtml } from "../ui/html";
import { COMMON_ISSUES, FAQS, HELP_SECTIONS, type HelpGroup, type HelpSection } from "./content";

export function renderHelp(section: HelpSection): string {
	const label = HELP_SECTIONS.find(({ id }) => id === section)!.label;
	return `<section class="instui-card -variant-base help-panel"><div class="content">
		<fieldset class="instui-segmented-control help-sections" aria-label="Help topics"><div class="viewport"><div class="track">${HELP_SECTIONS.map(({ id, label }) => `<label><input id="help-section-${id}" type="radio" name="help-section" value="${id}" data-help-section="${id}" aria-controls="help-content" ${section === id ? "checked" : ""}>${label}</label>`).join("")}</div></div></fieldset>
		<section id="help-content" class="${section === "clients" ? "help-matrix-content" : ""}" aria-labelledby="help-content-heading"><h2 id="help-content-heading" class="instui-heading -level-h2">${label}</h2>
		${section === "clients" ? renderClientMatrix() : renderGroups(section === "faqs" ? FAQS : COMMON_ISSUES, section)}
		${section === "issues" ? renderClientIssues() : ""}
		</section></div></section>`;
}

function renderGroups(groups: HelpGroup[], section: "faqs" | "issues"): string {
	const prefix = section === "faqs" ? "faq" : "issue";
	return groups
		.map(
			({ title, entries }) =>
				`<section class="help-entry" aria-labelledby="${prefix}-${title.toLowerCase()}"><h3 id="${prefix}-${title.toLowerCase()}" class="instui-heading -level-h3">${title}</h3>${renderEntries(entries)}</section>`,
		)
		.join("");
}

function renderEntries(entries: { title: string; text: string }[]): string {
	return entries
		.map(
			({ title, text }) =>
				`<details class="instui-toggle-details"><summary>${escapeHtml(title)}</summary><div><p>${escapeHtml(text)}</p></div></details>`,
		)
		.join("");
}

function curatedClients(): ClientDefinition[] {
	return CLIENTS.filter(({ group }) => group === "Curated");
}

function unavailableInstallReason(client: ClientDefinition, install: InstallMode): string {
	if (client.installModes.length && !client.installModes.includes(install))
		return "This install mode is not available.";
	if (client.id === "gemini-cli" && install === "personal") {
		const status = clientStatus(client, install);
		if (status.kind === "known-issue") return status.reason;
	}
	return "";
}

function renderClientIssues(): string {
	const issues = curatedClients().flatMap((client) =>
		(["enterprise", "personal"] as const).flatMap((install) => {
			if (unavailableInstallReason(client, install)) return [];
			const status = clientStatus(client, install);
			const reason = client.blocker?.reason ?? (status.kind === "known-issue" ? status.reason : "");
			return reason ? [{ title: `${clientLabel(client)} (${install})`, text: reason }] : [];
		}),
	);
	return `<section class="help-entry" aria-labelledby="known-issues-heading"><h3 id="known-issues-heading" class="instui-heading -level-h3">Known Issues</h3>${renderEntries(issues)}</section>`;
}

function renderClientMatrix(): string {
	return `<p id="client-matrix-legend">Verified = existing Validated status; Untested = no recorded validation; Known issue = recorded connection blocker. Not applicable = unsupported key type or unavailable install mode, including discontinued Gemini CLI personal access. Statuses are scoped to install mode, not separate public/private tests. This is not vendor certification.</p>
		<div class="help-matrix-scroll" role="region" aria-label="Supported client compatibility matrix" tabindex="0">
		<table class="instui-table help-matrix" aria-describedby="client-matrix-legend">
		<caption>Curated Canvas MCP clients</caption>
		<thead><tr><th id="matrix-client" rowspan="2" scope="col">Client</th><th id="matrix-enterprise" colspan="2" scope="colgroup">Enterprise</th><th id="matrix-personal" colspan="2" scope="colgroup">Personal</th></tr>
		<tr>${(["enterprise", "personal"] as const).map((install) => (["public", "private"] as const).map((key) => `<th id="matrix-${install}-${key}" headers="matrix-${install}" scope="col">${key === "public" ? "Public" : "Private"}</th>`).join("")).join("")}</tr></thead>
		<tbody>${curatedClients()
			.map(
				(client) =>
					`<tr data-matrix-client="${client.id}"><th id="matrix-row-${client.id}" scope="row">${escapeHtml(clientLabel(client))}</th>${(["enterprise", "personal"] as const).map((install) => (["public", "private"] as const).map((key) => `<td headers="matrix-row-${client.id} matrix-${install} matrix-${install}-${key}">${renderStatus(client, install, key)}</td>`).join("")).join("")}</tr>`,
			)
			.join("")}</tbody>
		</table></div>${renderOtherClients()}`;
}

function renderOtherClients(): string {
	const clients = CLIENTS.filter(({ group, id }) => group === "Other" && id !== "generic").sort(
		(left, right) => left.name.localeCompare(right.name, "en"),
	);
	const generic = CLIENTS.find(({ id }) => id === "generic")!;
	return `<details class="instui-toggle-group other-clients"><summary>Other MCP clients</summary><div><ul class="instui-list">${[
		generic,
		...clients,
	]
		.map(
			(client) =>
				`<li data-other-client="${client.id}">${escapeHtml(client.id === "generic" ? "Generic MCP" : client.name)} ${renderStatusPill(client, "personal")}</li>`,
		)
		.join("")}</ul></div></details>`;
}

function renderStatusPill(client: ClientDefinition, install: InstallMode): string {
	const status = clientStatus(client, install);
	const issue = client.blocker || status.kind === "known-issue";
	const label = issue ? "Known issue" : status.kind === "validated" ? "Verified" : "Untested";
	const style = issue
		? "-color-danger -icon-triangle-alert"
		: status.kind === "validated"
			? "-color-success -icon-check"
			: "-icon-info";
	return `<span class="instui-pill ${style}">${label}</span>`;
}

function renderStatus(client: ClientDefinition, install: InstallMode, key: KeyType): string {
	const unavailable = unavailableInstallReason(client, install);
	if (unavailable)
		return `<span class="instui-pill -color-info -icon-equal-approximately-not">Not applicable</span>`;
	const status = clientStatus(client, install);
	const support = client.facts.keyTypes[key];
	if (support.value === "no")
		return `<span class="instui-pill -color-info -icon-equal-approximately-not">Not applicable</span>`;
	const reason = client.blocker?.reason ?? (status.kind === "known-issue" ? status.reason : "");
	if (!reason && status.kind === "untested") return renderStatusPill(client, install);
	const notes = [
		reason,
		...(status.kind === "validated"
			? [
					`Tested: ${status.testedAt}`,
					status.note ?? "",
					...(status.platform ? [`Platform: ${status.platform}`] : []),
				]
			: []),
		...(client.installModes.length === 0 ? ["Install flow unverified."] : []),
		...(support.value === "unknown" ? ["Key support unverified."] : []),
	];
	return `${renderStatusPill(client, install)}${notes
		.filter(Boolean)
		.map((note) => `<p>${escapeHtml(note)}</p>`)
		.join("")}`;
}
