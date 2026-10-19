// Source: openai/codex 9be8d6e1c3dbb145d2d7ac3ba46729340e6d8d40,
// codex-rs/rmcp-client/src/oauth_callback.rs (callback_id_from_server_url).
export async function codexCallbackUri(
	serverUrl: string,
	callbackBase: string,
	mode: "shared" | "per-server",
): Promise<string> {
	const server = new URL(serverUrl),
		callback = new URL(callbackBase);
	if (
		!["https:", "http:"].includes(server.protocol) ||
		!server.hostname ||
		server.username ||
		server.password
	)
		throw new Error("Invalid MCP server URL");
	if (
		callback.protocol !== "http:" ||
		!["localhost", "127.0.0.1", "[::1]"].includes(callback.hostname)
	)
		throw new Error("Expected a loopback callback URL");
	if (mode === "shared") return callbackBase;
	server.hash = "";
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(server.href));
	const id = btoa(String.fromCharCode(...new Uint8Array(digest).slice(0, 9)))
		.replace(/\+/gu, "-")
		.replace(/\//gu, "_")
		.replace(/=+$/u, "");
	if (callback.pathname.split("/").at(-1) !== id)
		callback.pathname = callback.pathname.replace(/\/?$/u, "/") + id;
	return callback.href;
}
export type CallbackResolution =
	| { status: "pending" }
	| { status: "ready"; uri: string }
	| { status: "error" };
export class CallbackCache {
	private entries = new Map<string, CallbackResolution>();
	request(
		serverUrl: string,
		base: string,
		mode: "shared" | "per-server",
		onSettled: () => void,
		compute = codexCallbackUri,
	): CallbackResolution {
		const key = JSON.stringify([serverUrl, base, mode]);
		const existing = this.entries.get(key);
		if (existing) return existing;
		this.entries.set(key, { status: "pending" });
		void compute(serverUrl, base, mode)
			.then(
				(uri) => {
					this.entries.set(key, { status: "ready", uri });
				},
				() => {
					this.entries.set(key, { status: "error" });
				},
			)
			.then(onSettled);
		return this.entries.get(key)!;
	}
}
