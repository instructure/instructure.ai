import type { FC } from "react";
import { InstUISettingsProvider } from "@instructure/ui";

const App: FC = () => {
	return <InstUISettingsProvider>Hello, World!</InstUISettingsProvider>;
};
export default App;
