import "./assets/fonts/AtkinsonHyperlegibleNext.css";
import "./main.css";
import App from "./app.tsx";
import { type Root, createRoot } from "react-dom/client";
import { StrictMode } from "react";

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
