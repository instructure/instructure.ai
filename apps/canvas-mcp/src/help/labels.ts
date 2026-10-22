import { CLIENTS, clientLabel } from "../clients";
import { type ClientDefinition } from "../clients/types";

export interface IssueLabel {
	name: string;
	description: string;
}

const slug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/gu, "-");

export function clientIssueLabels(client: ClientDefinition): string[] {
	return [
		`client: ${client.id}`,
		...(client.provider ? [`provider: ${slug(client.provider)}`] : []),
	];
}

export function allIssueLabels(): IssueLabel[] {
	const labels = new Map<string, string>();
	for (const client of CLIENTS) {
		const [clientName, providerName] = clientIssueLabels(client);
		labels.set(clientName, `Canvas MCP client: ${clientLabel(client)}`);
		if (providerName) labels.set(providerName, `Canvas MCP provider: ${client.provider}`);
	}
	return [...labels].map(([name, description]) => ({ name, description }));
}
