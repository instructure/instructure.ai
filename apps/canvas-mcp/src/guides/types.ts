import { type Evidence } from "../clients/types";
export type StructuredContent =
	| { kind: "paragraph" | "code"; text: string }
	| { kind: "list"; items: string[] }
	| { kind: "link"; label: string; url: string };
export type GuideStep =
	| { id: string; kind: "canvas-key"; action: "create" | "update-redirect" }
	| { id: string; kind: "provider" | "verify"; title: string; content: StructuredContent[] };
export interface Guide {
	status: "pending" | "documented";
	presentation: "by-surface" | "interleaved";
	prerequisites: string[];
	steps: GuideStep[];
	sources: Evidence[];
	lastVerified?: string;
}
