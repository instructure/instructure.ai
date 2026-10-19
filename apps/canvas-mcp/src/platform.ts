export type PlatformPreference = "windows" | "mac" | "auto";
export type CommandPlatform = Exclude<PlatformPreference, "auto">;

interface PlatformNavigator {
	platform?: string;
	userAgent?: string;
	userAgentData?: { platform: string };
}

export function isPlatformPreference(value: unknown): value is PlatformPreference {
	return value === "windows" || value === "mac" || value === "auto";
}

export function commandPlatform(
	preference: PlatformPreference,
	browser: PlatformNavigator | undefined = globalThis.navigator,
): CommandPlatform {
	if (preference !== "auto") return preference;
	const platform =
		browser?.userAgentData?.platform || browser?.platform || browser?.userAgent || "";
	return /Windows|Win32|Win64/iu.test(platform) ? "windows" : "mac";
}
