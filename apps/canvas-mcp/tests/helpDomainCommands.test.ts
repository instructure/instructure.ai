// @vitest-environment node

import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import faqs from "../src/help/faqs.json";

const commands = faqs.flatMap((group) => group.entries).find((entry) => entry.commands)!.commands!;
const policy =
	"content-security-policy: frame-ancestors 'self' canvas.valpo.edu valpo-vanity.instructure.com valpo.beta.instructure.com valpo.test.instructure.com valpo.instructure.com;";

function runLookup(hostname: string, headers: string, curlStatus = 0, shell = "bash") {
	const mocks = `
curl() {
    if [ "$*" != "-fsSIL --max-time 30 --proto =https --proto-redir =https https://\${EXPECTED_HOST}/login/canvas" ]; then
        echo 'Unexpected curl arguments' >&2
        return 1
    fi
    printf '%s\\n' "$HEADERS"
    return "$CURL_STATUS"
}
`;
	return spawnSync(shell, ["-c", mocks + commands.mac], {
		input: `${hostname}\n`,
		encoding: "utf8",
		env: {
			...process.env,
			HEADERS: headers,
			CURL_STATUS: String(curlStatus),
			EXPECTED_HOST: hostname.toLowerCase().replace(/\.$/u, ""),
		},
	});
}

describe("Help domain and region commands", () => {
	it.each(["bash", "zsh"])("supports prompting and lookup in %s", (shell) => {
		const result = runLookup(
			"canvas.valpo.edu",
			`${policy}\nx-canvas-meta: q=1;z=us-west-2b;`,
			0,
			shell,
		);
		expect(result.stderr).toBe("Canvas hostname: ");
		expect(result.status).toBe(0);
		expect(result.stdout).toBe("valpo.instructure.com\nus-west-2\n");
	});

	it.each(["canvas.valpo.edu", "valpo.instructure.com", "VALPO.INSTRUCTURE.COM."])(
		"prints exactly the hostname and region for %s",
		(hostname) => {
			const result = runLookup(
				hostname,
				`HTTP/2 302\r\nlocation: https://canvas.valpo.edu/login/canvas\r\nHTTP/2 200\r\nx-canvas-meta: q=1;z=us-west-2b;b=2;\r\n${policy}\r\n`,
			);
			expect(result.status).toBe(0);
			expect(result.stdout).toBe("valpo.instructure.com\nus-west-2\n");
		},
	);

	it("returns the production hostname for beta input and handles mixed-case headers", () => {
		const result = runLookup(
			"valpo.beta.instructure.com",
			`X-Canvas-Meta: q=1;z=eu-west-1c;\n${policy}`,
		);
		expect(result.status).toBe(0);
		expect(result.stdout).toBe("valpo.instructure.com\neu-west-1\n");
	});

	it("fails explicitly without region metadata", () => {
		const result = runLookup("valpo.instructure.com", policy);
		expect(result.status).not.toBe(0);
		expect(result.stdout).toBe("");
		expect(result.stderr).toContain("No region found");
	});

	it.each([
		"",
		"content-security-policy: frame-ancestors valpo.beta.instructure.com;",
		"content-security-policy: frame-ancestors valpo.instructure.com other.instructure.com;",
		"content-security-policy: frame-ancestors valpo.instructure.com.evil.example;",
	])("rejects missing or ambiguous canonical hostnames: %s", (csp) => {
		const result = runLookup("canvas.valpo.edu", `x-canvas-meta: q=1;z=us-west-2b;\n${csp}`);
		expect(result.status).not.toBe(0);
		expect(result.stdout).toBe("");
		expect(result.stderr).toContain("Expected one production Canvas hostname");
	});

	it("does not print successful output when fetching headers fails", () => {
		const result = runLookup("valpo.instructure.com", "", 22);
		expect(result.status).not.toBe(0);
		expect(result.stdout).toBe("");
	});

	it("rejects URLs instead of hostnames", () => {
		const result = runLookup("https://canvas.valpo.edu/path", "");
		expect(result.status).not.toBe(0);
		expect(result.stderr).toContain("Enter a hostname");
	});
});
