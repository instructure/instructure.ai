import { beforeEach, describe, expect, it, vi } from "vitest";

const importSubject = async () => {
  const mod = await import("./formatTs.ts");
  return mod.formatTs as (code: string, fileName?: string) => string;
};

describe("formatTs", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("prints already formatted code unchanged", async () => {
    const formatTs = await importSubject();
    const code = "export const answer = 42;\n";
    const out = formatTs(code);
    expect(out).toBe(code);
  });

  it("normalizes spacing and appends semicolons when missing", async () => {
    const formatTs = await importSubject();
    const code = "const x=1+2";
    const out = formatTs(code);
    expect(out).toContain("const x = 1 + 2;");
  });

  it("preserves line and block comments", async () => {
    const formatTs = await importSubject();
    const code = `// leading comment
/* block comment */
const v=1`;
    const out = formatTs(code);
    expect(out).toMatch(/\/\/ leading comment/);
    expect(out).toMatch(/\/\* block comment \*\//);
    expect(out).toContain("const v = 1;");
  });

  it("emits LF newlines even if input uses CRLF", async () => {
    const formatTs = await importSubject();
    const code = "const a=1;\r\nconst b=2;\r\n";
    const out = formatTs(code);
    expect(out).not.toContain("\r\n");
    expect(out).toContain("\nconst b = 2;");
  });

  it("is deterministic for identical input", async () => {
    const formatTs = await importSubject();
    const code = "const sum=(a:number,b:number)=>a+b";
    const out1 = formatTs(code);
    const out2 = formatTs(code);
    expect(out1).toBe(out2);
  });

  it("accepts custom fileName parameter", async () => {
    const formatTs = await importSubject();
    const code = "export interface Foo{bar:string}";
    const out = formatTs(code, "Foo.ts");
    expect(out).toContain("export interface Foo {");
  });

  it("handles invalid/incomplete TypeScript without throwing", async () => {
    const formatTs = await importSubject();
    const broken = "const =";
    // Should not throw
    const out = formatTs(broken);
    // Printer recovers and emits 'const ;'
    expect(out).toMatch(/^const\s*;/);
  });

  it("formats large multi-line snippet", async () => {
    const formatTs = await importSubject();
    const lines = [
      "export type Id=string",
      "const nums=[1,2,3].map(n=>n*n)",
      "function add(a:number,b:number){return a+b}",
      "class Box<T>{constructor(public value:T){}}",
    ].join("\n");
    const out = formatTs(lines);
    expect(out).toContain("export type Id = string;");
    expect(out).toContain("const nums = [1, 2, 3].map(n => n * n);");
    expect(out).toContain("function add(a: number, b: number) {");
    expect(out).toContain("class Box<T> {");
    expect(out.split("\n").length).toBeGreaterThanOrEqual(4);
  });

  it("wraps and rethrows errors from typescript API", async () => {
    vi.doMock("typescript", () => {
      const mockTS = {
        NewLineKind: { LineFeed: 0 },
        ScriptKind: { TS: 1 },
        ScriptTarget: { Latest: 99 },
        createPrinter: () => ({ printFile: () => "" }),
        createSourceFile: () => {
          throw new Error("Boom");
        },
      };
      return { default: mockTS };
    });
    const formatTs = await importSubject();
    expect(() => formatTs("const x=1")).toThrow(/Error formatting TypeScript code: Error: Boom/);
  });
});
