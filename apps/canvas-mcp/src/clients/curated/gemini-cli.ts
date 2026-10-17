import { type ClientDefinition } from "../types";
import { unknownFacts, unverified } from "../facts";
import { updatedGuidance, updatedFact } from "../evidence";
export const geminiCli = {
	id: "gemini-cli",
	name: "Gemini CLI",
	group: "Curated",
	installModes: ["personal"],
	facts: {
		...unknownFacts(),
		redirectUri: {
			kind: "fixed",
			uris: ["http://localhost:8081/oauth/callback"],
			status: "documented",
			evidence: [updatedGuidance],
		},
		remoteHttp: updatedFact("yes"),
		staticClientId: updatedFact("yes"),
		registration: updatedFact("static"),
		keyTypes: { public: unverified(), private: updatedFact("yes") },
	},
	guides: {
		personal: {
			presentation: "by-surface",
			status: "pending",
			prerequisites: ["Gemini CLI access for your account and callback port 8081."],
			sources: [updatedGuidance],

			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-register",
					kind: "provider",
					title: "Gemini CLI — register the server",
					content: [
						{
							kind: "code",
							text: 'gemini mcp add --transport http --scope project canvas-mcp "{mcpUrl}"',
						},
						{
							kind: "paragraph",
							text: "The supplied Gemini CLI guide disagrees about key type and omits secret handling for its private-key example. Confirm the OAuth configuration fields before continuing. The documented callback is http://localhost:8081/oauth/callback.",
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Authenticate in Gemini CLI",
					content: [
						{
							kind: "list",
							items: [
								"Start a session with gemini.",
								"Run /mcp auth canvas-mcp, then sign in to Canvas and approve access.",
								"Open /mcp to confirm the connection.",
							],
						},
					],
				},
			],
		},
	},
	setupNote: "Use the source-backed CLI guide and confirm any unverified OAuth requirements.",
	verify: "Authenticate and confirm the server in /mcp.",
} satisfies ClientDefinition;
