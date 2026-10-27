import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import {
	ColorSchemeProvider,
	STORAGE_KEY,
	readPreference,
	useColorScheme,
	useColorSchemeContext,
} from "./";

type Listener = (event: MediaQueryListEvent) => void;

const mockMatchMedia = (initialDark: boolean) => {
	let matches = initialDark;
	const listeners = new Set<Listener>();
	const mql = {
		addEventListener: vi.fn((_type: string, listener: Listener) => listeners.add(listener)),
		get matches() {
			return matches;
		},
		media: "(prefers-color-scheme: dark)",
		removeEventListener: vi.fn((_type: string, listener: Listener) => listeners.delete(listener)),
	};
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => mql),
	);
	return {
		listeners,
		setDark: (next: boolean) => {
			matches = next;
			listeners.forEach((listener) => listener({ matches: next } as MediaQueryListEvent));
		},
	};
};

describe("color scheme", () => {
	beforeEach(() => {
		localStorage.clear();
		delete document.documentElement.dataset.colorScheme;
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	describe("readPreference", () => {
		it("defaults to system", () => {
			expect(readPreference()).toBe("system");
		});

		it("ignores invalid stored values", () => {
			localStorage.setItem(STORAGE_KEY, "sepia");
			expect(readPreference()).toBe("system");
		});

		it("falls back to system when storage throws", () => {
			vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
				throw new Error("denied");
			});
			expect(readPreference()).toBe("system");
		});
	});

	describe("useColorScheme", () => {
		it("resolves system preference from prefers-color-scheme", () => {
			mockMatchMedia(true);
			const { result } = renderHook(() => useColorScheme());
			expect(result.current.preference).toBe("system");
			expect(result.current.resolved).toBe("dark");
			expect(document.documentElement.dataset.colorScheme).toBe("dark");
		});

		it("follows live system changes while on system", () => {
			const media = mockMatchMedia(false);
			const { result } = renderHook(() => useColorScheme());
			expect(document.documentElement.dataset.colorScheme).toBe("light");

			act(() => media.setDark(true));
			expect(result.current.resolved).toBe("dark");
			expect(document.documentElement.dataset.colorScheme).toBe("dark");
		});

		it("uses and persists an explicit preference", () => {
			const media = mockMatchMedia(true);
			const { result } = renderHook(() => useColorScheme());

			act(() => result.current.setPreference("light"));
			expect(result.current.preference).toBe("light");
			expect(result.current.resolved).toBe("light");
			expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
			expect(document.documentElement.dataset.colorScheme).toBe("light");

			act(() => media.setDark(false));
			act(() => media.setDark(true));
			expect(result.current.resolved).toBe("light");
		});

		it("restores the stored preference", () => {
			mockMatchMedia(false);
			localStorage.setItem(STORAGE_KEY, "dark");
			const { result } = renderHook(() => useColorScheme());
			expect(result.current.preference).toBe("dark");
			expect(document.documentElement.dataset.colorScheme).toBe("dark");
		});

		it("ignores stored and system values when forced", () => {
			mockMatchMedia(true);
			localStorage.setItem(STORAGE_KEY, "dark");
			const { result } = renderHook(() => useColorScheme({ forced: "light" }));
			expect(result.current.resolved).toBe("light");

			act(() => result.current.setPreference("dark"));
			expect(result.current.resolved).toBe("light");
			expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
			expect(document.documentElement.dataset.colorScheme).toBe("light");
		});
	});

	describe("ColorSchemeProvider", () => {
		const Probe = () => {
			const { preference, resolved } = useColorSchemeContext();
			return <span data-testid="probe">{`${preference}:${resolved}`}</span>;
		};

		it("exposes the color scheme through context", () => {
			mockMatchMedia(true);
			render(
				<ColorSchemeProvider>
					<Probe />
				</ColorSchemeProvider>,
			);
			expect(screen.getByTestId("probe").textContent).toBe("system:dark");
		});

		it("throws when used outside the provider", () => {
			vi.spyOn(console, "error").mockImplementation(() => {});
			expect(() => render(<Probe />)).toThrow(/ColorSchemeProvider/);
		});
	});
});
