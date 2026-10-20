import { type Client, type KeyType, type InstallMode } from "./ids";
import { type RulesyncTargetId } from "../rulesyncTargets";
import { type Guide } from "../guides/types";
export type Evidence = {
	method: "probe" | "source" | "vendor-doc" | "instructure" | "instructure-internal";
	label: string;
	url?: string;
	version?: string;
	verifiedAt: string;
};
export type Fact<T> =
	| { value: T; status: "verified" | "documented"; evidence: [Evidence, ...Evidence[]] }
	| { value: T | "unknown"; status: "unverified"; evidence: Evidence[] };
export type ClientStatus =
	| {
			kind: "validated";
			testedAt: string;
			installModes?: InstallMode[];
			note?: string;
			platform?: string;
	  }
	| { kind: "untested" }
	| {
			kind: "known-issue";
			reason: string;
			category?: "lifecycle";
			diagnostic?: string;
			installModes?: InstallMode[];
	  };
export type LifecycleNotice = {
	title: string;
	message: string;
	url?: string;
};
export type RedirectUri =
	| {
			kind: "fixed";
			uris: string[];
			evidence: Evidence[];
			status: "verified" | "documented" | "unverified";
	  }
	| {
			kind: "computed";
			recipe: "codex-callback-id";
			base: string;
			mode: "unknown" | "shared" | "per-server";
			evidence: Evidence[];
	  }
	| { kind: "client-generated"; where: string; evidence: Evidence[] }
	| { kind: "configurable"; defaultUri: string; note: string; evidence: Evidence[] }
	| { kind: "runtime"; description: string; evidence: Evidence[] }
	| { kind: "unverified"; docsUrl?: string };
export interface ClientFacts {
	redirectUri: RedirectUri;
	remoteHttp: Fact<"yes" | "no">;
	keyTypes: Record<KeyType, Fact<"yes" | "no">>;
	pkce: Fact<"required" | "optional" | "off">;
	sendsResource: Fact<"yes" | "no">;
	staticClientId: Fact<"yes" | "no">;
	registration: Fact<"static" | "dcr-only" | "both">;
}
export interface ClientDefinition {
	id: Client;
	name: string;
	provider?: string;
	group: "Curated" | "Other";
	facts: ClientFacts;
	status?: ClientStatus;
	lifecycleNotices?: Partial<Record<InstallMode, LifecycleNotice>>;
	installModes: InstallMode[];
	enterpriseSurface?: string;
	configurationUrl?: string;
	redirectUriOverrides?: Partial<Record<InstallMode, RedirectUri>>;
	research?: {
		checkedAt: string;
		installSupport: Record<InstallMode, Fact<"yes" | "no">>;
		sources: Evidence[];
		note: string;
	};
	guides?: Partial<Record<InstallMode, Guide>>;
	blocker?: { reason: string; evidence: Evidence[] };
	setupNote: string;
	verify: string;
	rulesyncTarget?: RulesyncTargetId;
}
