import { type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
import {
	antigravityAppGuide,
	antigravityEnterpriseGuide,
	antigravityMcp,
} from "./antigravity-guides";
// The persisted antigravity-ide Rulesync alias is retained for existing setup links.
// Enterprise instructions refer to the current Antigravity app, not the legacy IDE.
export const antigravity = {
	facts: {
		...unknownFacts(),
		redirectUri: {
			kind: "fixed",
			uris: ["https://antigravity.google/oauth-callback"],
			status: "documented",
			evidence: [antigravityMcp],
		},
		remoteHttp: { value: "yes", status: "documented", evidence: [antigravityMcp] },
		staticClientId: { value: "yes", status: "documented", evidence: [antigravityMcp] },
		registration: { value: "both", status: "documented", evidence: [antigravityMcp] },
		keyTypes: {
			public: unknownFacts().keyTypes.public,
			private: { value: "yes", status: "documented", evidence: [antigravityMcp] },
		},
	},
	guides: {
		personal: antigravityAppGuide,
		enterprise: antigravityEnterpriseGuide(antigravityAppGuide),
	},
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Google Cloud console",
	provider: "Google",
	group: "Curated",
	id: "antigravity",
	name: "Antigravity",
	setupNote: "Configure the Canvas MCP server in Antigravity agent settings.",
	verify: "Authenticate and list your Canvas courses.",
	rulesyncTarget: "antigravity-ide",
} satisfies ClientDefinition;
