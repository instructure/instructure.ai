import fs from "node:fs";
import type { ChangedEntry } from "../types";

function getObjectDiffs(
  objA: unknown,
  objB: unknown,
  path: string[] = [],
): { path: string[]; oldValue: unknown; newValue: unknown }[] {
  const diffs: { path: string[]; oldValue: unknown; newValue: unknown }[] = [];
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
    let changelog = `\n## ${dateStr}\n`;
    changelog += `### CSV\n#### SHA\n\`\`\`diff\n${csvSha}\n\`\`\`\n`;
    const entryDiffs = changedEntries
      .map((e) => {
        let diffText = `### ${e.uid}\n`;
        if (e.newEntry && (e.oldEntry === undefined || e.oldEntry === null)) {
          const newObj = e.newEntry as Record<string, unknown>;
          for (const key of Object.keys(newObj)) {
            const value = newObj[key];
            diffText += `#### ${key}\n\`\`\`diff\n+ ${JSON.stringify(value, undefined, 2)}\n\`\`\`\n`;
          }
        } else if (e.oldEntry && e.newEntry) {
          const diffs = getObjectDiffs(e.oldEntry, e.newEntry);
          if (diffs.length === 0) {
            diffText += `_No changes detected in entry fields._\n`;
          } else {
            for (const diff of diffs) {
              const pathStr = diff.path.join(".");
              diffText += `#### ${pathStr}\n\`\`\`diff\n- ${JSON.stringify(diff.oldValue, undefined, 2)}\n+ ${JSON.stringify(diff.newValue, undefined, 2)}\n\`\`\`\n`;
            }
          }
        }
        return diffText;
      })
      .join("\n");
    changelog += `${entryDiffs}`;
    try {
      // Read existing changelog
      let existing = "";
      if (fs.existsSync(changelogPath)) {
        existing = fs.readFileSync(changelogPath, "utf8");
      }
      const lines = existing.split(/\r?\n/);
      // Ensure header exists
      if (!lines[0].startsWith("# Changelog")) {
        lines.unshift("# Changelog");
      }
      // Prepend new changelog after header
      const newContent = [lines[0], changelog.trim(), ...lines.slice(1)].join(
        "\n",
      );
      fs.writeFileSync(changelogPath, newContent);
      return { changelog, success: true };
    } catch (error) {
      return { error: error, success: false };
    }
  }
};

export { writeChangelog };
