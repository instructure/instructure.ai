import fs from "node:fs";
import type { ChangedEntry } from "../types";

function getObjectDiffs(
	objA: unknown,
	objB: unknown,
	path: string[] = [],
): Array<{ path: string[]; oldValue: unknown; newValue: unknown }> {
	const diffs: Array<{ path: string[]; oldValue: unknown; newValue: unknown }> =
		[];
	const keys = new Set([
		...Object.keys((objA as object) || {}),
		...Object.keys((objB as object) || {}),
	]);
	for (const key of keys) {
		const valA = (objA as Record<string, unknown>)[key];
		const valB = (objB as Record<string, unknown>)[key];
		if (
			typeof valA === "object" &&
			valA !== null &&
			typeof valB === "object" &&
			valB !== null
		) {
			diffs.push(...getObjectDiffs(valA, valB, [...path, key]));
		} else if (valA !== valB) {
			diffs.push({ newValue: valB, oldValue: valA, path: [...path, key] });
		}
	}
	return diffs;
}

const writeChangelog = ({
	changelogPath,
	dateStr,
	csvSha,
	changedEntries,
}: {
	changelogPath: string;
	dateStr: string;
	csvSha: string;
	changedEntries: ChangedEntry[];
}) => {
	if (changedEntries.length > 0) {
		let changelog = `\n\n## ${dateStr}\n\n`;
		changelog += `### CSV\n\n**SHA:** ${csvSha}\n`;
		const entryDiffs = changedEntries
			.map((e) => {
				let diffText = `\n### ${e.uid}\n\n#### SHA\n\n**Old:** \`${e.oldChecksum ? `${e.oldChecksum}` : "(none)"}\`\n\n**New:** \`${e.newChecksum}\``;
				if (e.newEntry && !e.oldEntry) {
					// Show all new values for new entries
					const newObj = e.newEntry as Record<string, unknown>;
					for (const key of Object.keys(newObj)) {
						const value = newObj[key];
						diffText += `\n\n#### ${key}\n\nOld: \`(none)\`\n\n#### New:\n\n\`\`\`JSON\n${JSON.stringify(value, null, 2)}\n\`\`\``;
					}
				} else if (e.oldEntry && e.newEntry) {
					// Show diffs for changed entries
					const diffs = getObjectDiffs(e.oldEntry, e.newEntry);
					for (const diff of diffs) {
						const pathStr = diff.path.join(".");
						diffText += `\n\n#### ${pathStr}:\n\nOld:\n\n\`\`\`JSON\n${JSON.stringify(diff.oldValue, null, 2)}\n\`\`\`\n#### New:\n\n\`\`\`JSON\n${JSON.stringify(diff.newValue, null, 2)}\n\`\`\``;
					}
				}
				return diffText;
			})
			.join("\n");
		changelog += `${entryDiffs}\n`;
		try {
			// Read existing changelog
			let existing = "";
			if (fs.existsSync(changelogPath)) {
				existing = fs.readFileSync(changelogPath, "utf-8");
			}
			const lines = existing.split(/\r?\n/);
			// Ensure header exists
			if (!lines[0].startsWith("# Changelog")) {
				lines.unshift("# Changelog");
			}
			// Prepend new changelog after header
			const newContent = [lines[0], changelog.trim(), ...lines.slice(1)].join(
				"\n\n",
			);
			fs.writeFileSync(changelogPath, newContent);
			return { changelog, success: true };
		} catch (err) {
			return { error: err, success: false };
		}
	}
};

export { writeChangelog };
