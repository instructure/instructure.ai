// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { CLIENTS, clientDefinition, normalizeKeyType } from "../src/clients";
import { resolveKeySettings } from "../src/admin/key-settings-model";
import { renderPage } from "../src/page";
import { readState } from "../src/state";
import { connectionReadiness } from "../src/setup";
import { renderHelp } from "../src/help/render";
import { RULESYNC_COMMIT, RULESYNC_TARGETS, RULESYNC_VERSION } from "../src/rulesyncTargets";
import { source } from "../src/clients/rulesync-research";

const configured = "domain=example.instructure.com&region=us-east-1&clientId=12345000000000001";

describe("research evidence URLs", () => {
	it.each([
		"https://github.com/owner/repo/blob/abc123/file.ts",
		"https://GITHUB.COM/owner/repo/blob/abc123/file.ts",
	])("recognizes the exact HTTPS GitHub host: %s", (url) => {
		expect(source("Example", url)).toMatchObject({ method: "source", version: "abc123", url });
	});

	it.each([
		"https://vendor.example/docs/github.com/owner/repo/blob/abc123/file.ts",
		"https://github.com.example/owner/repo/blob/abc123/file.ts",
		"https://notgithub.com/owner/repo/blob/abc123/file.ts",
		"https://github.com@vendor.example/owner/repo/blob/abc123/file.ts",
		"https://vendor.example/?url=https://github.com/owner/repo/blob/abc123/file.ts",
		"https://vendor.example/#https://github.com/owner/repo/blob/abc123/file.ts",
		"http://github.com/owner/repo/blob/abc123/file.ts",
	])("does not classify a non-HTTPS-GitHub URL as source evidence: %s", (url) => {
		const evidence = source("Example", url);
		expect(evidence.method).toBe("vendor-doc");
		expect(evidence).not.toHaveProperty("version");
	});

	it.each(["main", "main-v2", "master"])(
		"does not record mutable branch %s as a version",
		(branch) => {
			expect(
				source("Example", `https://github.com/owner/repo/blob/${branch}/file.ts`),
			).not.toHaveProperty("version");
		},
	);

	it("does not extract a version from a query parameter on GitHub", () => {
		expect(
			source("Example", "https://github.com/owner/repo?path=/blob/abc123/file.ts"),
		).not.toHaveProperty("version");
	});

	it("rejects malformed evidence URLs", () => {
		expect(() => source("Example", "not a URL")).toThrow(TypeError);
	});
});

