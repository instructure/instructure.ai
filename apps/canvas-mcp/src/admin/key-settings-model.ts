// Unknown callback values remain non-copyable; research status belongs in client facts.
import { type CallbackResolution } from "../oauth/codex-callback";
import { CLIENTS } from "../clients";
import { type ClientDefinition } from "../clients/types";
import { type AppState, isBetaDomain, normalizeRedirectUris } from "../state";

function keyRedirectUris(state: AppState, callback?: CallbackResolution) {
	const uris = new Set<string>();
	for (const client of CLIENTS) {
		for (const redirect of [
			client.facts.redirectUri,
			...Object.values(client.redirectUriOverrides ?? {}),
		]) {
			if (redirect.kind === "fixed") redirect.uris.forEach((uri) => uris.add(uri));
			if (redirect.kind === "configurable") uris.add(redirect.defaultUri);
		}
	}
	if (callback?.status === "ready") uris.add(callback.uri);
	if (state.client === "generic")
		normalizeRedirectUris(state.redirectUris)
			.split("\n")
			.filter(Boolean)
			.forEach((uri) => uris.add(uri));
	return {
		text: [...uris].sort((left, right) => left.localeCompare(right)).join("\n"),
		copyable: callback?.status === "ready",
		note:
			callback?.status === "error"
				? "Could not compute the Codex callback URI."
				: callback?.status === "ready"
					? ""
					: "Select a Canvas domain and region to include Codex's generated callback URI.",
	};
}

export function resolveKeySettings(
	client: ClientDefinition,
	state: AppState,
	callback?: CallbackResolution,
) {
	const redirect = client.redirectUriOverrides?.[state.install] ?? client.facts.redirectUri;
	let redirectText: string,
		copyable = false;
	switch (redirect.kind) {
		case "fixed":
			redirectText = redirect.uris.join("\n");
			copyable = redirect.uris.length > 0;
			break;
		case "client-generated":
			redirectText =
				"Leave Redirect URIs blank when creating the key. Add the generated URI after saving the connector.";
			break;
		case "runtime":
			redirectText = redirect.description;
			break;
		case "configurable":
			redirectText = redirect.defaultUri;
			copyable = true;
			break;
		case "computed":
			if (redirect.mode === "unknown") redirectText = "Client callback URI";
			else if (callback?.status === "ready") {
				redirectText = callback.uri;
				copyable = true;
			} else if (callback?.status === "error") redirectText = "Client callback URI";
			else
				redirectText =
					state.domain && state.region
						? "Computing the callback URI…"
						: "Select a Canvas domain and region to compute the callback URI.";
			break;
		case "unverified":
			if (client.id === "generic") {
				redirectText =
					normalizeRedirectUris(state.redirectUris) || "Enter callback URIs in step 1 first";
				copyable = Boolean(normalizeRedirectUris(state.redirectUris));
			} else redirectText = "Client callback URI";
			break;
	}
	return {
		name: `Canvas MCP — ${client.name}`,
		keyRedirect: keyRedirectUris(state, callback),
		redirect: {
			text: redirectText,
			copyable,
			note: redirect.kind === "configurable" ? redirect.note : "",
		},
		productionDomain: state.domain.replace(".beta.instructure.com", ".instructure.com"),
		beta: isBetaDomain(state.domain),
		clientType: state.key === "private" ? "Confidential" : "Public",
		authorizedFlows: state.key === "private" ? "Token Exchange" : "Leave blank",
	};
}

export type KeySettingsModel = ReturnType<typeof resolveKeySettings>;
