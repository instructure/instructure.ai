import { IconDownloadLine, type SVGIconProps } from "@instructure/ui";
import type { ProductNutritionFacts } from "../../types.ts";
import { ControlButton } from "./ControlButton.tsx";

async function getAllCssText(): Promise<string> {
	const parts: string[] = [];

	document.querySelectorAll<HTMLStyleElement>("style").forEach((style) => {
		if (style.textContent) parts.push(style.textContent);
	});

	const styleSheets = Array.from(document.styleSheets) as CSSStyleSheet[];
	for (const sheet of styleSheets) {
		try {
			if (sheet.cssRules) {
				const rules = Array.from(sheet.cssRules)
					.map((r) => r.cssText)
					.join("\n");
				parts.push(rules);
				continue;
			}
		} catch {
			// SecurityError likely; try fetching by href (if present and allowed)
		}

		const href = sheet.href;
		if (href) {
			try {
				const res = await fetch(href, { mode: "cors" });
				if (res.ok) {
					parts.push(await res.text());
				}
			} catch {
				// Ignore errors
			}
		}
	}

	return parts.join("\n\n");
}

function buildStandaloneHtml(
	pageHtml: string,
	cssText: string,
	title = "export",
) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  ${cssText}
	#page {
		height: auto;
	}
</style>

</head>
<body>
  ${pageHtml}
</body>
</html>`;
}

async function Download(product?: ProductNutritionFacts) {
	const filename = `${product?.name}-nutrition-facts.html`;
	const pageEl = document.getElementById("page");
	if (!pageEl) {
		console.warn('Download(): element "#page" not found.');
		return;
	}
	const clone = pageEl.cloneNode(true) as HTMLElement;
	clone.querySelectorAll('[data-print*="hidden"]').forEach((el) => {
		el.remove();
	});
	clone.querySelectorAll('[tabindex="0"]').forEach((el) => {
		el.removeAttribute("tabindex");
	});
	const pageHtml = clone.outerHTML;
	const cssText = await getAllCssText();

	const fullHtml = buildStandaloneHtml(
		pageHtml,
		cssText,
		document.title || "export",
	);

	const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

const DownloadControl: React.FC<{ product: ProductNutritionFacts }> = ({
	product,
}) => (
	<ControlButton
		Icon={IconDownloadLine as React.ElementType<SVGIconProps>}
		label="Save as HTML"
		onClick={() => {
			void Download(product);
		}}
	/>
);

export { DownloadControl };
