import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { dark, light } from "@instructure/ui/latest";
import { ColorSchemeProvider, ColorSchemeToggle, STORAGE_KEY } from "./";
import { brandToggleTheme } from "./colorSchemeToggle";

const renderToggle = () =>
	render(
		<ColorSchemeProvider>
			<ColorSchemeToggle />
		</ColorSchemeProvider>,
	);

describe("ColorSchemeToggle", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({
				addEventListener: vi.fn(),
				matches: false,
				removeEventListener: vi.fn(),
			})),
		);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it("renders labelled light, system and dark options in order", () => {
		renderToggle();
		const radios = screen.getAllByRole("radio");
		expect(radios.map((radio) => (radio as HTMLInputElement).value)).toEqual([
			"light",
			"system",
			"dark",
		]);
		expect(screen.getByRole("radio", { name: "Light" })).toBeTruthy();
		expect(screen.getByRole("radio", { name: "System" })).toBeTruthy();
		expect(screen.getByRole("radio", { name: "Dark" })).toBeTruthy();
		expect(screen.getByRole("radiogroup", { name: "Color scheme" })).toBeTruthy();
	});

	it("checks the system option by default", () => {
		renderToggle();
		expect((screen.getByRole("radio", { name: "System" }) as HTMLInputElement).checked).toBe(true);
	});

	it("provides a tooltip for each option", () => {
		renderToggle();
		const tips = screen.getAllByRole("tooltip", { hidden: true }).map((tip) => tip.textContent);
		expect(tips).toEqual(expect.arrayContaining(["Light", "System", "Dark"]));
	});

	it("applies and persists the selected scheme", () => {
		renderToggle();
		fireEvent.click(screen.getByRole("radio", { name: "Dark" }));
		expect(document.documentElement.dataset.colorScheme).toBe("dark");
		expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
		expect((screen.getByRole("radio", { name: "Dark" }) as HTMLInputElement).checked).toBe(true);

		fireEvent.click(screen.getByRole("radio", { name: "Light" }));
		expect(document.documentElement.dataset.colorScheme).toBe("light");
		expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
	});

	it.each([
		["light", light, "#1D354F", "#ffffff"],
		["dark", dark, "#EEF4FD", "#1D354F"],
	] as const)(
		"uses the primary brand colors instead of green in %s",
		(_name, theme, background, text) => {
			const override =
				typeof brandToggleTheme === "function"
					? brandToggleTheme({} as never, theme as never)
					: brandToggleTheme;
			expect(override).toEqual({
				toggleBackgroundSuccess: background,
				toggleHandleText: text,
			});
		},
	);
});
