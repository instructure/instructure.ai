// @vitest-environment node

import { describe, expect, it } from "vitest";
import { name } from "../package.json" with { type: "json" };
import { name as workspaceName } from "../../../package.json" with { type: "json" };

describe("package.json", () => {
  const PREFIX_INDEX = 0;
  const WORKSPACE_PREFIX = workspaceName.split("/")[PREFIX_INDEX];
  const PACKAGE_PREFIX = name.split("/")[PREFIX_INDEX];
  it("package name should start with workspace prefix", () => {
    expect(WORKSPACE_PREFIX).toBe(PACKAGE_PREFIX);
  });
});
