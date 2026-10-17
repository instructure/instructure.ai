import { type Evidence } from "../clients/types";
import { type CommandPlatform } from "../platform";
export type CodeLanguage = "bash" | "json" | "markdown" | "prompt" | "powershell" | "toml";
export interface CodeSnippet {
	text: string;
	language: CodeLanguage;
}
export type StructuredContent =
	| { kind: "paragraph"; text: string }
	| ({ kind: "code" } & CodeSnippet)
	| { kind: "code-group"; variants: Record<CommandPlatform, CodeSnippet> }
	| { kind: "list"; items: string[] }
	| {
			kind: "image";
			name: string;
			alt: string;
			width: number;
			height: number;
			placeholder: boolean;
	  }
	| { kind: "link"; label: string; url: string };
export type GuideStep =
	| { id: string; kind: "canvas-key"; action: "create" | "update-redirect" }
	| {
			id: string;
			kind: "provider" | "verify";
			key?: "public" | "private";
			audience?: "server" | "client";
			title: string;
			content: StructuredContent[];
	  };
export type ClientGuideStep = Exclude<GuideStep, { kind: "canvas-key" }>;
export interface Guide {
	status: "pending" | "documented";
	presentation: "by-surface" | "interleaved";
	prerequisites: string[];
	steps: GuideStep[];
	clientSetup?: { requiresServerDetails: boolean; steps: ClientGuideStep[] };
	sources: Evidence[];
	lastVerified?: string;
}
