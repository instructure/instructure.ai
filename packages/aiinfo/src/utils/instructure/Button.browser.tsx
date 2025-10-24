import type { ButtonProps } from "@instructure/ui";
import * as React from "react";

// IMPORTANT: We avoid static imports, so Vite won't try to prebundle a peer
// that the consumer didn't install. The /* @vite-ignore */ keeps the path dynamic.
async function tryImport(id: string) {
	try {
		return await import(/* @vite-ignore */ id);
	} catch {
		return null;
	}
}

type InstUIButton = React.ComponentType<ButtonProps>;

let cached: { Button: InstUIButton } | null = null;
async function load() {
	if (cached) return cached;
	const umbrella = await tryImport("@instructure/ui");
	const leaf = umbrella ? null : await tryImport("@instructure/ui-buttons");
	const mod = umbrella ?? leaf;

	if (!mod || !("Button" in mod)) {
		throw new Error(
			"Neither '@instructure/ui' nor '@instructure/ui-buttons' is installed. Install one to enable Button support.",
		);
	}
	cached = { Button: (mod as unknown as { Button: InstUIButton }).Button };
	return cached;
}

// A tiny wrapper that renders once the real Button is loaded.
export const Button: InstUIButton = function ButtonProxy(props: ButtonProps) {
	const CompRef = React.useRef<InstUIButton | null>(cached?.Button ?? null);
	const [, force] = React.useReducer((x) => x + 1, 0);

	React.useEffect(() => {
		let mounted = true;
		if (!CompRef.current) {
			load()
				.then((m) => {
					if (mounted) {
						CompRef.current = m.Button;
						force();
					}
				})
				.catch((e) => {
					// surface the error on screen for easier diagnosis
					console.error(e);
				});
		}
		return () => {
			mounted = false;
		};
	}, []);

	const Impl = CompRef.current;
	// You can return null, a spinner, or a minimal button skeleton
	return Impl ? <Impl {...props} /> : null;
};
