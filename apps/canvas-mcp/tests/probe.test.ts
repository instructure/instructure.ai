// @vitest-environment node
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createProbe } from "../scripts/probe/server.mts";

const origin = "http://127.0.0.1:8765",
	redirect = "http://localhost:8081/callback";
const verifier = "synthetic-verifier-1234567890123456789012345678901234567890";
const challenge = createHash("sha256").update(verifier).digest("base64url");
function authorize(probe: ReturnType<typeof createProbe>, values: Record<string, string> = {}) {
	return probe.handle(
		new Request(
			origin +
				"/authorize?" +
				new URLSearchParams({
					client_id: "probe-client",
					redirect_uri: redirect,
					response_type: "code",
					code_challenge: challenge,
					code_challenge_method: "S256",
					state: "synthetic-state",
					...values,
				}),
		),
	);
}
function token(
	probe: ReturnType<typeof createProbe>,
	values: Record<string, string>,
	headers: Record<string, string> = {},
) {
	return probe.handle(
		new Request(origin + "/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded", ...headers },
			body: new URLSearchParams({ client_id: "probe-client", ...values }),
		}),
	);
}
describe("loopback OAuth probe", () => {
	it("discovers, exercises PKCE/static credentials, initializes MCP and refreshes", async () => {
		const probe = createProbe({ origin, redirectUris: [redirect] });
		const denied = await probe.handle(new Request(origin + "/mcp"));
		expect(denied.status).toBe(401);
		expect(denied.headers.get("WWW-Authenticate")).toContain("oauth-protected-resource/mcp");
		const discovery = await probe.handle(
			new Request(origin + "/.well-known/oauth-authorization-server"),
		);
		expect(await discovery.json()).toMatchObject({
			issuer: origin,
			code_challenge_methods_supported: ["S256"],
		});
		const auth = await authorize(probe),
			callback = new URL(auth.headers.get("Location")!);
		expect(callback.searchParams.get("state")).toBe("synthetic-state");
		const exchange = await token(probe, {
			grant_type: "authorization_code",
			redirect_uri: redirect,
			code: callback.searchParams.get("code")!,
			code_verifier: verifier,
		});
		expect(exchange.status).toBe(200);
		const credentials = await exchange.json();
		const initialized = await probe.handle(
			new Request(origin + "/mcp", {
				method: "POST",
				headers: { Authorization: `Bearer ${credentials.access_token}` },
				body: JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					method: "initialize",
					params: { protocolVersion: "2025-11-25" },
				}),
			}),
		);
		expect(await initialized.json()).toMatchObject({
			jsonrpc: "2.0",
			id: 1,
			result: { serverInfo: { name: "canvas-oauth-probe" } },
		});
		expect(
			(
				await token(probe, {
					grant_type: "refresh_token",
					refresh_token: credentials.refresh_token,
				})
			).status,
		).toBe(200);
		expect(
			(
				await token(probe, {
					grant_type: "refresh_token",
					refresh_token: credentials.refresh_token,
				})
			).status,
		).toBe(400);
		const captured = JSON.stringify(probe.observations);
		for (const secret of [
			verifier,
			credentials.access_token,
			credentials.refresh_token,
			"synthetic-state",
			callback.searchParams.get("code")!,
		])
			expect(captured).not.toContain(secret);
	});
	it.each(["client_secret_post", "client_secret_basic"] as const)(
		"captures %s without storing the secret",
		async (method) => {
			const probe = createProbe({ origin, redirectUris: [redirect], authMethod: method });
			const auth = await authorize(probe),
				code = new URL(auth.headers.get("Location")!).searchParams.get("code")!;
			const values = {
				grant_type: "authorization_code",
				code,
				redirect_uri: redirect,
				code_verifier: verifier,
				...(method === "client_secret_post" ? { client_secret: "probe-secret" } : {}),
			};
			const headers =
				method === "client_secret_basic"
					? {
							Authorization: "Basic " + Buffer.from("probe-client:probe-secret").toString("base64"),
						}
					: {};
			expect((await token(probe, values, headers)).status).toBe(200);
			expect(probe.observations.at(-1)).toMatchObject({ event: "token", authMethod: method });
			expect(JSON.stringify(probe.observations)).not.toContain("probe-secret");
		},
	);
	it("rejects callback abuse, wrong verifiers and expired or reused codes", async () => {
		let now = 0;
		const probe = createProbe({ origin, redirectUris: [redirect], now: () => now });
		expect(
			(await authorize(probe, { redirect_uri: "https://untrusted.example/callback" })).status,
		).toBe(400);
		expect((await authorize(probe, { code_challenge_method: "plain" })).status).toBe(400);
		const code = new URL((await authorize(probe)).headers.get("Location")!).searchParams.get(
			"code",
		)!;
		expect(
			(
				await token(probe, {
					grant_type: "authorization_code",
					code,
					redirect_uri: redirect,
					code_verifier: "wrong",
				})
			).status,
		).toBe(400);
		expect(
			(
				await token(probe, {
					grant_type: "authorization_code",
					code,
					redirect_uri: redirect,
					code_verifier: verifier,
				})
			).status,
		).toBe(400);
		const expired = new URL((await authorize(probe)).headers.get("Location")!).searchParams.get(
			"code",
		)!;
		now = 60_001;
		expect(
			(
				await token(probe, {
					grant_type: "authorization_code",
					code: expired,
					redirect_uri: redirect,
					code_verifier: verifier,
				})
			).status,
		).toBe(400);
	});
	it("supports a separate DCR scenario and requires loopback endpoints", async () => {
		const probe = createProbe({ origin, redirectUris: [redirect], registration: true });
		const registered = await probe.handle(
			new Request(origin + "/register", {
				method: "POST",
				body: JSON.stringify({ redirect_uris: [redirect], token_endpoint_auth_method: "none" }),
			}),
		);
		expect(registered.status).toBe(201);
		expect(probe.observations).toEqual([{ event: "register", authMethod: "none" }]);
		expect(() =>
			createProbe({ origin: "https://public.example", redirectUris: [redirect] }),
		).toThrow("loopback");
		expect(() =>
			createProbe({ origin, redirectUris: ["https://public.example/callback"] }),
		).toThrow("loopback");
	});
});
