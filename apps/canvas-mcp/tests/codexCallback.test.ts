// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { clientDefinition } from "../src/clients";
import { CallbackCache, codexCallbackUri } from "../src/oauth/codex-callback";

const server = "https://example.maple.us-east-1.core.inseng.io/mcp",
	base = "http://localhost:8081/callback";
describe("Codex callback derivation from pinned source", () => {
	it("matches an independently computed SHA-256 vector (not a real Codex run)", async () => {
		expect(clientDefinition("codex").facts.redirectUri).toMatchObject({
			kind: "computed",
			mode: "per-server",
		});
		expect(await codexCallbackUri(server, base, "per-server")).toBe(base + "/hvafq6QNzdo1");
		expect(await codexCallbackUri(server + "#fragment", base, "per-server")).toBe(
			base + "/hvafq6QNzdo1",
		);
		expect(await codexCallbackUri(server, base + "/hvafq6QNzdo1", "per-server")).toBe(
			base + "/hvafq6QNzdo1",
		);
		expect(await codexCallbackUri(server, base, "shared")).toBe(base);
	});
	it("distinguishes beta, region, path and query and normalizes the URL", async () => {
		const ordinary = await codexCallbackUri(server, base, "per-server");
		for (const changed of [
			server.replace(".maple.", ".maple-beta."),
			server.replace("us-east-1", "us-west-2"),
			server + "/",
			server + "?a=1",
		])
			expect(await codexCallbackUri(changed, base, "per-server")).not.toBe(ordinary);
		expect(
			await codexCallbackUri(
				"https://EXAMPLE.maple.us-east-1.core.inseng.io:443/mcp",
				base,
				"per-server",
			),
		).toBe(ordinary);
	});
	it("keeps pending and failed values non-copyable and never returns another URL's result", async () => {
		const cache = new CallbackCache(),
			notify = vi.fn();
		let finishA!: (value: string) => void, finishB!: (value: string) => void;
		const a = vi.fn(
			() =>
				new Promise<string>((resolve) => {
					finishA = resolve;
				}),
		);
		const b = vi.fn(
			() =>
				new Promise<string>((resolve) => {
					finishB = resolve;
				}),
		);
		expect(cache.request("https://a.example/mcp", base, "per-server", notify, a).status).toBe(
			"pending",
		);
		expect(cache.request("https://b.example/mcp", base, "per-server", notify, b).status).toBe(
			"pending",
		);
		finishB("b");
		await Promise.resolve();
		await Promise.resolve();
		finishA("a");
		await Promise.resolve();
		await Promise.resolve();
		expect(cache.request("https://b.example/mcp", base, "per-server", notify, b)).toEqual({
			status: "ready",
			uri: "b",
		});
		expect(b).toHaveBeenCalledTimes(1);
		cache.request("https://error.example/mcp", base, "per-server", notify, async () => {
			throw new Error("digest unavailable");
		});
		await Promise.resolve();
		await Promise.resolve();
		expect(cache.request("https://error.example/mcp", base, "per-server", notify)).toEqual({
			status: "error",
		});
	});
});
