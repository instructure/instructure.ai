import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChangedEntry } from "../types";
import { writeChangelog } from "./writeChangelog";
import type { Entry } from "../types";

const existsSync = vi.spyOn(fs, "existsSync");
const readFileSync = vi.spyOn(fs, "readFileSync");
const writeFileSync = vi.spyOn(fs, "writeFileSync");

let lastWrittenPath: string | null;
let lastWrittenContent = "";
writeFileSync.mockImplementation((p, c) => {
  lastWrittenPath = String(p);
  if (typeof c === "string") {
    lastWrittenContent = c;
  } else if (Buffer.isBuffer(c)) {
    lastWrittenContent = c.toString("utf8");
  } else if (c instanceof Uint8Array) {
    lastWrittenContent = Buffer.from(c).toString("utf8");
  } else {
    lastWrittenContent = "";
  }
});

function makeChangedEntry(
  uid: string,
  {
    oldChecksum,
    newChecksum,
    oldEntry,
    newEntry,
  }: {
    oldChecksum?: string;
    newChecksum: string;
    oldEntry?: Partial<Entry>;
    newEntry?: Partial<Entry>;
  },
): ChangedEntry {
  const defaultEntry: Entry = {
    compliance: {
      logging: "",
      loggingDescription: "",
      pii: "",
      piiDescription: "",
      regions: "",
      regionsDescription: "",
      retention: "",
    },
    feature: { description: "", name: "" },
    group: "",
    model: {
      data: "",
      dataDescription: "",
      description: "",
      name: "",
      trained: "",
    },
    outputs: {
      guardrails: "",
      human: "",
      humanDescription: "",
      outcomes: "",
      risks: "",
      settings: "",
    },
    permissions: "1",
    revision: "",
    uid,
  };
  return {
    newChecksum,
    newEntry: { ...defaultEntry, ...newEntry },
    oldChecksum,
    oldEntry: oldEntry ? { ...defaultEntry, ...oldEntry } : undefined,
    uid,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  lastWrittenContent = "";
  lastWrittenPath = "";
  existsSync.mockReturnValue(false);
  readFileSync.mockReturnValue("");
  writeFileSync.mockImplementation((p, c) => {
    lastWrittenPath = String(p);
    if (typeof c === "string") {
      lastWrittenContent = c;
    } else if (Buffer.isBuffer(c)) {
      lastWrittenContent = c.toString("utf8");
    } else if (c instanceof Uint8Array) {
      lastWrittenContent = Buffer.from(c).toString("utf8");
    } else {
      lastWrittenContent = "";
    }
  });
});

