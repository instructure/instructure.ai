import { describe, expect, it } from "vitest";
import { SCOPE_MANIFEST, scopeManifestReady } from "../src/scopes";

describe("customer key scopes", () => {
	it("contains the baseline, excludes limited access and has unique valid lines", () => {
		const lines = SCOPE_MANIFEST.split("\n");
		expect(lines).toContain("https://sso.canvaslms.com/all-client-scopes");
		expect(lines).toContain("url:POST|/api/v1/oauth2/introspect");
		expect(lines).not.toContain("https://sso.canvaslms.com/mcp-limited");
		expect(new Set(lines).size).toBe(lines.length);
		for (const line of lines)
			expect(line).toMatch(
				/^(https:\/\/sso\.canvaslms\.com\/all-client-scopes|url:(GET|POST|PUT|PATCH|DELETE)\|\/\S+)$/u,
			);
	});
	it("does not treat an unreviewed manifest as production ready", () => {
		expect(scopeManifestReady()).toBe(false);
	});
});
