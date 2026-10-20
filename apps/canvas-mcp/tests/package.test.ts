// @vitest-environment node

import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { name } from "../package.json" with { type: "json" };
import { name as workspaceName } from "../../../package.json" with { type: "json" };
import { getLogoSvg } from "@pantoken/plugin-logos";

describe("package.json", () => {
	const PREFIX_INDEX = 0,
		WORKSPACE_PREFIX = workspaceName.split("/")[PREFIX_INDEX],
		PACKAGE_PREFIX = name.split("/")[PREFIX_INDEX];
	it("package name should start with workspace prefix", () => {
		expect(WORKSPACE_PREFIX).toBe(PACKAGE_PREFIX);
	});
});

describe("Canvas MCP crawler directives", () => {
	it("allows unfurling the app without indexing it", async () => {
		const [rootRobots, html] = await Promise.all([
			readFile(new URL("../../../public/robots.txt", import.meta.url), "utf8"),
			readFile(new URL("../index.html", import.meta.url), "utf8"),
		]);
		expect(rootRobots.trim()).toBe("User-agent: *\nDisallow: /\nAllow: /canvas-mcp/");
		expect(html).toMatch(/<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/>/u);
	});
});

describe("Canvas MCP URL unfurling metadata", () => {
	it("publishes Open Graph, Twitter Card, and Schema.org metadata", async () => {
		const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
		expect(html).toContain('property="og:title"');
		expect(html).toContain('property="og:description"');
		expect(html).toContain('property="og:url"');
		expect(html).toContain('property="og:image"\n\t\t\tcontent="https://instructure.ai/canvas-mcp/og.png"');
		expect(html).toContain('name="twitter:card"\n\t\t\tcontent="summary_large_image"');
		expect(html).toContain('name="twitter:image"\n\t\t\tcontent="https://instructure.ai/canvas-mcp/og.png"');

		const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u)?.[1];
		expect(jsonLd).toBeDefined();
		expect(JSON.parse(jsonLd ?? "")).toMatchObject({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			name: "Canvas MCP setup",
			url: "https://instructure.ai/canvas-mcp/",
			image: "https://instructure.ai/canvas-mcp/og.png",
		});
	});

	it("uses the centered Pantoken Canvas logo, specified color rails, and a 1200 by 630 PNG", async () => {
		const [image, svg] = await Promise.all([
			readFile(new URL("../public/og.png", import.meta.url)),
			readFile(new URL("../public/og.svg", import.meta.url), "utf8"),
		]);
		const logo = getLogoSvg("canvas", "horizontal", "reversed")?.replace(/^<svg\b[^>]*>/u, "").replace(/<\/svg>\s*$/u, "");
		const embeddedLogo = svg.match(/<g transform="translate\(300 [\d.]+\) scale\([\d.]+\)">([\s\S]*?)<\/g>\n\t<rect y="540"/u)?.[1];

		expect(image.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
		expect(image.readUInt32BE(16)).toBe(1200);
		expect(image.readUInt32BE(20)).toBe(630);
		expect(svg).toContain('<rect width="1200" height="630" fill="#0b1722"/>');
		expect(svg).toContain('<rect y="540" width="1200" height="30" fill="#c01b1d"/>');
		expect(svg).toContain('<rect y="570" width="1200" height="30" fill="#d31f21"/>');
		expect(svg).toContain('<rect y="600" width="1200" height="30" fill="#e91c1c"/>');
		expect(embeddedLogo).toBe(logo);
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