describe("writeChangelog", () => {
  it("returns undefined when there are no changed entries", () => {
    const result = writeChangelog({
      changedEntries: [],
      changelogPath: "CHANGELOG.md",
      csvSha: "sha123",
      dateStr: "2024-01-01",
    });
    expect(result).toBeUndefined();
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it("writes changelog for new entry showing all keys", () => {
    const entry = makeChangedEntry("uid-new", {
      newChecksum: "newSha",
      newEntry: {
        feature: { description: "Test description", name: "Feature A" },
        model: {
          data: "Training data",
          dataDescription: "Data details",
          description: "Model description",
          name: "Test Model",
          trained: "2024-01-01",
        },
      },
    });
    const result = writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "csvShaX",
      dateStr: "2024-02-02",
    });
    expect(result?.success).toBeTruthy();
    expect(result?.changelog).toContain("## 2024-02-02");
    expect(result?.changelog).toContain("### CSV");
    expect(result?.changelog).toContain("#### SHA");
    expect(result?.changelog).toContain("```diff\ncsvShaX\n```");
    expect(result?.changelog).toContain("### uid-new");
    expect(result?.changelog).toContain("#### feature.name");
    expect(result?.changelog).toContain("#### model");
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(lastWrittenContent.startsWith("# Changelog")).toBeTruthy();
  });

  it("includes diffs for changed entry with nested objects", () => {
    const entry = makeChangedEntry("uid-diff", {
      newChecksum: "newC",
      newEntry: {
        compliance: {
          logging: "enabled",
          loggingDescription: "log desc",
          pii: "filtered",
          piiDescription: "pii desc",
          regions: "US",
          regionsDescription: "region desc",
          retention: "30d",
        },
        feature: { description: "Test", name: "Feature" },
        model: {
          data: "value",
          dataDescription: "added data",
          description: "desc",
          name: "Model",
          trained: "2024",
        },
        outputs: {
          guardrails: "yes",
          human: "yes",
          humanDescription: "human desc",
          outcomes: "outcomes",
          risks: "risks",
          settings: "per-course",
        },
      },
      oldChecksum: "oldC",
      oldEntry: {
        compliance: {
          logging: "enabled",
          loggingDescription: "log desc",
          pii: "filtered",
          piiDescription: "pii desc",
          regions: "US",
          regionsDescription: "region desc",
          retention: "30d",
        },
        feature: { description: "Test", name: "Feature" },
        model: {
          data: "",
          dataDescription: "",
          description: "desc",
          name: "Model",
          trained: "2023",
        },
        outputs: {
          guardrails: "yes",
          human: "yes",
          humanDescription: "human desc",
          outcomes: "outcomes",
          risks: "risks",
          settings: "per-course",
        },
      },
    });
    const result = writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "csvShaY",
      dateStr: "2024-03-03",
    });
    expect(result?.success).toBeTruthy();
    const c = result?.changelog ?? "";
    expect(c).toContain("### uid-diff");
    expect(c).toContain("```diff");
    expect(c).toContain("model.dataDescription");
    expect(c).toContain("model.trained");
  });

  it("unchanged entry only shows SHA section", () => {
    const obj = {
      feature: { description: "Description", name: "Same" },
      model: {
        data: "data",
        dataDescription: "data desc",
        description: "desc",
        name: "Model",
        trained: "2024",
      },
    };
    const entry = makeChangedEntry("uid-same", {
      newChecksum: "newSha",
      newEntry: obj,
      oldChecksum: "oldSha",
      oldEntry: obj,
    });
    const result = writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "csvShaZ",
      dateStr: "2024-04-04",
    });
    const c = result?.changelog ?? "";
    expect(c).toContain("### uid-same");
    expect(c).not.toMatch(/#### feature\.name:/);
    expect(c).not.toMatch(/#### model\./);
  });

  it("prepends header when missing in existing file", () => {
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue("Previous content");
    const entry = makeChangedEntry("uid1", {
      newChecksum: "nc1",
      newEntry: { feature: { description: "New 1", name: "N1" } },
    });
    writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "sha5",
      dateStr: "2024-05-05",
    });
    expect(writeFileSync).toHaveBeenCalled();
    expect(lastWrittenContent.startsWith("# Changelog")).toBeTruthy();
    expect(lastWrittenContent).toContain("## 2024-05-05");
    expect(lastWrittenContent).toContain("Previous content");
    const idxNew = lastWrittenContent.indexOf("## 2024-05-05");
    const idxPrev = lastWrittenContent.indexOf("Previous content");
    expect(idxNew).toBeLessThan(idxPrev);
  });

  it("inserts new section after existing header", () => {
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue("# Changelog\n\n## 2024-01-01\n\nOld section");
    const entry = makeChangedEntry("uidX", {
      newChecksum: "ncX",
      newEntry: { feature: { description: "New X", name: "NX" } },
    });
    writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "sha6",
      dateStr: "2024-06-06",
    });
    const content = lastWrittenContent;
    const headerIdx = content.indexOf("# Changelog");
    const newIdx = content.indexOf("## 2024-06-06");
    const oldIdx = content.indexOf("## 2024-01-01");
    expect(headerIdx).toBe(0);
    expect(newIdx).toBeGreaterThan(headerIdx);
    expect(oldIdx).toBeGreaterThan(newIdx);
  });

  it("handles multiple entries (new + changed)", () => {
    const e1 = makeChangedEntry("uidA", {
      newChecksum: "shaA",
      newEntry: { feature: { description: "A Desc", name: "A" } },
    });
    const e2 = makeChangedEntry("uidB", {
      newChecksum: "newB",
      newEntry: { feature: { description: "desc", name: "B2" } },
      oldChecksum: "oldB",
      oldEntry: { feature: { description: "desc", name: "B" } },
    });
    const result = writeChangelog({
      changedEntries: [e1, e2],
      changelogPath: "CHANGELOG.md",
      csvSha: "sha7",
      dateStr: "2024-07-07",
    });
    const c = result?.changelog ?? "";
    expect(c).toMatch(/### uidA/);
    expect(c).toMatch(/### uidB/);
    expect(c).toContain("#### feature.name");
  });

  it("captures added property diff (old undefined)", () => {
    const entry = makeChangedEntry("uidAdd", {
      newChecksum: "newAdd",
      newEntry: {
        feature: { description: "New description", name: "Feature" },
      },
      oldChecksum: "oldAdd",
      oldEntry: {
        feature: { description: "", name: "Feature" },
      },
    });
    const result = writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "sha8",
      dateStr: "2024-08-08",
    });
    expect(result?.changelog).toContain("#### feature.description");
    expect(result?.changelog).toContain('+ "New description"');
  });

  it("returns success false on write error", () => {
    writeFileSync.mockImplementation(() => {
      throw new Error("disk full");
    });
    const entry = makeChangedEntry("uidErr", {
      newChecksum: "shaErr",
      newEntry: { feature: { description: "err desc", name: "Err" } },
    });
    const result = writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "sha9",
      dateStr: "2024-09-09",
    });
    expect(result?.success).toBeFalsy();
    expect(result?.error).toBeInstanceOf(Error);
  });

  it("changelog output includes csv SHA", () => {
    const entry = makeChangedEntry("uidSha", {
      newChecksum: "newSha",
      newEntry: { feature: { description: "Description", name: "Feature" } },
    });
    const result = writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "csvGlobalSha",
      dateStr: "2024-10-10",
    });
    expect(result).toBeDefined();
    expect(result?.changelog).toContain("#### SHA");
    expect(result?.changelog).toContain("```diff\ncsvGlobalSha\n```");
  });

  it("writes changelog", () => {
    const entry = makeChangedEntry("uid-new", {
      newChecksum: "newSha",
      newEntry: {
        feature: { description: "Description", name: "Feature A" },
      },
    });
    writeChangelog({
      changedEntries: [entry],
      changelogPath: "CHANGELOG.md",
      csvSha: "csvShaX",
      dateStr: "2024-02-02",
    });
    expect(lastWrittenPath).toMatch(/CHANGELOG\.md$/);
    expect(lastWrittenContent.length).toBeGreaterThan(0);
  });
});
