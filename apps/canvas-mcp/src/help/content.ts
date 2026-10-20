import faqs from "./faqs.json";
import commonIssues from "./common-issues.json";
import { type CommandPlatform } from "../platform";

export const HELP_SECTIONS = [
	{ id: "faqs", label: "FAQs" },
	{ id: "issues", label: "Common Issues" },
	{ id: "clients", label: "Supported Clients" },
	{ id: "tools", label: "Available Tools" },
] as const;

export type HelpSection = (typeof HELP_SECTIONS)[number]["id"];

export function helpSectionFromQuery(search: string): HelpSection {
	const section = new URLSearchParams(search).get("help");
	return HELP_SECTIONS.find(({ id }) => id === section)?.id ?? "faqs";
}

export type HelpEntry = { title: string; commands?: string | Record<CommandPlatform, string> } & (
	| { type?: "text"; text: string }
	| { type: "list"; text: string[] }
);

export interface HelpGroup {
	title: "General" | "Admins" | "Users" | "Clients";
	entries: HelpEntry[];
}

function helpGroups(
	groups: {
		title: string;
		entries: {
			title: string;
			type?: string;
			text: string | string[];
			commands?: string | Record<CommandPlatform, string>;
		}[];
	}[],
): HelpGroup[] {
	return groups.map(({ title, entries }) => {
		if (title !== "General" && title !== "Admins" && title !== "Users" && title !== "Clients")
			throw new Error(`Unknown Help group: ${title}`);
		return {
			title,
			entries: entries.map((entry): HelpEntry => {
				if (entry.type === "list" && Array.isArray(entry.text))
					return { ...entry, type: "list", text: entry.text };
				if ((entry.type === undefined || entry.type === "text") && typeof entry.text === "string")
					return { ...entry, type: entry.type, text: entry.text };
				throw new Error(`Invalid Help entry type or text: ${entry.title}`);
			}),
		};
	});
}

export const FAQS: HelpGroup[] = helpGroups(faqs);
export const COMMON_ISSUES: HelpGroup[] = helpGroups(commonIssues);
