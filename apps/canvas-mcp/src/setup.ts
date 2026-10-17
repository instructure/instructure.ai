import { clientDefinition, normalizeInstall, normalizeKeyType } from "./clients";
import { type ClientDefinition } from "./clients/types";
import { type AppState, normalizeCanvasDomain } from "./state";

export function normalizeSetup(state: AppState): void {
	state.key = normalizeKeyType(state.client, state.key);
	state.install = normalizeInstall(state.client, state.install);
	if (clientDefinition(state.client).guides?.[state.install]?.presentation === "interleaved")
		state.surface = "canvas";
}
export function connectionReadiness(
	state: AppState,
	client: ClientDefinition = clientDefinition(state.client),
): { ready: boolean; reason: string; blocked?: boolean } {
	const facts = client.facts;
	if (client.blocker) return { ready: false, blocked: true, reason: client.blocker.reason };
	if (facts.remoteHttp.value === "no")
		return {
			ready: false,
			blocked: true,
			reason: "This client does not support remote MCP over HTTP.",
		};
	if (facts.registration.value === "dcr-only")
		return {
			ready: false,
			blocked: true,
			reason: "This client requires dynamic registration, which Canvas does not support.",
		};
	if (facts.staticClientId.value === "no")
		return {
			ready: false,
			blocked: true,
			reason: "This client cannot use a preconfigured Canvas Client ID.",
		};
	if (facts.keyTypes[state.key].value === "no")
		return {
			ready: false,
			blocked: true,
			reason: "This client does not support the selected key type.",
		};
	if (!normalizeCanvasDomain(state.domain))
		return { ready: false, reason: "Enter a supported Canvas domain." };
	if (!state.region) return { ready: false, reason: "Select your Canvas region." };
	if (!state.clientId) return { ready: false, reason: "Enter the Canvas developer key Client ID." };
	return { ready: true, reason: "" };
}
