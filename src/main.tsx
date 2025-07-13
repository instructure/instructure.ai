import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Placeholder from "./components/Placeholder.tsx";

const root: HTMLElement =
	document.getElementById("root") ||
	((): never => {
		throw new Error("Root element not found");
	})();

const appRoot: Root = createRoot(root);

appRoot.render(
	<StrictMode>
		{window.location.hash === "#/test" ? (
			<App />
		) : (
			<Placeholder href="https://instructurecon.com" />
		)}
	</StrictMode>,
);
