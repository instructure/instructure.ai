// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { renderHelp } from "../src/help/render";
import { bindSegmentedControls } from "../src/ui/segmented-controls";

describe("segmented-control interactions", () => {
	afterEach(() => vi.restoreAllMocks());

	it("wires overflow buttons, tracks scrolling, and disconnects on cleanup", () => {
		document.body.innerHTML = renderHelp("faqs");
		const track = document.querySelector<HTMLElement>(".track")!;
		Object.defineProperties(track, {
			clientWidth: { value: 240 },
			scrollWidth: { value: 600 },
		});
		const cleanup = bindSegmentedControls(document.body);
		const start = document.querySelector<HTMLButtonElement>(".overflow-start")!;
		const end = document.querySelector<HTMLButtonElement>(".overflow-end")!;
		expect(start.hidden).toBe(true);
		expect(end.hidden).toBe(false);
		expect(end.type).toBe("button");
		expect(end.getAttribute("aria-label")).toBe("Scroll forward");
		track.scrollLeft = 360;
		track.dispatchEvent(new Event("scroll"));
		expect(start.hidden).toBe(false);
		expect(end.hidden).toBe(true);
		cleanup();
		track.scrollLeft = 0;
		track.dispatchEvent(new Event("scroll"));
		expect(start.hidden).toBe(false);
	});

	it("keeps keyboard selection working after Help rerenders and remounts", () => {
		history.replaceState(null, "", "?page=help");
		localStorage.clear();
		document.body.innerHTML = '<div id="root"></div>';
		mountApp("admin");
		for (let index = 0; index < 2; index++) {
			const first = document.querySelector<HTMLInputElement>("#help-section-faqs")!;
			first.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
			expect(document.querySelector<HTMLInputElement>("#help-section-contact")?.checked).toBe(true);
			expect(document.activeElement?.id).toBe("help-section-contact");
			expect(document.querySelectorAll(".overflow-end")).toHaveLength(1);
			mountApp("admin");
			const last = document.querySelector<HTMLInputElement>("#help-section-contact")!;
			last.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
			expect(document.querySelector<HTMLInputElement>("#help-section-faqs")?.checked).toBe(true);
		}
	});
});
