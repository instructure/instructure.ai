import { View } from "@instructure/ui-view";
import "./App.css";
import { InstUISettingsProvider } from "@instructure/emotion";
import Banner from "./components/Banner";
import SignupModal from "./components/SignupModal";

function App() {
	return (
		<InstUISettingsProvider>
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
