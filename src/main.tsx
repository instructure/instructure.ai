import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const root: HTMLElement =
	document.getElementById("root") ||
	((): never => {
		throw new Error("Root element not found");
	})();

const appRoot: Root = createRoot(root);

appRoot.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
