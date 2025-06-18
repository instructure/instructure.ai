import { View } from "@instructure/ui-view";
import "./App.css";
import { InstUISettingsProvider } from "@instructure/emotion";
import { canvas } from "@instructure/ui-themes";
import Banner from "./components/Banner";
import SignupModal from "./components/SignupModal";

function App() {
	const themeOverrides = {
		canvas: {
			componentOverrides: {
				ProgressCircle: {
					meterColorBrand: canvas.colors?.primitives?.violet45,
					meterColorSuccess: canvas.colors?.primitives?.sea45,
				},
				TextInput: {
					focusOutlineColor: canvas.colors?.primitives?.violet45,
				},
			},
			typography: {
				fontFamily: "'Poppins', sans-serif",
			},
		},
	};

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
				as="aside"
				insetBlockEnd="0"
				insetInlineEnd="0"
				padding="medium"
				position="fixed"
			>
				<SignupModal />
			</View>
		</InstUISettingsProvider>
	);
}
export default App;
