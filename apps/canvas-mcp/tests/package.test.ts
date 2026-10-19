// @vitest-environment node

import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { name } from "../package.json" with { type: "json" };
import { name as workspaceName } from "../../../package.json" with { type: "json" };

describe("package.json", () => {
	const PREFIX_INDEX = 0,
		WORKSPACE_PREFIX = workspaceName.split("/")[PREFIX_INDEX],
		PACKAGE_PREFIX = name.split("/")[PREFIX_INDEX];
	it("package name should start with workspace prefix", () => {
		expect(WORKSPACE_PREFIX).toBe(PACKAGE_PREFIX);
	});
});

describe("Canvas MCP crawler directives", () => {
	it("disallows crawling and marks the app as noindex and nofollow", async () => {
		const [robots, rootRobots, html] = await Promise.all([
			readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
			readFile(new URL("../../../public/robots.txt", import.meta.url), "utf8"),
			readFile(new URL("../index.html", import.meta.url), "utf8"),
		]);
		for (const directives of [robots, rootRobots])
			expect(directives.trim()).toBe("User-agent: *\nDisallow: /");
		expect(html).toMatch(/<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/>/u);
	});
});

describe("Canvas MCP favicon", () => {
	it("uses the Instructure three-dot favicon in the SPA", async () => {
		const [html, favicon] = await Promise.all([
			readFile(new URL("../index.html", import.meta.url), "utf8"),
			readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
		]);
		const faviconLink = /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/>/;

		expect(html).toMatch(faviconLink);
		expect(favicon).toContain('fill="#e41e25"');
		expect(favicon).toContain('fill="#088744"');
		expect(favicon).toContain('fill="#2c7bb9"');
	});
});
