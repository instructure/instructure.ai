import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

export type Observation = {
	event: "authorize" | "token" | "refresh" | "register" | "initialize";
	redirectUri?: string;
	pkce?: boolean;
	resource?: boolean;
	authMethod?: "none" | "client_secret_post" | "client_secret_basic";
};
export interface ProbeOptions {
	origin: string;
	redirectUris: string[];
	authMethod?: "none" | "client_secret_post" | "client_secret_basic";
	registration?: boolean;
	now?: () => number;
}
export function createProbe(options: ProbeOptions) {
	const origin = new URL(options.origin);
	if (origin.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname))
		throw new Error("Probe must use HTTP loopback");
	const redirectUris = new Set(
		options.redirectUris.map((value) => {
			const uri = new URL(value);
			if (
				uri.protocol !== "http:" ||
				!["127.0.0.1", "localhost", "[::1]"].includes(uri.hostname) ||
				uri.username ||
				uri.password ||
				uri.hash
			)
				throw new Error("Only configured loopback callbacks are permitted");
			return uri.href;
		}),
	);
	const authMethod = options.authMethod ?? "none",
		now = options.now ?? Date.now;
	const codes = new Map<
		string,
		{ redirectUri: string; challenge: string | null; expires: number }
	>();
	const refresh = new Set<string>(),
		tokens = new Map<string, number>(),
		observations: Observation[] = [];
	const json = (value: unknown, status = 200, headers: Record<string, string> = {}) =>
		new Response(JSON.stringify(value), {
			status,
			headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
		});
	const error = (value: string, status = 400) => json({ error: value }, status);
	function issueTokens() {
		const token = randomUUID(),
			renewal = randomUUID();
		tokens.set(token, now() + 60_000);
		refresh.add(renewal);
		return json({
			access_token: token,
			refresh_token: renewal,
			token_type: "Bearer",
			expires_in: 60,
		});
	}
	async function handle(request: Request): Promise<Response> {
		const url = new URL(request.url),
			path = url.pathname;
		if (
			request.method === "GET" &&
			[
				"/.well-known/oauth-protected-resource",
				"/.well-known/oauth-protected-resource/mcp",
			].includes(path)
		)
			return json({
				resource: origin.origin + "/mcp",
				authorization_servers: [origin.origin],
				scopes_supported: ["probe"],
				bearer_methods_supported: ["header"],
			});
		if (request.method === "GET" && path === "/.well-known/oauth-authorization-server")
			return json({
				issuer: origin.origin,
				authorization_endpoint: origin.origin + "/authorize",
				token_endpoint: origin.origin + "/token",
				...(options.registration ? { registration_endpoint: origin.origin + "/register" } : {}),
				response_types_supported: ["code"],
				grant_types_supported: ["authorization_code", "refresh_token"],
				code_challenge_methods_supported: ["S256"],
				token_endpoint_auth_methods_supported: [authMethod],
			});
		if (path === "/authorize" && request.method === "GET") {
			const params = url.searchParams,
				redirectUri = params.get("redirect_uri") ?? "";
			if (
				!redirectUris.has(redirectUri) ||
				params.get("client_id") !== "probe-client" ||
				params.get("response_type") !== "code"
			)
				return error("invalid_request");
			const challenge = params.get("code_challenge");
			if (
				(authMethod === "none" && !challenge) ||
				(challenge && params.get("code_challenge_method") !== "S256")
			)
				return error("invalid_request");
			const code = randomUUID();
			codes.set(code, { redirectUri, challenge, expires: now() + 60_000 });
			const callback = new URL(redirectUri);
			callback.searchParams.set("code", code);
			if (params.has("state")) callback.searchParams.set("state", params.get("state")!);
			observations.push({
				event: "authorize",
				redirectUri,
				pkce: Boolean(challenge),
				resource: params.has("resource"),
			});
			return new Response(null, {
				status: 302,
				headers: { Location: callback.href, "Cache-Control": "no-store" },
			});
		}
		if (request.method === "POST" && path === "/register" && options.registration) {
			let body: { redirect_uris?: string[]; token_endpoint_auth_method?: string };
			try {
				body = await request.json();
			} catch {
				return error("invalid_client_metadata");
			}
			if (
				!Array.isArray(body.redirect_uris) ||
				!body.redirect_uris.length ||
				body.redirect_uris.some((uri) => !redirectUris.has(uri)) ||
				(body.token_endpoint_auth_method ?? "none") !== authMethod
			)
				return error("invalid_client_metadata");
			observations.push({ event: "register", authMethod });
			return json(
				{
					client_id: "probe-client",
					...(authMethod === "none" ? {} : { client_secret: "probe-secret" }),
					redirect_uris: body.redirect_uris,
					token_endpoint_auth_method: authMethod,
				},
				201,
			);
		}
		if (request.method === "POST" && path === "/token") {
			const params = new URLSearchParams(await request.text());
			let id = params.get("client_id"),
				secret = params.get("client_secret"),
				actualMethod: Observation["authMethod"] = secret ? "client_secret_post" : "none";
			const authorization = request.headers.get("authorization");
			if (authorization?.startsWith("Basic ")) {
				try {
					const pair = Buffer.from(authorization.slice(6), "base64").toString();
					const split = pair.indexOf(":");
					id = decodeURIComponent(pair.slice(0, split));
					secret = decodeURIComponent(pair.slice(split + 1));
					actualMethod = "client_secret_basic";
				} catch {
					return error("invalid_client", 401);
				}
			}
			if (
				id !== "probe-client" ||
				actualMethod !== authMethod ||
				(authMethod !== "none" && secret !== "probe-secret")
			)
				return error("invalid_client", 401);
			if (params.get("grant_type") === "refresh_token") {
				const token = params.get("refresh_token") ?? "";
				if (!refresh.delete(token)) return error("invalid_grant");
				observations.push({ event: "refresh", authMethod, resource: params.has("resource") });
				return issueTokens();
			}
			if (params.get("grant_type") !== "authorization_code") return error("unsupported_grant_type");
			const code = params.get("code") ?? "",
				grant = codes.get(code);
			codes.delete(code);
			if (!grant || grant.expires <= now() || params.get("redirect_uri") !== grant.redirectUri)
				return error("invalid_grant");
			if (
				grant.challenge &&
				createHash("sha256")
					.update(params.get("code_verifier") ?? "")
					.digest("base64url") !== grant.challenge
			)
				return error("invalid_grant");
			observations.push({ event: "token", authMethod, resource: params.has("resource") });
			return issueTokens();
		}
		if (path === "/mcp") {
			const bearer = request.headers.get("authorization")?.replace(/^Bearer /u, "") ?? "";
			if ((tokens.get(bearer) ?? 0) <= now()) return error("unauthorized", 401);
			if (request.method !== "POST") return new Response(null, { status: 405 });
			let body: { id?: number | string; method?: string; params?: { protocolVersion?: string } };
			try {
				body = await request.json();
			} catch {
				return error("invalid_request");
			}
			if (body.method === "notifications/initialized") return new Response(null, { status: 202 });
			if (body.method === "initialize") {
				observations.push({ event: "initialize" });
				return json({
					jsonrpc: "2.0",
					id: body.id,
					result: {
						protocolVersion: body.params?.protocolVersion ?? "2025-11-25",
						capabilities: { tools: {} },
						serverInfo: { name: "canvas-oauth-probe", version: "1.0.0" },
					},
				});
			}
			if (body.method === "tools/list")
				return json({ jsonrpc: "2.0", id: body.id, result: { tools: [] } });
			return json({
				jsonrpc: "2.0",
				id: body.id,
				error: { code: -32601, message: "Method not found" },
			});
		}
		return new Response(null, { status: 404 });
	}
	// Wrap unauthenticated MCP responses with discovery; observations never contain headers or bodies.
	return {
		observations,
		async handle(request: Request) {
			const response = await handle(request);
			if (new URL(request.url).pathname === "/mcp" && response.status === 401)
				response.headers.set(
					"WWW-Authenticate",
					`Bearer resource_metadata="${origin.origin}/.well-known/oauth-protected-resource/mcp"`,
				);
			return response;
		},
	};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const port = Number(process.env.PROBE_PORT ?? "8765");
	if (!Number.isInteger(port) || port < 1024 || port > 65535)
		throw new Error("PROBE_PORT must be 1024–65535");
	const origin = `http://127.0.0.1:${port}`,
		redirectUris = process.argv.slice(2);
	if (!redirectUris.length)
		throw new Error("Supply the exact loopback redirect URI(s) expected by the client");
	const method = process.env.PROBE_AUTH_METHOD ?? "none";
	if (!["none", "client_secret_post", "client_secret_basic"].includes(method))
		throw new Error("Unsupported PROBE_AUTH_METHOD");
	const probe = createProbe({
		origin,
		redirectUris,
		authMethod: method as ProbeOptions["authMethod"],
		registration: process.env.PROBE_DCR === "1",
	});
	const server = createServer(async (incoming, outgoing) => {
		try {
			const buffers: Buffer[] = [];
			let bytes = 0;
			for await (const chunk of incoming) {
				const buffer = Buffer.from(chunk);
				bytes += buffer.length;
				if (bytes > 32_768) {
					outgoing.writeHead(413).end();
					return;
				}
				buffers.push(buffer);
			}
			const headers = new Headers();
			for (const [name, value] of Object.entries(incoming.headers))
				if (value) headers.set(name, Array.isArray(value) ? value.join(",") : value);
			const request = new Request(new URL(incoming.url ?? "/", origin), {
				method: incoming.method,
				headers,
				...(["GET", "HEAD"].includes(incoming.method ?? "GET")
					? {}
					: { body: Buffer.concat(buffers).toString() }),
			});
			const count = probe.observations.length,
				response = await probe.handle(request);
			outgoing.writeHead(response.status, Object.fromEntries(response.headers));
			outgoing.end(await response.text());
			for (const observation of probe.observations.slice(count))
				process.stdout.write(JSON.stringify(observation) + "\n");
		} catch {
			outgoing.writeHead(400).end();
		}
	});
	server.listen(port, "127.0.0.1", () =>
		process.stderr.write(`Probe listening on ${origin}/mcp; synthetic credentials only.\n`),
	);
}
