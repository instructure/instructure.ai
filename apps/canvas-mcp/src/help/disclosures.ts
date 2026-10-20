import { type StorageLike } from "../state";
import { type HelpSection } from "./content";

const STORAGE_KEY = "canvas-mcp:help-disclosures";

export function bindHelpDisclosures(
	root: HTMLElement,
	section: HelpSection,
	storage: StorageLike | null,
): void {
	let saved: Record<string, boolean> = {};
	try {
		const value: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "{}");
		if (!value || typeof value !== "object" || Array.isArray(value))
			throw new Error("Expected an object of Help disclosure preferences");
		for (const [key, open] of Object.entries(value)) {
			if (typeof open !== "boolean")
				throw new Error("Expected boolean Help disclosure preferences");
			saved[key] = open;
		}
	} catch (error) {
		console.warn("Could not restore Help disclosure preferences", error);
	}

	root.querySelectorAll<HTMLDetailsElement>("#help-content details").forEach((details) => {
		const summary = details.querySelector<HTMLElement>(":scope > summary");
		if (!summary) return;
		const group = details.closest(".help-entry")?.getAttribute("aria-labelledby") ?? "";
		const key = JSON.stringify([section, group, summary.textContent]);
		details.open = saved[key] ?? false;
		summary.addEventListener("click", (event) => {
			event.preventDefault();
			details.open = !details.open;
			saved[key] = details.open;
			try {
				storage?.setItem(STORAGE_KEY, JSON.stringify(saved));
			} catch (error) {
				console.warn("Could not save Help disclosure preferences", error);
			}
		});
	});
}
