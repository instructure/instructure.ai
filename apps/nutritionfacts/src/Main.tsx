import { InstUISettingsProvider } from "@instructure/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import App from "./App";

const mountApp = () => {
  const foundRoot = document.getElementById("root");
  const root: HTMLElement =
    foundRoot ||
    (() => {
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
};

if (typeof window !== "undefined" && import.meta.env?.MODE !== "test") {
  mountApp();
}

export { mountApp };
