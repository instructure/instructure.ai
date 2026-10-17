import { type ClientDefinition, type Evidence } from "../clients/types";
import { escapeHtml } from "./html";

export function renderEvidence(evidence: Evidence[]): string {
	return evidence
		.map((source) => {
			let link = "";
			if (source.url) {
				const url = new URL(source.url);
				if (url.protocol !== "https:") throw new Error("Evidence links must use HTTPS");
				link = ` <a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Source</a>`;
			}
			return `<span>${escapeHtml(source.label)} · ${escapeHtml(source.verifiedAt)}${link}</span>`;
		})
		.join(" ");
}
export function renderOAuthFacts(client: ClientDefinition): string {
	const facts = client.facts;
	const fields = [
		["Remote HTTP", facts.remoteHttp],
		["Public key", facts.keyTypes.public],
		["Private key", facts.keyTypes.private],
		["PKCE", facts.pkce],
		["Resource parameter", facts.sendsResource],
		["Static Client ID", facts.staticClientId],
		["Registration", facts.registration],
	] as const;
	const unknown = fields.some(([, fact]) => fact.status === "unverified");
	return `<details class="oauth-facts"><summary>OAuth requirements${unknown ? " — Unverified" : ""}</summary>${unknown ? "<p>Some requirements have not been verified. Confirm compatibility with the client before configuring the connection.</p>" : ""}<dl>${fields.map(([name, fact]) => `<dt>${escapeHtml(name)}</dt><dd>${escapeHtml(fact.value)} · ${escapeHtml(fact.status)} ${fact.evidence.length ? renderEvidence(fact.evidence) : "— No source yet"}</dd>`).join("")}</dl></details>`;
}
