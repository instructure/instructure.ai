import { getLogoSvg } from "@pantoken/plugin-logos";
const CANVAS_LOGO_FULL_COLOR = toSvgDataUri(getLogoSvg("canvas", "horizontal", "full-color")),
	CANVAS_LOGO_REVERSED = toSvgDataUri(getLogoSvg("canvas", "horizontal", "reversed"));
export function activeTheme(): string {
	try {
		const stored = globalThis.localStorage.getItem("canvas-mcp:theme");
		return stored === "light" || stored === "dark" ? stored : "system";
	} catch {
		return "system";
	}
}

export function canvasLogoUri(): string {
	const scheme = document.documentElement.dataset.pantokenScheme;
	const systemPrefersDark =
		typeof globalThis.matchMedia === "function" &&
		globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
	return scheme === "dark" || (!scheme && systemPrefersDark)
		? CANVAS_LOGO_REVERSED
		: CANVAS_LOGO_FULL_COLOR;
}

function toSvgDataUri(svg: string | undefined): string {
	return svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "";
}

export function applyTheme(): void {
	const theme = activeTheme();
	if (theme === "light" || theme === "dark") {
		document.documentElement.dataset.pantokenScheme = theme;
	} else {
		delete document.documentElement.dataset.pantokenScheme;
	}
	syncThemeButtons(theme);
	syncCanvasLogo();
}

export function setTheme(theme: string): void {
	const selected = theme === "light" || theme === "dark" ? theme : "system";
	if (selected === "light" || selected === "dark") {
		document.documentElement.dataset.pantokenScheme = selected;
	} else {
		delete document.documentElement.dataset.pantokenScheme;
	}
	syncThemeButtons(selected);
	syncCanvasLogo();
	try {
		globalThis.localStorage.setItem("canvas-mcp:theme", selected);
	} catch {
		return;
	}
}

function syncThemeButtons(selected: string): void {
	document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
		button.setAttribute("aria-pressed", String(button.dataset.themeChoice === selected));
	});
}

function syncCanvasLogo(): void {
	const image = document.querySelector<HTMLImageElement>(".eyebrow-logo");
	if (image) {
		image.src = canvasLogoUri();
	}
}
