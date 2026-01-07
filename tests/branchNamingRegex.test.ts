import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

const yaml = fs.readFileSync(
  path.resolve(__dirname, "../.github/policies/branch-naming.yml"),
  "utf8",
);
const match = yaml.match(/branch_name_regex:\s*'([^']+)'/);
if (!match) {
  throw new Error("branch_name_regex not found in YAML");
}
const CAPTURED_GROUP_INDEX = 1;
const REGEX = new RegExp(match[CAPTURED_GROUP_INDEX]);

describe("branch_name_regex", () => {
  const validBranches = [
    "apps/nutritionfacts/feature-xyz",
    "apps/nutritionfacts-feature-xyz",
    "apps/nutritionfacts_feature_xyz",
    "packages/aiinfo/bugfix-123",
    "packages/aiinfo-bugfix",
    "packages/aiinfo_bugfix",
    "shared-configs/feature",
    "shared-configs-feature",
    "shared-configs_feature",
    "release/v1.2.3",
    "release-v1.2.3",
    "release_v1.2.3",
  ];

  validBranches.forEach((branch) => {
    it(`should match valid branch: ${branch}`, () => {
      expect(REGEX.test(branch)).toBeTruthy();
    });
  });

  const invalidBranches = [
    "apps/nutritionfacts",
    "packages/aiinfo",
    "shared_configs_feature",
    "release",
    "main",
    "feature/xyz",
    "shared-configs",
    "release_",
    "release-",
    "release/",
    "v1.2.3",
  ];

  invalidBranches.forEach((branch) => {
    it(`should not match invalid branch: ${branch}`, () => {
      expect(REGEX.test(branch)).toBeFalsy();
    });
  });
});
