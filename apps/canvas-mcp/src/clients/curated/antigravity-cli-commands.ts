import { type KeyType } from "../ids";
import { type StructuredContent } from "../../guides/types";

export function antigravityCliCommands(key: KeyType): StructuredContent {
	const instructions =
		"Run this command from your project directory to create or update `.agents/mcp_config.json`. Existing servers and unrelated settings are preserved; malformed JSON or incompatible fields stop the update.";
	const keyInstructions =
		key === "private"
			? "You will be prompted for the client secret. Keep the configuration out of source control."
			: "";
	return {
		kind: "code-group",
		variants: {
			mac: {
				language: "bash",
				description: `${instructions} Requires Bash and \`jq\`; the command stops if \`jq\` is missing. ${keyInstructions}`,
				text: `(
  set -eu
  command -v jq >/dev/null 2>&1 || { echo "Install jq before running this command, or use the manual JSON below." >&2; exit 1; }
  umask 077
  mkdir -p .agents
  file=.agents/mcp_config.json
  tmp=$(mktemp .agents/.mcp_config.XXXXXX)
  trap 'rm -f "$tmp"' EXIT
  if [ -e "$file" ]; then
    [ -f "$file" ] || { echo "$file is not a regular file." >&2; exit 1; }
    source=$file
  else
    printf '{}\\n' > "$tmp"
    source=$tmp
  fi
  filter='
    if length != 1 then error("Expected one JSON object") else .[0] end
    | if type != "object" then error("Configuration must be an object") else . end
    | if has("mcpServers") and (.mcpServers | type) != "object" then error("mcpServers must be an object") else . end
    | .mcpServers = (.mcpServers // {})
    | if (.mcpServers | has("canvas-mcp")) and (.mcpServers["canvas-mcp"] | type) != "object" then error("canvas-mcp must be an object") else . end
    | .mcpServers["canvas-mcp"] = (.mcpServers["canvas-mcp"] // {})
    | if (.mcpServers["canvas-mcp"] | has("oauth")) and (.mcpServers["canvas-mcp"].oauth | type) != "object" then error("oauth must be an object") else . end
    | .mcpServers["canvas-mcp"].oauth = (.mcpServers["canvas-mcp"].oauth // {})
  '
  jq -e -s "$filter" "$source" >/dev/null
${
	key === "private"
		? `  if ! read -r -s -p "Canvas client secret: " secret; then
    printf '\\nUnable to read the client secret.\\n' >&2
    exit 1
  fi
  printf '\\n' >&2
  [ -n "$secret" ] || { echo "Client secret is required." >&2; exit 1; }
`
		: ""
}  result=$(${key === "private" ? `printf '%s' "$secret" | ` : ""}jq -e -s --arg url '{mcpUrl}' --arg id '{clientId}'${key === "private" ? " --rawfile secret /dev/stdin" : ""} "$filter"'
    | .mcpServers["canvas-mcp"].serverUrl = $url
    | .mcpServers["canvas-mcp"].oauth.clientId = $id
    | ${key === "private" ? '.mcpServers["canvas-mcp"].oauth.clientSecret = $secret' : 'del(.mcpServers["canvas-mcp"].oauth.clientSecret)'}
  ' "$source")
  printf '%s\\n' "$result" > "$tmp"
  mv -f "$tmp" "$file"
  echo "Updated $file"
)`,
			},
			windows: {
				language: "powershell",
				description: `${instructions} Uses native Windows PowerShell. ${keyInstructions}`,
				text: `& {
  $ErrorActionPreference = 'Stop'
  $WarningPreference = 'Stop'
  $file = Join-Path (Get-Location) '.agents/mcp_config.json'
  $temp = $null
${key === "private" ? "  $secret = $null\n" : ""}  try {
    if (Test-Path -LiteralPath $file) {
      if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "$file is not a regular file." }
      $config = ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($file)) -ErrorAction Stop
    } else {
      $config = [pscustomobject]@{}
    }
    if ($config -isnot [pscustomobject]) { throw 'Configuration must be a JSON object.' }
    if (-not $config.PSObject.Properties['mcpServers']) {
      $config | Add-Member -NotePropertyName mcpServers -NotePropertyValue ([pscustomobject]@{})
    }
    $servers = $config.mcpServers
    if ($servers -isnot [pscustomobject]) { throw 'mcpServers must be an object.' }
    if (-not $servers.PSObject.Properties['canvas-mcp']) {
      $servers | Add-Member -NotePropertyName 'canvas-mcp' -NotePropertyValue ([pscustomobject]@{})
    }
    $server = $servers.'canvas-mcp'
    if ($server -isnot [pscustomobject]) { throw 'canvas-mcp must be an object.' }
    if (-not $server.PSObject.Properties['oauth']) {
      $server | Add-Member -NotePropertyName oauth -NotePropertyValue ([pscustomobject]@{})
    }
    if ($server.oauth -isnot [pscustomobject]) { throw 'oauth must be an object.' }
    $server | Add-Member -NotePropertyName serverUrl -NotePropertyValue '{mcpUrl}' -Force
    $server.oauth | Add-Member -NotePropertyName clientId -NotePropertyValue '{clientId}' -Force
${
	key === "private"
		? `    $secret = Read-Host 'Canvas client secret' -AsSecureString
    if ($secret.Length -eq 0) { throw 'Client secret is required.' }
    $server.oauth | Add-Member -NotePropertyName clientSecret -NotePropertyValue ([System.Net.NetworkCredential]::new('', $secret).Password) -Force`
		: `    $server.oauth.PSObject.Properties.Remove('clientSecret')`
}
    $json = ConvertTo-Json -InputObject $config -Depth 100
    $null = New-Item -ItemType Directory -Path (Split-Path $file) -Force
    $temp = Join-Path (Split-Path $file) ('.mcp_config.' + [guid]::NewGuid().ToString('N'))
    [System.IO.File]::WriteAllText($temp, $json, [System.Text.UTF8Encoding]::new($false))
    Move-Item -LiteralPath $temp -Destination $file -Force
    Write-Host "Updated $file"
  } finally {
    if ($temp -and (Test-Path -LiteralPath $temp)) { Remove-Item -LiteralPath $temp -Force }
${
	key === "private"
		? `    if ($secret) { $secret.Dispose() }
`
		: ""
}  }
}`,
			},
		},
	};
}
