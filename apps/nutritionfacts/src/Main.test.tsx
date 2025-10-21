import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Mock react-dom/client for ESM ---
const renderSpy = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderSpy }));
vi.mock("react-dom/client", () => ({ createRoot: createRootMock }));

// Mock InstUISettingsProvider and App
vi.mock("@instructure/ui", () => ({
	InstUISettingsProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="instui-provider">{children}</div>
	),
}));
vi.mock("./App", () => ({
	default: function App() {
		return <div data-testid="app" />;
	},
}));

declare global {
	// eslint-disable-next-line no-var
	var __vite_ssr_module_cache__: Record<string, unknown> | undefined;
}

describe("main.tsx", () => {
	let rootElem: HTMLElement | null;

	beforeEach(() => {
		// Remove cached module to force re-execution for every test
		const viteCache = globalThis.__vite_ssr_module_cache__;
		if (typeof viteCache === "object" && viteCache !== null) {
			Object.keys(viteCache).forEach((key) => {
				if (key.includes("/main.tsx")) {
					delete viteCache[key];
				}
			});
		}
		rootElem = document.createElement("div");
		rootElem.id = "root";
		document.body.appendChild(rootElem);
		renderSpy.mockClear();
		createRootMock.mockClear();
	});

	afterEach(() => {
		const elem = document.getElementById("root");
		if (elem) elem.remove();
	});

	it("throws an error if root element is not found", async () => {
		if (rootElem?.parentNode) {
			rootElem.parentNode.removeChild(rootElem);
		}
		// Remove cached module to force re-execution
		const viteCache = globalThis.__vite_ssr_module_cache__;
		if (typeof viteCache === "object" && viteCache !== null) {
			Object.keys(viteCache).forEach((key) => {
				if (key.includes("/main.tsx")) {
					delete viteCache[key];
				}
			});
		}
		const { mountApp } = await import("./main");
		expect(() => mountApp()).toThrow("Root element not found");
	});

	it("calls createRoot with the root element", async () => {
		const { mountApp } = await import("./main");
		mountApp();
		expect(createRootMock).toHaveBeenCalledWith(rootElem);
	});

	it("renders StrictMode > InstUISettingsProvider > App", async () => {
		const { mountApp } = await import("./main");
		mountApp();
		expect(renderSpy).toHaveBeenCalledTimes(1);

		// Check the rendered tree structure
		const rendered = renderSpy.mock.calls[0][0];
		// Should be <StrictMode>
		expect(React.isValidElement(rendered)).toBe(true);
		expect(rendered.type).toBe(React.StrictMode);

		// Should contain InstUISettingsProvider
		const provider = React.Children.only(rendered.props.children);
		expect(
			provider.type.name ||
				provider.type.displayName ||
				(typeof provider.type === "string" ? provider.type : ""),
		).toMatch(/InstUISettingsProvider/);

		// Should contain App
		const app = React.Children.only(provider.props.children);
		expect(
			app.type.name ||
				app.type.displayName ||
				(typeof app.type === "string" ? app.type : ""),
		).toMatch(/App/);
	});
});
