type ColorScheme = "light" | "dark";
type ColorSchemePreference = ColorScheme | "system";

const STORAGE_KEY = "nutritionfacts:color-scheme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const PREFERENCES: readonly ColorSchemePreference[] = ["light", "system", "dark"];

const isPreference = (value: unknown): value is ColorSchemePreference =>
	typeof value === "string" && (PREFERENCES as readonly string[]).includes(value);

// Storage access can throw (privacy mode, sandboxed iframes), so fall back to "system".
const readPreference = (): ColorSchemePreference => {
	try {
		const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
		return isPreference(stored) ? stored : "system";
	} catch {
		return "system";
	}
};

const writePreference = (preference: ColorSchemePreference): void => {
	try {
		globalThis.localStorage?.setItem(STORAGE_KEY, preference);
	} catch {
		// Ignore storage failures; the preference still applies for this session.
	}
};

const getSystemScheme = (): ColorScheme =>
	globalThis.matchMedia?.(DARK_QUERY).matches ? "dark" : "light";

const resolveScheme = (preference: ColorSchemePreference, system: ColorScheme): ColorScheme =>
	preference === "system" ? system : preference;

const applyColorScheme = (scheme: ColorScheme): void => {
	document.documentElement.dataset.colorScheme = scheme;
};

export {
	DARK_QUERY,
	PREFERENCES,
	STORAGE_KEY,
	applyColorScheme,
	getSystemScheme,
	isPreference,
	readPreference,
	resolveScheme,
	writePreference,
	type ColorScheme,
	type ColorSchemePreference,
};
