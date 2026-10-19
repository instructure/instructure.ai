import { CLIENTS } from "../src/clients";
import { type Evidence } from "../src/clients/types";
import { SCREENSHOT_MANIFEST } from "../src/guides/screenshot-manifest";

const today = Date.now(),
	staleAfter = 180 * 86_400_000;
let warnings = 0;
for (const client of CLIENTS.filter((client) => client.group === "Curated")) {
	const sources: Evidence[] = [
		...[
			client.facts.remoteHttp,
			client.facts.staticClientId,
			client.facts.registration,
			client.facts.pkce,
			client.facts.sendsResource,
			...Object.values(client.facts.keyTypes),
		].flatMap((fact) => fact.evidence),
		...(client.facts.redirectUri.kind === "unverified" ? [] : client.facts.redirectUri.evidence),
		...Object.values(client.guides ?? {}).flatMap((guide) => guide?.sources ?? []),
		...(client.blocker?.evidence ?? []),
	];
	const seen = new Set<string>();
	if (!sources.length) {
		process.stdout.write(`${client.id}: no evidence yet\n`);
		warnings++;
	}
	for (const source of sources) {
		const key = JSON.stringify(source);
		if (seen.has(key)) continue;
		seen.add(key);
		const checked = Date.parse(source.verifiedAt);
		if (!/^\d{4}-\d{2}-\d{2}$/u.test(source.verifiedAt) || !Number.isFinite(checked))
			throw new Error(`${client.id}: malformed evidence date`);
		if (checked > today + 86_400_000) throw new Error(`${client.id}: future evidence date`);
		if (today - checked > staleAfter) {
			process.stdout.write(`${client.id}: evidence older than 180 days (${source.verifiedAt})\n`);
			warnings++;
		}
	}
}
process.stdout.write(
	`Evidence review: ${warnings} advisory item(s). Staleness does not fail the build.\n`,
);
const screenshotPlaceholders = Object.entries(SCREENSHOT_MANIFEST)
	.filter(([, asset]) => !asset.file)
	.map(([name]) => name);
process.stdout.write(
	`Screenshot placeholders (${screenshotPlaceholders.length}); advisory only:\n`,
);
for (const name of screenshotPlaceholders) process.stdout.write(`- ${name}\n`);
