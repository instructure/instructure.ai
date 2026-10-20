// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { renderHelpInlineText } from "../src/help/inline";

describe("Help inline icons", () => {
	it("renders decorative icons anywhere alongside formatted and escaped text", () => {
		document.body.innerHTML = renderHelpInlineText(
			"{{icon:check}} **Validated {{icon:info}}** with `client_id`. <img src=x> {{icon:triangle-alert}}",
		);
		expect(document.querySelectorAll(".instui-icon")).toHaveLength(3);
		expect(document.querySelector("strong .-icon-info")).not.toBeNull();
		expect(document.querySelector("code")?.textContent).toBe("client_id");
		expect(document.querySelector("img")).toBeNull();
		expect(document.body.textContent).toContain("<img src=x>");
		for (const icon of document.querySelectorAll(".instui-icon"))
			expect(icon.getAttribute("aria-hidden")).toBe("true");
	});

	it("keeps icon syntax literal inside inline code", () => {
		document.body.innerHTML = renderHelpInlineText("`{{icon:check}}`");
		expect(document.querySelector("code")?.textContent).toBe("{{icon:check}}");
		expect(document.querySelector(".instui-icon")).toBeNull();
	});

	it.each(["not-an-icon", 'check" onclick="alert(1)', "", "check extra-class"])(
		"rejects unsupported icon names: %s",
		(icon) => {
			expect(() => renderHelpInlineText(`{{icon:${icon}}}`)).toThrow("Unsupported Help icon:");
		},
	);
});
