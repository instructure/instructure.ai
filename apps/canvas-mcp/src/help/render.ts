import { CLIENTS, clientLabel } from "../clients";
import { clientStatus } from "../clients/status";
import { type InstallMode, type KeyType } from "../clients/ids";
import { type ClientDefinition } from "../clients/types";
import { escapeHtml } from "../ui/html";
import { COMMON_ISSUES, FAQS, HELP_SECTIONS, type HelpSection } from "./content";

export function renderHelp(section: HelpSection): string {
	const label = HELP_SECTIONS.find(({ id }) => id === section)!.label;
	return `<section class="instui-card -variant-base help-panel"><div class="content">
		<fieldset class="instui-segmented-control help-sections" aria-label="Help topics"><div class="viewport"><div class="track">${HELP_SECTIONS.map(({ id, label }) => `<label><input id="help-section-${id}" type="radio" name="help-section" value="${id}" data-help-section="${id}" aria-controls="help-content" ${section === id ? "checked" : ""}>${label}</label>`).join("")}</div></div></fieldset>
		<section id="help-content" class="${section === "clients" ? "help-matrix-content" : ""}" aria-labelledby="help-content-heading"><h2 id="help-content-heading" class="instui-heading -level-h2">${label}</h2>
		${section === "clients" ? renderClientMatrix() : section === "faqs" ? renderFaqs() : renderEntries(COMMON_ISSUES)}
		${section === "issues" ? renderClientIssues() : ""}
		</section></div></section>`;
}

function renderFaqs(): string {
	return FAQS.map(
		({ title, entries }) =>
			`<section class="help-entry" aria-labelledby="faq-${title.toLowerCase()}"><h3 id="faq-${title.toLowerCase()}" class="instui-heading -level-h3">${title}</h3>${entries.map(({ title, text }) => `<details class="instui-toggle-details"><summary>${escapeHtml(title)}</summary><div><p>${escapeHtml(text)}</p></div></details>`).join("")}</section>`,
	).join("");
}

function renderEntries(entries: { title: string; text: string }[]): string {
	return entries
		.map(
			({ title, text }) =>
				`<section class="help-entry"><h3 class="instui-heading -level-h3">${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></section>`,
		)
		.join("");
}

function curatedClients(): ClientDefinition[] {
	return CLIENTS.filter(({ group }) => group === "Curated");
}

function renderClientIssues(): string {
	const issues = curatedClients().flatMap((client) =>
		(["enterprise", "personal"] as const).flatMap((install) => {
			if (client.installModes.length && !client.installModes.includes(install)) return [];
			const status = clientStatus(client, install);
			const reason = client.blocker?.reason ?? (status.kind === "known-issue" ? status.reason : "");
			return reason ? [{ title: `${clientLabel(client)} (${install})`, text: reason }] : [];
		}),
	);
	return `<h3 class="instui-heading -level-h3">Recorded client issues</h3>${renderEntries(issues)}`;
}

function renderClientMatrix(): string {
	return `<p id="client-matrix-legend">Verified = existing Validated status; Untested = no recorded validation; Known issue = recorded blocker or incompatible key type. Not applicable = unavailable install mode. Statuses are scoped to install mode, not separate public/private tests. This is not vendor certification.</p>
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
		</table></div>`;
}

function renderStatus(client: ClientDefinition, install: InstallMode, key: KeyType): string {
	if (client.installModes.length && !client.installModes.includes(install))
		return "<span>Not applicable</span><p>This install mode is not available.</p>";
	const status = clientStatus(client, install);
	const support = client.facts.keyTypes[key];
	const reason =
		client.blocker?.reason ??
		(status.kind === "known-issue"
			? status.reason
			: support.value === "no"
				? `This client does not support ${key} keys.`
				: "");
	const label = reason ? "Known issue" : status.kind === "validated" ? "Verified" : "Untested";
	const style = reason
		? "-color-danger -icon-triangle-alert"
		: status.kind === "validated"
			? "-color-success -icon-check"
			: "-icon-info";
	const notes = [
		reason,
		...(status.kind === "validated" ? [`Tested: ${status.testedAt}`, status.note ?? ""] : []),
		...(client.installModes.length === 0 ? ["Install flow unverified."] : []),
		...(support.value === "unknown" ? ["Key support unverified."] : []),
	];
	return `<span class="instui-pill ${style}">${label}</span>${notes
		.filter(Boolean)
		.map((note) => `<p>${escapeHtml(note)}</p>`)
		.join("")}`;
}