describe("researched Rulesync clients", () => {
	it("shows detailed admin issue alerts for blockers without an explicit status", () => {
		for (const id of ["kimi-code", "vibe", "deepagents", "copilot"] as const) {
			const client = clientDefinition(id);
			const state = readState(`?client=${id}&${configured}`, null);
			document.body.innerHTML = renderPage(state, "admin", state.domain, false);
			const alert = document.querySelector('.known-issue-alert[role="alert"]');
			expect(alert?.classList.contains("instui-alert"), id).toBe(true);
			expect(alert?.classList.contains("-color-danger"), id).toBe(true);
			const reason =
				client.blocker?.reason ??
				(client.status?.kind === "known-issue" ? client.status.reason : "");
			expect(alert?.textContent, id).toContain(reason);
			expect(alert?.nextElementSibling?.classList.contains("details-panel"), id).toBe(true);
			expect(document.querySelector(".lifecycle-notice"), id).toBeNull();
		}
	});
	it("uses amber admin lifecycle alerts without turning migration notices into blockers", () => {
		for (const id of ["continue", "roo", "tabnine", "kiro", "rovodev"] as const) {
			const client = clientDefinition(id);
			const state = readState(`?client=${id}&${configured}`, null);
			document.body.innerHTML = renderPage(state, "admin", state.domain, true);
			const notice = document.querySelector('.lifecycle-notice[role="status"]');
			expect(notice?.classList.contains("instui-alert"), id).toBe(true);
			expect(notice?.classList.contains("-color-warning"), id).toBe(true);
			expect(notice?.textContent, id).toContain(client.lifecycleNotices?.personal?.message);
			expect(notice?.querySelector("a")?.href, id).toBe(client.lifecycleNotices?.personal?.url);
			expect(document.querySelector(".known-issue-alert"), id).toBeNull();
			expect(document.querySelectorAll(".instructions-column"), id).toHaveLength(1);
			expect(notice?.nextElementSibling?.classList.contains("details-panel"), id).toBe(true);
			expect(connectionReadiness(state).blocked === true, id).toBe(
				id === "continue" || id === "roo",
			);
		}
	});
	it("blocks end-of-life clients while retaining usable legacy and pending-migration targets", () => {
		for (const id of ["continue", "roo"] as const) {
			const client = clientDefinition(id);
			expect(client.status?.kind).toBe("known-issue");
			expect(connectionReadiness(readState(`?client=${id}&${configured}`, null))).toMatchObject({
				ready: false,
				blocked: true,
			});
		}
		expect(clientDefinition("continue").installModes).toEqual([]);
		expect(clientDefinition("continue").blocker?.evidence[0]?.url).toContain(
			"5522c6f44ca0ac3528b37244818fbfa39b5af470/README.md",
		);
		for (const id of ["tabnine", "kiro", "rovodev"] as const) {
			expect(connectionReadiness(readState(`?client=${id}&${configured}`, null)).blocked).not.toBe(
				true,
			);
			expect(clientDefinition(id).research?.sources.length).toBeGreaterThan(1);
		}
		expect(clientDefinition("tabnine").name).toBe("Tabnine CLI (Legacy)");
		expect(clientDefinition("kiro").name).toContain("deprecated alias");
		document.body.innerHTML = renderHelp("clients");
		const item = document.querySelector('[data-other-client="continue"]');
		expect(item?.textContent).toBe("Continue Known issue");
		expect(item?.querySelector("p, a, details, table")).toBeNull();
	});
	it("tracks v40.2 MCP membership without adding non-MCP tools or a duplicate legacy client", () => {
		expect(RULESYNC_VERSION).toBe("40.2.0");
		expect(RULESYNC_COMMIT).toBe("4094b14918f6d4bb418447df41c7fa638f31939a");
		const ids = RULESYNC_TARGETS.map(({ id }) => id);
		expect(ids).toHaveLength(62);
		expect(new Set(ids).size).toBe(62);
		expect(ids).toContain("openclaw");
		expect(ids).toContain("firebender");
		expect(ids).toContain("xum");
		expect(ids).not.toContain("lettacode");
		expect(ids).not.toContain("claudecode-legacy");
		for (const id of ["continue", "roo", "kiro", "tabnine", "rovodev"] as const) {
			expect(ids, id).toContain(id);
		}
	});
	it("records documented remote OAuth support while leaving undocumented Canvas setup facts unverified", () => {
		const firebender = clientDefinition("firebender");
		expect(firebender.name).toBe("Firebender");
		expect(firebender.installModes).toEqual(["personal"]);
		expect(firebender.facts.remoteHttp.value).toBe("yes");
		expect(firebender.facts.staticClientId.value).toBe("unknown");
		expect(firebender.facts.keyTypes.public.value).toBe("unknown");
		expect(firebender.facts.keyTypes.private.value).toBe("unknown");
		expect(firebender.facts.redirectUri.kind).toBe("unverified");
		expect(firebender.research?.installSupport.enterprise.value).toBe("unknown");
		expect(firebender.research?.checkedAt).toBe("2026-10-23");
		expect(firebender.research?.sources.map(({ url }) => url)).toEqual(
			expect.arrayContaining([
				"https://docs.firebender.com/context/mcp/overview.md",
				"https://docs.firebender.com/context/mcp/revenuecat.md",
				"https://docs.firebender.com/api-reference/syntax.md",
			]),
		);
		expect(firebender.setupNote).toContain("callback URI");

		const xum = clientDefinition("xum");
		expect(xum.name).toBe("Xum");
		expect(xum.installModes).toEqual(["personal"]);
		expect(xum.facts.remoteHttp.value).toBe("yes");
		expect(xum.facts.staticClientId.value).toBe("unknown");
		expect(xum.facts.keyTypes.public.value).toBe("unknown");
		expect(xum.facts.keyTypes.private.value).toBe("unknown");
		expect(xum.facts.redirectUri.kind).toBe("unverified");
		expect(xum.research?.installSupport.enterprise.value).toBe("unknown");
		expect(xum.research?.checkedAt).toBe("2026-10-23");
		expect(xum.setupNote).toContain("over stdio");
		expect(xum.setupNote).toContain("OAuth sign-in");
	});
	it("distinguishes OpenClaw Gateway callbacks from shared login and unknown Canvas key support", () => {
		const client = clientDefinition("openclaw");
		expect(client.installModes).toEqual(["personal", "enterprise"]);
		expect(client.facts.remoteHttp.value).toBe("yes");
		expect(client.facts.staticClientId.value).toBe("unknown");
		expect(client.facts.keyTypes.public.value).toBe("unknown");
		expect(client.facts.keyTypes.private.value).toBe("unknown");
		const personal = resolveKeySettings(client, readState("?client=openclaw", null));
		expect(personal.redirect.copyable).toBe(false);
		expect(personal.redirect.text).toContain("loopback");
		const enterprise = resolveKeySettings(
			client,
			readState("?client=openclaw&install=enterprise", null),
		);
		expect(enterprise.redirect.copyable).toBe(false);
		expect(enterprise.redirect.text).toContain("<gateway.publicOrigin>/oauth/mcp/callback");
		const state = readState(`?client=openclaw&${configured}`, null);
		document.body.innerHTML = renderPage(state, "user", state.domain, true);
		expect(
			document.querySelector('[data-guide-step="provider-configure"] a')?.getAttribute("href"),
		).toBe(client.configurationUrl);
		document.body.innerHTML = renderHelp("clients");
		expect(document.querySelector('[data-other-client="openclaw"]')?.textContent).toBe(
			"OpenClaw Untested",
		);
	});
	it("covers every Other target with dated sources without adding bespoke guides or validation", () => {
		const clients = CLIENTS.filter(({ group, id }) => group === "Other" && id !== "generic");
		expect(clients).toHaveLength(58);
		for (const client of clients) {
			expect(client.research?.checkedAt, client.id).toBe(
				["firebender", "xum"].includes(client.id) ? "2026-10-23" : "2026-10-20",
			);
			expect(client.research?.sources.length, client.id).toBeGreaterThan(0);
			expect(client.guides, client.id).toBeUndefined();
			expect(client.status?.kind, client.id).not.toBe("validated");
			for (const mode of client.installModes) {
				expect(client.research?.installSupport[mode].value, client.id).toBe("yes");
			}
		}
	});
	it("populates setup output while keeping Help limited to status labels", () => {
		const state = readState(`?client=cursor&${configured}`, null);
		const client = clientDefinition(state.client);
		expect(client.installModes).toEqual(["personal", "enterprise"]);
		for (const mode of ["admin", "user"] as const) {
			document.body.innerHTML = renderPage(state, mode, state.domain, true);
			expect(document.querySelector(".client-configuration-facts")).toBeNull();
			if (mode === "admin")
				expect(document.querySelector("#enterprise-install-input")).not.toBeNull();
			expect(document.querySelector(".details-panel")?.textContent).toContain(
				"http://localhost:8787/callback",
			);
		}
		document.body.innerHTML = renderHelp("clients");
		const item = document.querySelector('[data-other-client="cursor"]')!;
		expect(item.textContent).toBe("Cursor Untested");
		expect(item.querySelector("details, table, a, p")).toBeNull();
		expect(document.body.textContent).not.toContain("Documentation reviewed");
		expect(document.querySelectorAll(".help-matrix tbody td p")).toHaveLength(0);
	});
	it("links configuration documentation from the shared client step", () => {
		for (const id of ["cursor", "cline", "kilo"] as const) {
			const state = readState(`?client=${id}&${configured}`, null);
			document.body.innerHTML = renderPage(state, "user", state.domain, true);
			const step = document.querySelector('[data-guide-step="provider-configure"]')!;
			expect(step.querySelector("h3")?.textContent).toBe("Configure your MCP client");
			expect(step.querySelector("a")?.href).toBe(clientDefinition(id).configurationUrl);
			expect(step.querySelector("a")?.target).toBe("_blank");
		}
	});
	it("keeps Kiro CLI secrets distinct from IDE support and normalizes stale private preferences", () => {
		expect(clientDefinition("kiro-cli").facts.keyTypes.private.value).toBe("yes");
		expect(clientDefinition("kiro-ide").facts.keyTypes.private.value).toBe("no");
		expect(normalizeKeyType("kiro-ide", "private")).toBe("public");
		expect(readState("?client=kiro-ide&key=private", null).key).toBe("public");
		const state = readState(`?client=kiro-ide&key=private&${configured}`, null);
		document.body.innerHTML = renderPage(state, "admin", state.domain, true);
		expect(document.querySelector<HTMLInputElement>("#private-key-input")?.disabled).toBe(true);
		expect(document.querySelector<HTMLInputElement>("#private-key-input")?.checked).toBe(false);
		expect(
			[...document.querySelectorAll(".settings-table tr")].find(
				(row) => row.querySelector("th")?.textContent === "Client Type",
			)?.textContent,
		).toBe("Client TypePublic");
	});
	it("shows pinning requirements next to configurable callbacks and does not invent unknown URIs", () => {
		const goose = readState(`?client=goose&${configured}`, null);
		expect(resolveKeySettings(clientDefinition("goose"), goose).redirect).toMatchObject({
			text: "http://127.0.0.1:8081/oauth_callback",
			copyable: true,
		});
		for (const mode of ["admin", "user"] as const) {
			expect(renderPage(goose, mode, goose.domain, true)).toContain(
				"GOOSE_OAUTH_CALLBACK_PORT=8081",
			);
		}
		const factory = readState("?client=factorydroid", null);
		expect(resolveKeySettings(clientDefinition("factorydroid"), factory).redirect.copyable).toBe(
			false,
		);
		const unknown = readState("?client=trae", null);
		expect(resolveKeySettings(clientDefinition("trae"), unknown).redirect.copyable).toBe(false);
		expect(clientDefinition("trae").research?.installSupport.enterprise.value).toBe("unknown");
	});
	it("does not use Amp's local callback for hosted enterprise definitions", () => {
		const state = readState("?client=amp&install=enterprise", null);
		const settings = resolveKeySettings(clientDefinition("amp"), state);
		expect(settings.redirect.copyable).toBe(false);
		expect(settings.redirect.text).toContain("hosted callback");
	});
	it("registers Cline's fallback URIs and prevents known OAuth incompatibilities from connecting", () => {
		const cline = clientDefinition("cline").facts.redirectUri;
		expect(cline.kind).toBe("fixed");
		if (cline.kind === "fixed") {
			expect(cline.uris).toHaveLength(6);
			expect(cline.uris).toContain("http://127.0.0.1:1461/mcp/oauth/callback");
		}
		for (const id of ["vibe", "vibe-plugin", "deepagents", "kimi-code"] as const) {
			const state = readState(`?client=${id}&${configured}`, null);
			expect(connectionReadiness(state)).toMatchObject({ ready: false, blocked: true });
		}
		expect(clientDefinition("vibe").facts.keyTypes.public.value).toBe("no");
		expect(clientDefinition("vibe").facts.keyTypes.private.value).toBe("no");
	});
});
