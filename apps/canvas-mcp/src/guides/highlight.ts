import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import wasm from "shiki/wasm";
import bash from "shiki/langs/bash.mjs";
import json from "shiki/langs/json.mjs";
import markdown from "shiki/langs/markdown.mjs";
import powershell from "shiki/langs/powershell.mjs";
import toml from "shiki/langs/toml.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import type { CodeLanguage } from "./types";

const highlighter = await createHighlighterCore({
	themes: [githubLight, githubDark],
	langs: [bash, json, markdown, powershell, toml],
	engine: createOnigurumaEngine(wasm),
});

const languageAlias: Record<CodeLanguage, string> = {
	bash: "bash",
	json: "json",
	markdown: "markdown",
	prompt: "markdown",
	powershell: "powershell",
	toml: "toml",
};

export function highlightCode(source: string, language: CodeLanguage): string {
	return highlighter.codeToHtml(source, {
		lang: languageAlias[language],
		themes: { light: "github-light", dark: "github-dark" },
		defaultColor: "light-dark()",
	});
}
