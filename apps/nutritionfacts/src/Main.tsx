import { InstUISettingsProvider } from "@instructure/ui";
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";

const root: HTMLElement =
	document.getElementById("root") ||
	((): never => {
		throw new Error("Root element not found");
	})();

const appRoot: Root = createRoot(root);

appRoot.render(
	<StrictMode>
		<InstUISettingsProvider>
			<App />
		</InstUISettingsProvider>
	</StrictMode>,
);
