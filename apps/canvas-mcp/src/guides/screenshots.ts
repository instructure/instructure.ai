import { SCREENSHOT_MANIFEST } from "./screenshot-manifest";
import { type StructuredContent } from "./types";

const standardSize = { width: 960, height: 540 } as const,
	terminalSize = { width: 600, height: 360 } as const;

export function screenshot(
	name: string,
	alt: string,
): Extract<StructuredContent, { kind: "image" }> {
	const asset = SCREENSHOT_MANIFEST[name];
	if (!asset) throw new Error(`Screenshot is missing from the manifest: ${name}`);
	const size =
		typeof asset.size === "object"
			? asset.size
			: asset.size === "terminal"
				? terminalSize
				: standardSize;
	return {
		kind: "image",
		name,
		alt,
		...size,
		placeholder: !asset.file,
	};
}

export function canvasAuthorizationScreenshot(): Extract<StructuredContent, { kind: "image" }> {
	return screenshot(
		"canvas_consent_screen",
		"Canvas OAuth authorization screen prompting you to approve access for the MCP client.",
	);
}

export function screenshotSource(name: string, placeholder?: boolean): string {
	const asset = SCREENSHOT_MANIFEST[name];
	if (!asset) throw new Error(`Screenshot is missing from the manifest: ${name}`);
	if (placeholder !== undefined && placeholder === Boolean(asset.file))
		throw new Error(`Screenshot placeholder state does not match the manifest: ${name}`);
	if (asset.file)
		return `${import.meta.env.BASE_URL.replace(/\/$/u, "")}/${asset.file.replace(/^\/+/u, "")}`;
	const size = asset.size === "terminal" ? terminalSize : standardSize;
	const label = encodeURIComponent(name).replace(/%20/gu, "+");
	return `https://placehold.co/${size.width}x${size.height}/png?text=${label}`;
}
