/// <reference path="../types/index.d.ts" />

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  exitWithError,
  getPackageName,
  getRootPackage,
  unknownError,
  Workspace,
} from "@instructure.ai/shared-configs/workspace";
import { parse, stringify } from "yaml";

const main = async () => {
  const { output } = Workspace(["all"]);

  const root = getPackageName(getRootPackage());
  if (!root) {
    exitWithError("Could not determine the root package.");
  }
  const packageNames = Array.isArray(output)
    ? output
        .map((pkg) => getPackageName(pkg))
        .sort((a, b) => {
          if (a === root) return -1;
          if (b === root) return 1;
          return a.localeCompare(b);
        })
    : [];

  if (!packageNames.length) {
    exitWithError("No packages found in the workspace.");
  }

  const ymlPath = resolve(__dirname, "../.github/ISSUE_TEMPLATE/1-bug.yml");
  const ymlContent = readFileSync(ymlPath, "utf8");

  if (!ymlContent) {
    exitWithError("Issue template is empty or could not be read.");
  }

  const ymlObj = parse(ymlContent) as Record<string, unknown>;
  if (Array.isArray(ymlObj.body)) {
    const pkgDropdown: Record<string, unknown> | undefined = ymlObj.body.find(
      (item: Record<string, unknown>) =>
        item.id === "package" && (item.attributes as { name: string }),
    );
    if (pkgDropdown) {
      if (
        pkgDropdown.attributes &&
        typeof pkgDropdown.attributes === "object"
      ) {
        const currentOptions = (
          pkgDropdown.attributes as { options?: string[] }
        ).options;
        const listsMatch =
          Array.isArray(currentOptions) &&
          currentOptions.length === packageNames.length &&
          currentOptions.every((opt, idx) => opt === packageNames[idx]);
        if (!listsMatch) {
          console.log(
            "Updating Github Issue Template with package names:\n",
            packageNames,
          );
          (pkgDropdown.attributes as { options?: string[] }).options =
            packageNames;
          writeFileSync(ymlPath, stringify(ymlObj), "utf8");
        } else {
          console.log("Issue Template is up to date.");
        }
      } else {
        exitWithError(
          "Package dropdown attributes are missing or not an object.",
        );
      }
    } else {
      exitWithError("No package dropdown found in the YAML content.");
    }
  } else {
    exitWithError("YAML body is not an array. Cannot update package names.");
  }
};

export const updateIssues = main;

if (require.main === module) {
  main().catch((e) => unknownError(e));
}
