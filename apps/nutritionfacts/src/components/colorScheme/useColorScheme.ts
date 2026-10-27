import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import {
	DARK_QUERY,
	applyColorScheme,
	getSystemScheme,
	readPreference,
	resolveScheme,
	writePreference,
	type ColorScheme,
	type ColorSchemePreference,
} from "./colorScheme";

interface UseColorSchemeOptions {
	/** Ignores the stored preference and always uses this scheme (e.g. embedded iframes). */
	forced?: ColorScheme;
}

interface UseColorSchemeResult {
	preference: ColorSchemePreference;
	resolved: ColorScheme;
	setPreference: (preference: ColorSchemePreference) => void;
}

const subscribeToSystem = (onChange: () => void) => {
	const mediaQuery = globalThis.matchMedia?.(DARK_QUERY);
	mediaQuery?.addEventListener("change", onChange);
	return () => mediaQuery?.removeEventListener("change", onChange);
};

const getServerScheme = (): ColorScheme => "light";

const useColorScheme = ({ forced }: UseColorSchemeOptions = {}): UseColorSchemeResult => {
	const [preference, setPreferenceState] = useState<ColorSchemePreference>(() =>
		forced ? forced : readPreference(),
	);
	const system = useSyncExternalStore(subscribeToSystem, getSystemScheme, getServerScheme);
	const [isPrinting, setIsPrinting] = useState(false);
	const resolved = isPrinting ? "light" : (forced ?? resolveScheme(preference, system));

	// Print always uses the light theme; flushSync applies it before the browser snapshots the page.
	useEffect(() => {
		const before = () => flushSync(() => setIsPrinting(true));
		const after = () => setIsPrinting(false);
		globalThis.addEventListener("beforeprint", before);
		globalThis.addEventListener("afterprint", after);
		return () => {
			globalThis.removeEventListener("beforeprint", before);
			globalThis.removeEventListener("afterprint", after);
		};
	}, []);

	const setPreference = useCallback(
		(next: ColorSchemePreference) => {
			if (forced) {
				return;
			}
			setPreferenceState(next);
			writePreference(next);
		},
		[forced],
	);

	useLayoutEffect(() => {
		applyColorScheme(resolved);
	}, [resolved]);

	return { preference: forced ?? preference, resolved, setPreference };
};

export { useColorScheme, type UseColorSchemeOptions, type UseColorSchemeResult };
