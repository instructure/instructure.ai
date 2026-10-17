import { type CallbackResolution } from "../oauth/codex-callback";
import { type ClientDefinition } from "../clients/types";
import { type AppState, isBetaDomain } from "../state";

export function resolveKeySettings(
	client: ClientDefinition,
	state: AppState,
	callback?: CallbackResolution,
) {
	const redirect = client.facts.redirectUri;
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
		case "configurable":
			redirectText = redirect.defaultUri;
			copyable = true;
			break;
		case "computed":
			if (redirect.mode === "unknown")
				redirectText =
					"Confirm this client's callback mode and exact redirect URI before registering it. Computed output is awaiting verification.";
			else if (callback?.status === "ready") {
				redirectText = callback.uri;
				copyable = true;
			} else if (callback?.status === "error")
				redirectText =
					"The callback URI could not be computed. Confirm the exact URI with your client.";
			else
				redirectText =
					state.domain && state.region
						? "Computing the callback URI…"
						: "Select a Canvas domain and region to compute the callback URI.";
			break;
		case "unverified":
			redirectText =
				"Not yet verified for this client. Confirm its callback URI before creating the key.";
			break;
	}
	return {
		name: `Canvas MCP — ${client.name}`,
		redirect: { text: redirectText, copyable },
		productionDomain: state.domain.replace(".beta.instructure.com", ".instructure.com"),
		beta: isBetaDomain(state.domain),
		clientType: state.key === "private" ? "Confidential" : "Public",
		authorizedFlows: state.key === "private" ? "Token Exchange" : "Leave blank",
	};
}

export type KeySettingsModel = ReturnType<typeof resolveKeySettings>;
