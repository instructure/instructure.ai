import type { Client, KeyType } from "../state";
import type { RulesyncTargetId } from "../rulesyncTargets";
export interface ClientDefinition {
	id: Client;
	name: string;
	group: string;
	keyTypes: KeyType[];
	requiresClientId: boolean;
	redirectUris: string[];
	setupNote: string;
	verify: string;
	rulesyncTarget?: RulesyncTargetId;
	oauthMetadataVerified?: boolean;
	redirectUriKnown?: boolean;
}
