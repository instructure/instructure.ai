import { View } from "@instructure/ui-view";
import "./App.css";
import { InstUISettingsProvider } from "@instructure/emotion";
import { darken } from "@instructure/ui-color-utils";
import { canvas } from "@instructure/ui-themes";
import { useState } from "react";
import Banner from "./components/Banner";
import HelpTray from "./components/HelpTray";
import SignupModal from "./components/SignupModal";

function App() {
	const themeOverrides = {
		canvas: {
			componentOverrides: {
				Link: {
					color: canvas.colors?.primitives?.violet57,
					hoverColor: darken(canvas.colors?.primitives?.violet57, 10),
				},
				ProgressCircle: {
					meterColorSuccess: canvas.colors?.primitives?.sea45,
				},
			},
			"ic-brand-primary": canvas.colors?.primitives?.violet45,
			typography: {
				fontFamily: "'Poppins', sans-serif",
				fontWeightBold: 500,
			},
		},
	};

	const [isTrayOpen, setIsTrayOpen] = useState(false);

	return (
		<InstUISettingsProvider
			theme={{
				themeOverrides: themeOverrides,
			}}
		>
			<View as="section">
				<Banner />
			</View>
			<View
				as="main"
				insetBlockEnd="0"
				insetInlineEnd="0"
				padding="medium"
				position="fixed"
			>
				<SignupModal setIsTrayOpen={setIsTrayOpen} />
			</View>
			<View as="aside">
				<HelpTray isTrayOpen={isTrayOpen} setIsTrayOpen={setIsTrayOpen} />
			</View>
		</InstUISettingsProvider>
	);
}
export default App;
