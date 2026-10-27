// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { antigravityCliCommands } from "../src/clients/curated/antigravity-cli-commands";

const directories: string[] = [];
const secret = 'synthetic-secret"$\\value';
const shellAvailable = (shell: string) => spawnSync(shell, ["--version"]).status === 0;
const bashAvailable = shellAvailable("bash") && shellAvailable("jq");
const powershellAvailable = shellAvailable("pwsh");
afterEach(() => {
	for (const directory of directories.splice(0))
		rmSync(directory, { recursive: true, force: true });
});

function command(key: "public" | "private", platform: "mac" | "windows") {
	const content = antigravityCliCommands(key);
	if (content.kind !== "code-group") throw new Error("Expected platform commands");
	return content.variants[platform].text
		.replaceAll("{mcpUrl}", "https://example.test/mcp")
		.replaceAll("{clientId}", "12345000000000001");
}
function fixture(initial?: string) {
	const directory = mkdtempSync(join(tmpdir(), "antigravity-command-"));
	directories.push(directory);
	if (initial !== undefined) {
		mkdirSync(join(directory, ".agents"));
		writeFileSync(join(directory, ".agents/mcp_config.json"), initial);
	}
	return directory;
}
function execute(
	platform: "mac" | "windows",
	key: "public" | "private",
	directory: string,
	emptySecret = false,
) {
	return platform === "mac"
		? spawnSync("bash", ["-c", command(key, platform)], {
				cwd: directory,
				input: emptySecret ? "\n" : `${secret}\n`,
				encoding: "utf8",
			})
		: spawnSync(
				"pwsh",
				[
					"-NoProfile",
					"-NonInteractive",
					"-Command",
					`function Read-Host { ConvertTo-SecureString '${emptySecret ? "" : secret}' -AsPlainText -Force }\n${command(key, platform)}`,
				],
				{
					cwd: directory,
					encoding: "utf8",
					timeout: platform === "windows" ? 15_000 : undefined,
				},
			);
}

for (const platform of ["mac", "windows"] as const) {
	describe.skipIf(platform === "mac" ? !bashAvailable : !powershellAvailable)(
		`${platform} configuration command`,
		() => {
			const testTimeout = platform === "windows" ? 20_000 : 5_000;

			it.each(["public", "private"] as const)(
				"creates a missing %s configuration",
				(key) => {
					const directory = fixture();
					const result = execute(platform, key, directory);
					expect(result.status, result.stderr).toBe(0);
					const config = JSON.parse(
						readFileSync(join(directory, ".agents/mcp_config.json"), "utf8"),
					);
					expect(config).toEqual({
						mcpServers: {
							"canvas-mcp": {
								serverUrl: "https://example.test/mcp",
								oauth: {
									clientId: "12345000000000001",
									...(key === "private" ? { clientSecret: secret } : {}),
								},
							},
						},
					});
					expect(result.stdout).not.toContain(secret);
					expect(result.stderr).not.toContain(secret);
					expect(readdirSync(join(directory, ".agents"))).toEqual(["mcp_config.json"]);
				},
				testTimeout,
			);
			it.each(["public", "private"] as const)(
				"merges and reruns %s configuration without losing settings",
				(key) => {
					const directory = fixture(
						JSON.stringify({
							preferences: { theme: "dark" },
							mcpServers: {
								other: { command: "existing" },
								"canvas-mcp": {
									custom: true,
									oauth: { scopes: ["existing"], clientSecret: "old" },
								},
							},
						}),
					);
					for (let run = 0; run < 2; run++)
						expect(execute(platform, key, directory).status).toBe(0);
					const config = JSON.parse(
						readFileSync(join(directory, ".agents/mcp_config.json"), "utf8"),
					);
					expect(config.preferences).toEqual({ theme: "dark" });
					expect(config.mcpServers.other).toEqual({ command: "existing" });
					expect(config.mcpServers["canvas-mcp"]).toEqual({
						custom: true,
						serverUrl: "https://example.test/mcp",
						oauth: {
							scopes: ["existing"],
							clientId: "12345000000000001",
							...(key === "private" ? { clientSecret: secret } : {}),
						},
					});
				},
				testTimeout,
			);
			it(
				"adds missing mcpServers to an existing configuration",
				() => {
					const directory = fixture('{"keep":true}');
					expect(execute(platform, "public", directory).status).toBe(0);
					expect(
						JSON.parse(readFileSync(join(directory, ".agents/mcp_config.json"), "utf8")).keep,
					).toBe(true);
				},
				testTimeout,
			);
			it.each([
				"",
				"{broken",
				"[]",
				"null",
				'{"mcpServers":null}',
				'{"mcpServers":[]}',
				'{"mcpServers":{"canvas-mcp":false}}',
				'{"mcpServers":{"canvas-mcp":{"oauth":"bad"}}}',
			])(
				"rejects invalid configuration without overwriting it: %s",
				(initial) => {
					const directory = fixture(initial);
					const result = execute(platform, "public", directory);
					expect(result.status).not.toBe(0);
					expect(result.stderr).not.toBe("");
					expect(readFileSync(join(directory, ".agents/mcp_config.json"), "utf8")).toBe(initial);
					expect(readdirSync(join(directory, ".agents"))).toEqual(["mcp_config.json"]);
				},
				testTimeout,
			);
			it(
				"rejects an empty private secret without overwriting the file",
				() => {
					const directory = fixture("{}");
					expect(execute(platform, "private", directory, true).status).not.toBe(0);
					expect(readFileSync(join(directory, ".agents/mcp_config.json"), "utf8")).toBe("{}");
					expect(readdirSync(join(directory, ".agents"))).toEqual(["mcp_config.json"]);
				},
				testTimeout,
			);
		},
	);
}

it.skipIf(!shellAvailable("bash"))(
	"stops with an explicit prerequisite error when jq is missing",
	() => {
		const result = spawnSync("/bin/bash", ["-c", command("public", "mac")], {
			cwd: fixture(),
			env: { PATH: "/nonexistent" },
			encoding: "utf8",
		});
		expect(result.status).not.toBe(0);
		expect(result.stderr).toContain("Install jq");
	},
);
