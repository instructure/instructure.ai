import { type ClientFacts, type Fact, type RedirectUri } from "./types";
// Values inherited from phase 1 remain unverified until their sources are checked.
export function unverified<T>(value: T | "unknown" = "unknown"): Fact<T> {
	return { value, status: "unverified", evidence: [] };
}
export function unknownFacts(): ClientFacts {
	return {
		redirectUri: { kind: "unverified" },
		remoteHttp: unverified(),
		keyTypes: { public: unverified(), private: unverified() },
		pkce: unverified(),
		sendsResource: unverified(),
		staticClientId: unverified(),
		registration: unverified(),
	};
}
export function inheritedFacts(
	keys: ("public" | "private")[],
	redirectUri: RedirectUri,
): ClientFacts {
	return {
		...unknownFacts(),
		redirectUri,
		keyTypes: {
			public: unverified(keys.includes("public") ? "yes" : "no"),
			private: unverified(keys.includes("private") ? "yes" : "no"),
		},
	};
}
