import { type KeyType } from "../ids";
import { type StructuredContent } from "../../guides/types";

export const codexCallbackOptions = `-c mcp_oauth_callback_port=8081 -c 'mcp_oauth_callback_url="http://localhost:8081/callback"'`;

export function codexCommands(key: KeyType, install: "personal" | "enterprise"): StructuredContent {
	const instructions = [
		install === "enterprise"
			? "After your administrator deploys the MCP allowlist, run this on each managed device as the signed-in user."
			: "Run this on your own device; the CLI and IDE extension share this configuration.",
		key === "private"
			? "This private-key script prompts for the client secret; keep the local configuration out of source control."
			: "This public-key script does not use a client secret.",
		"Codex saves the server and starts Canvas sign-in. Register the exact callback URI shown in the Canvas key settings first.",
		"If automatic sign-in returns `invalid_scope`, the server is already saved; continue to the scoped sign-in command below instead of running add again.",
	].join(" ");
	const command = `codex ${codexCallbackOptions} mcp add canvas-mcp --url "{mcpUrl}" --oauth-client-id "{clientId}"`;
	return {
		kind: "code-group",
		variants: {
			mac: {
				language: "bash",
				description: instructions,
				text:
					key === "public"
						? command
						: `(
  set -eu
  IFS= read -r -s -p "Canvas client secret: " secret
  printf '\\n'
  [ -n "$secret" ] || { echo "Client secret is required." >&2; exit 1; }
  ${command} --oauth-client-secret "$secret"
)`,
			},
			windows: {
				language: "powershell",
				description: instructions,
				text:
					key === "public"
						? command
						: `& {
  $ErrorActionPreference = 'Stop'
  $secret = Read-Host 'Canvas client secret' -AsSecureString
  try {
    if ($secret.Length -eq 0) { throw 'Client secret is required.' }
    ${command} --oauth-client-secret ([System.Net.NetworkCredential]::new('', $secret).Password)
    if ($LASTEXITCODE -ne 0) { throw 'Codex registration or sign-in failed. Review the error above.' }
  } finally {
    $secret.Dispose()
  }
}`,
			},
		},
	};
}
