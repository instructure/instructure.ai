import { type ClientDefinition } from "../../types";
import { genericFacts } from "./facts";
import { genericPersonalGuide } from "./personal";

export const generic = {
	facts: genericFacts,
	installModes: ["personal"],
	guides: { personal: genericPersonalGuide },
	group: "Other",
	id: "generic",
	name: "Generic MCP client",
	setupNote:
		"Use a client that supports remote MCP over HTTP and OAuth 2.1. Enter the values shown below.",
	verify: "Complete OAuth and confirm the client can list the server's tools.",
} satisfies ClientDefinition;
