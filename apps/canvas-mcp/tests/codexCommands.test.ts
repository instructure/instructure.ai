// @vitest-environment node
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { codexCommands } from "../src/clients/curated/codex-commands";

const directories: string[] = [];
const secret = 'synthetic-secret"$\\value';
const available = (program: string) => spawnSync(program, ["--version"]).status === 0;
const hasBash = available("bash");
const hasPowerShell = available("pwsh");
afterEach(() => {
	for (const directory of directories.splice(0))
		rmSync(directory, { recursive: true, force: true });
});

for (const platform of ["mac", "windows"] as const) {
	describe.skipIf(platform === "mac" ? !hasBash : !hasPowerShell)(
		`Codex ${platform} commands`,
		() => {
			for (const install of ["personal", "enterprise"] as const) {
				for (const key of ["public", "private"] as const) {
					function execute(emptySecret = false, exitCode = 0) {
						const directory = mkdtempSync(join(tmpdir(), "codex-command-"));
						directories.push(directory);
						const capture = join(directory, "arguments");
						const content = codexCommands(key, install);
						if (content.kind !== "code-group") throw new Error("Expected platform commands");
						const script = content.variants[platform].text
							.replaceAll("{mcpUrl}", "https://example.test/mcp")
							.replaceAll("{clientId}", "12345000000000001");
						const input = emptySecret ? "" : secret;
						const options = {
							env: { ...process.env, CAPTURE: capture, CODEX_EXIT: String(exitCode) },
							encoding: "utf8" as const,
						};
						const result =
							platform === "mac"
								? spawnSync(
										"bash",
										[
											"-c",
											`codex() { printf '%s\\n' "$@" > "$CAPTURE"; return "$CODEX_EXIT"; }\n${script}`,
										],
										{
											...options,
											input: `${input}\n`,
										},
									)
								: spawnSync(
										"pwsh",
										[
											"-NoProfile",
											"-NonInteractive",
											"-Command",
											`
function codex {
  [System.IO.File]::WriteAllLines($env:CAPTURE, [string[]]$args)
  $global:LASTEXITCODE = [int]$env:CODEX_EXIT
}
function Read-Host { ConvertTo-SecureString '${input}' -AsPlainText -Force }
${script}
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
`,
										],
										options,
									);
						expect(result.stdout).not.toContain(secret);
						expect(result.stderr).not.toContain(secret);
						return { result, capture };
					}

					it(`${install}/${key}: passes exact callback, URL, credentials, and private secret arguments`, () => {
						const { result, capture } = execute();
						expect(result.status, result.stderr).toBe(0);
						expect(readFileSync(capture, "utf8").trimEnd().split(/\r?\n/u)).toEqual([
							"-c",
							"mcp_oauth_callback_port=8081",
							"-c",
							'mcp_oauth_callback_url="http://localhost:8081/callback"',
							"mcp",
							"add",
							"canvas-mcp",
							"--url",
							"https://example.test/mcp",
							"--oauth-client-id",
							"12345000000000001",
							...(key === "private" ? ["--oauth-client-secret", secret] : []),
						]);
					});
					it(`${install}/${key}: preserves Codex registration failures`, () => {
						expect(execute(false, 1).result.status).not.toBe(0);
					});
					if (key === "private") {
						it(`${install}/${key}: rejects an empty secret before invoking Codex`, () => {
							const { result, capture } = execute(true);
							expect(result.status).not.toBe(0);
							expect(existsSync(capture)).toBe(false);
						});
					}
				}
			}
		},
	);
}
