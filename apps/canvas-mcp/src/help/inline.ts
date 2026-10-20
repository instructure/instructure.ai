import { renderInlineText } from "../guides/render";

const icons = new Set([
	"check",
	"chevron-right",
	"copy",
	"equal-approximately-not",
	"info",
	"key",
	"modelcontextprotocol",
	"monitor",
	"moon",
	"printer",
	"search",
	"send",
	"sliders-horizontal",
	"sun",
	"triangle-alert",
]);

export function renderHelpInlineText(text: string): string {
	return renderInlineText(text).replace(
		/<code>.*?<\/code>|\{\{icon:([^{}]*)\}\}/gu,
		(match, icon: string | undefined) => {
			if (icon === undefined) return match;
			if (!icons.has(icon)) throw new Error(`Unsupported Help icon: ${icon}`);
			return `<span class="instui-icon -icon-${icon}" aria-hidden="true"></span>`;
		},
	);
}
