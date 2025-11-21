import { describe, expect, it } from "vitest";
import { name as workspaceName } from "../../../package.json" with { type: "json" };
import { name } from "../package.json" with { type: "json" };

describe("package.json", () => {
  it("package name should start with workspace prefix", () => {
    expect(workspaceName.split("/")[0]).toBe(name.split("/")[0]);
  });
});
