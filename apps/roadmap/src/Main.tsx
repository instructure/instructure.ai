import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import App from "./App.tsx";
import "./Main.css";
import "./assets/fonts/AtkinsonHyperlegibleNext.css";

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
