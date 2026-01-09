import { StrictMode } from "react";
import { type Root, createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./main.css";
import { InstUISettingsProvider } from "@instructure/ui";

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
