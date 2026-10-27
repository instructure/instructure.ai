import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { type Root } from "react-dom/client";
import App from "./app";
import { ColorSchemeProvider } from "./components/colorScheme";

const mountApp = () => {
	const foundRoot = document.getElementById("root");
	const root: HTMLElement =
		foundRoot ||
		(() => {
			throw new Error("Root element not found");
		})();

	const appRoot: Root = createRoot(root);
	const isInIframe = globalThis.self !== globalThis.top;

	appRoot.render(
		<StrictMode>
			<ColorSchemeProvider forced={isInIframe ? "light" : undefined}>
				<App />
			</ColorSchemeProvider>
		</StrictMode>,
	);
};

if (typeof globalThis.window !== "undefined" && import.meta.env?.MODE !== "test") {
	mountApp();
}

export { mountApp };
