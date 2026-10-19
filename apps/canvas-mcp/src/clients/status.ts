import { type ClientDefinition, type ClientStatus } from "./types";
import { type InstallMode } from "./ids";

export function clientStatus(client: ClientDefinition, install: InstallMode): ClientStatus {
	const status = client.status ?? { kind: "untested" as const };
	if ("installModes" in status && status.installModes && !status.installModes.includes(install)) {
		return { kind: "untested" };
	}
	return status;
}
