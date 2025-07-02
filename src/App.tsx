import { View } from "@instructure/ui-view";
import "./App.css";
import { InstUISettingsProvider } from "@instructure/emotion";
import { darken } from "@instructure/ui-color-utils";
import { canvas } from "@instructure/ui-themes";
import { type FC, useState } from "react";
import { Brands } from "./assets/Features";
import Banner from "./components/Banner";
import HelpTray from "./components/HelpTray";
import SignupModal from "./components/SignupModal";

const App: FC = () => {
	const { primitives: colors } = canvas.colors;

	const themeOverrides = {
		canvas: {
			componentOverrides: {
				Link: {
					color: colors.violet57,
					hoverColor: darken(colors.violet57, 10),
				},
				ProgressCircle: {
					meterColorSuccess: colors.sea45,
				},
			},
			"ic-brand-font-color-dark": Brands.instructure.color,
			"ic-brand-primary": colors.violet45,
			typography: {
				fontFamily: "'Poppins', sans-serif",
				fontWeightBold: 500,
			},
		},
	};

	const [isTrayOpen, setIsTrayOpen] = useState<boolean>(false);

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
};

export default App;
