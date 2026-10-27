// @vitest-environment node
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { codex } from "../src/clients/curated/codex";
import { clientSetup } from "../src/guides/shared";
import { codexCallbackOptions } from "../src/clients/curated/codex-commands";

const scope = "https://sso.canvaslms.com/all-client-scopes";
const hasCodex = spawnSync("codex", ["--version"]).status === 0;

describe.each(["personal", "enterprise"] as const)("Codex %s scoped configuration", (install) => {
	it.each(["public", "private"] as const)(
		"offers simple registration and scoped login for %s keys",
		(key) => {
			const steps = clientSetup(codex, install).steps.filter(
				(step) => !("key" in step) || !step.key || step.key === key,
			);
			const registration = steps.find(
				(step) =>
					step.id === (key === "public" ? "provider-register" : "provider-register-private"),
			)!;
			if (!("content" in registration)) throw new Error("Expected registration content");
			const config = registration.content.find(
				(block) => block.kind === "code" && block.language === "toml",
			);
			expect(config).toBeUndefined();
			const commands = registration.content.find((block) => block.kind === "code-group");
			if (commands?.kind !== "code-group") throw new Error("Expected copyable platform scripts");
			for (const platform of ["mac", "windows"] as const) {
				const variant = commands.variants[platform];
				expect(variant.description).toContain(
					install === "enterprise" ? "managed device" : "own device",
				);
				expect(variant.description).toContain(`${key}-key script`);
				expect(variant.description).toContain("`invalid_scope`");
				expect(variant.description).toContain("instead of running add again");
				expect(variant.text).toContain(
					'mcp add canvas-mcp --url "{mcpUrl}" --oauth-client-id "{clientId}"',
				);
				expect(variant.text).toContain(codexCallbackOptions);
				expect(variant.text.includes("--oauth-client-secret")).toBe(key === "private");
				expect(variant.text).not.toContain("jq");
				if (key === "public") expect(variant.text.split("\n")).toHaveLength(1);
			}
			const login = steps.find((step) => step.id === "provider-login")!;
			if (!("content" in login)) throw new Error("Expected login content");
			const guidance = login.content
				.filter((block) => block.kind === "paragraph")
				.map((block) => block.text)
				.join(" ");
			expect(guidance).toContain("`invalid_scope`");
			expect(guidance).toContain("already saved the server");
			expect(guidance).toContain("developer key permits the requested Canvas scope");
			const command = login.content.find((block) => block.kind === "code");
			if (command?.kind !== "code") throw new Error("Expected explicit login");
			expect(command.text).toBe(
				`codex ${codexCallbackOptions} mcp login canvas-mcp --scopes "{scope}"`,
			);
		},
	);
});

it.skipIf(!hasCodex)(
	"requests the explicit Canvas scope instead of discovered openid with the installed CLI",
	async () => {
		let origin = "";
		const server = createServer((request, response) => {
			response.setHeader("Content-Type", "application/json");
			if (request.url === "/mcp") {
				response.writeHead(401, {
					"WWW-Authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource"`,
				});
				response.end(JSON.stringify({ error: "unauthorized" }));
			} else if (request.url?.startsWith("/.well-known/oauth-protected-resource")) {
				response.end(
					JSON.stringify({
						resource: `${origin}/mcp`,
						authorization_servers: [origin],
						scopes_supported: ["openid"],
					}),
				);
			} else if (request.url?.startsWith("/.well-known/oauth-authorization-server")) {
				response.end(
					JSON.stringify({
						issuer: origin,
						authorization_endpoint: `${origin}/authorize`,
						token_endpoint: `${origin}/token`,
						response_types_supported: ["code"],
						grant_types_supported: ["authorization_code"],
						code_challenge_methods_supported: ["S256"],
						scopes_supported: ["openid"],
					}),
				);
			} else {
				response.writeHead(404);
				response.end("{}");
			}
		});
		server.listen(0, "127.0.0.1");
		await once(server, "listening");
		const address = server.address();
		if (!address || typeof address === "string") throw new Error("Missing test server address");
		origin = `http://127.0.0.1:${address.port}`;
		const directory = mkdtempSync(join(tmpdir(), "codex-scope-login-"));
		writeFileSync(
			join(directory, "config.toml"),
			`[mcp_servers.canvas-mcp]\nurl = "${origin}/mcp"\n[mcp_servers.canvas-mcp.oauth]\nclient_id = "synthetic-client"\n`,
		);
		const child = spawn(
			"codex",
			[
				"-c",
				"mcp_oauth_callback_port=8081",
				"-c",
				'mcp_oauth_callback_url="http://localhost:8081/callback"',
				"mcp",
				"login",
				"canvas-mcp",
				"--no-browser",
				"--scopes",
				scope,
			],
			{
				env: { ...process.env, CODEX_HOME: directory },
				stdio: ["pipe", "pipe", "pipe"],
			},
		);
		try {
			const url = await new Promise<URL>((resolve, reject) => {
				let output = "";
				const timeout = setTimeout(
					() => reject(new Error(`Timed out waiting for OAuth URL: ${output}`)),
					10_000,
				);
				const collect = (data: Buffer) => {
					output += data.toString();
					const match = output.match(/http:\/\/127\.0\.0\.1:\d+\/authorize\?[^\s]+/u);
					if (match) {
						clearTimeout(timeout);
						resolve(new URL(match[0]));
					}
				};
				child.stdout.on("data", collect);
				child.stderr.on("data", collect);
				child.on("error", (error) => {
					clearTimeout(timeout);
					reject(error);
				});
				child.on("exit", (code) => {
					clearTimeout(timeout);
					reject(new Error(`Login exited ${code}: ${output}`));
				});
			});
			expect(url.searchParams.get("scope")).toBe(scope);
			expect(url.searchParams.get("client_id")).toBe("synthetic-client");
			expect(url.searchParams.get("redirect_uri")).toMatch(
				/^http:\/\/localhost:8081\/callback(?:\/|$)/u,
			);
		} finally {
			if (child.exitCode === null && child.signalCode === null) {
				const closed = once(child, "close");
				child.kill("SIGKILL");
				await closed;
			}
			server.closeAllConnections();
			await new Promise<void>((resolve, reject) =>
				server.close((error) => (error ? reject(error) : resolve())),
			);
			rmSync(directory, { recursive: true, force: true });
		}
	},
	15_000,
);
