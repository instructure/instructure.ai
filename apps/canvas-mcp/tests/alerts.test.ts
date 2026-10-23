// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";

describe("setup alert announcements", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		history.replaceState(null, "", "/canvas-mcp/?client=claude-code");
		localStorage.clear();
		document.body.innerHTML = '<div id="root"></div>';
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	function region(priority: "assertive" | "polite"): HTMLElement {
		return document.querySelector<HTMLElement>(`[data-notice-region="${priority}"]`)!;
	}

	function enterDomain(value: string, event = "input"): void {
		const input = document.querySelector<HTMLInputElement>("#domain-input")!;
		input.value = value;
		input.dispatchEvent(new Event(event, { bubbles: true }));
	}

	it("mounts empty, exposed, atomic live regions before adding initial messages", () => {
		history.replaceState(null, "", "?client=claude-code&domain=school.test");
		mountApp("admin");
		for (const priority of ["assertive", "polite"] as const) {
			const live = region(priority);
			expect(live.getAttribute("role")).toBe(priority === "assertive" ? "alert" : "status");
			expect(live.getAttribute("aria-live")).toBe(priority);
			expect(live.getAttribute("aria-atomic")).toBe("true");
			expect(live.closest("[hidden], [aria-hidden='true']")).toBeNull();
			expect(live.classList.contains("instui-screen-reader-content")).toBe(true);
			expect(live.textContent).toBe("");
		}
		vi.runOnlyPendingTimers();
		expect(region("assertive").textContent).toContain("Test instance: Test instances");
		expect(region("polite").textContent).toBe("");
		const input = document.querySelector("#domain-input")!;
		expect(input.getAttribute("aria-describedby")?.split(" ")).toContain("test-domain-alert");
		expect(document.querySelector("#test-domain-alert")?.getAttribute("aria-live")).toBe("off");
	});

	it("announces domain errors once, survives rerenders, and announces a recurring error", () => {
		mountApp("admin");
		const live = region("assertive");
		enterDomain("school.test");
		vi.runOnlyPendingTimers();
		expect(live.textContent).toContain("Test instances are not supported");
		const observer = new MutationObserver(() => {});
		observer.observe(live, { childList: true, subtree: true, characterData: true });
		enterDomain("school.test.instructure.com");
		enterDomain("school.test.instructure.com", "change");
		vi.runOnlyPendingTimers();
		expect(region("assertive")).toBe(live);
		expect(observer.takeRecords()).toHaveLength(0);
		observer.disconnect();

		enterDomain("school.beta");
		expect(live.textContent).toBe("");
		enterDomain("school.test");
		expect(live.textContent).toBe("");
		vi.runOnlyPendingTimers();
		expect(live.textContent).toContain("Test instances are not supported");
	});

	it("cancels stale messages when an error is corrected before it is announced", () => {
		mountApp("admin");
		enterDomain("school.test");
		enterDomain("school");
		vi.runOnlyPendingTimers();
		expect(region("assertive").textContent).toBe("");
	});

	it("announces a changed client blocker assertively", () => {
		mountApp("admin");
		const select = document.querySelector<HTMLSelectElement>("#client-select")!;
		select.value = "copilot";
		select.dispatchEvent(new Event("change", { bubbles: true }));
		vi.runOnlyPendingTimers();
		const notice = document.querySelector<HTMLElement>(".known-issue-alert")!;
		expect(region("assertive").textContent).toContain(
			notice.textContent?.replace(/\s+/gu, " ").trim(),
		);
		expect(notice.getAttribute("aria-live")).toBe("off");
		expect(region("polite").textContent).toBe("");
	});

	it("preserves pending notices across another update before they are announced", () => {
		history.replaceState(null, "", "?client=kiro&domain=school.beta.instructure.com");
		mountApp("admin");
		enterDomain("school", "change");
		vi.runOnlyPendingTimers();
		expect(region("assertive").textContent).toBe("");
		expect(region("polite").textContent).not.toContain("Beta instance:");
		expect(region("polite").textContent).not.toContain("This key won't be available in beta");
		expect(region("polite").textContent).toContain(
			document.querySelector(".lifecycle-notice")?.textContent,
		);
	});

	it("announces beta notices politely and does not repeat them on an unchanged render", () => {
		history.replaceState(null, "", "?client=claude-code&domain=school.beta.instructure.com");
		mountApp("admin");
		const live = region("polite");
		vi.runOnlyPendingTimers();
		expect(live.textContent).toContain("Beta instance:");
		expect(live.textContent).toContain("This key won't be available in beta");
		expect(region("assertive").textContent).toBe("");
		const observer = new MutationObserver(() => {});
		observer.observe(live, { childList: true, subtree: true, characterData: true });
		enterDomain("school.beta", "change");
		vi.runOnlyPendingTimers();
		expect(region("polite")).toBe(live);
		expect(observer.takeRecords()).toHaveLength(0);
		observer.disconnect();
	});

	it("announces lifecycle changes politely, keeps links usable, and clears notices on Help", () => {
		mountApp("admin");
		const select = document.querySelector<HTMLSelectElement>("#client-select")!;
		select.value = "kiro";
		select.dispatchEvent(new Event("change", { bubbles: true }));
		expect(region("polite").textContent).toBe("");
		vi.runOnlyPendingTimers();
		const notice = document.querySelector<HTMLElement>(".lifecycle-notice")!;
		expect(region("polite").textContent).toContain(notice.textContent);
		expect(notice.getAttribute("aria-live")).toBe("off");
		expect(notice.querySelector("a")?.closest("[aria-hidden='true']")).toBeNull();
		expect(notice.querySelector("a")?.href).toBeTruthy();
		document.querySelector<HTMLButtonElement>("#tab-help")!.click();
		vi.runOnlyPendingTimers();
		expect(region("polite").textContent).toBe("");
		expect(region("assertive").textContent).toBe("");
	});
});
