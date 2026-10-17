import { type ClientDefinition } from "../clients/types";
import { type AppState, isBetaDomain } from "../state";

export function resolveKeySettings(client: ClientDefinition, state: AppState) {
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
			redirectText =
				"Confirm this client's callback mode and exact redirect URI before registering it. Computed output is awaiting verification.";
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
