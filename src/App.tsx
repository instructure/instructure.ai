import { View } from "@instructure/ui-view";
import "./App.css";
import Banner from "./components/Banner";

function App() {
	return (
		<View as="div">
			<View as="section">
				<Banner href="https://www.instructure.com/instructurecon/spokane" />
			</View>

			<View
				as="aside"
				insetBlockEnd="0"
				insetInlineEnd="0"
				padding="medium"
				position="fixed"
			>
				{/* <SignupModal /> */}
			</View>
		</View>
	);
}
export default App;
