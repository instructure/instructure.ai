import { View } from "@instructure/ui-view";
import "./App.css";
import { InstUISettingsProvider } from "@instructure/emotion";
import { type FC, useEffect, useState } from "react";
import { Brands } from "./assets/Features";
import Banner from "./components/Banner";
import HelpTray from "./components/HelpTray";
import SignupModal from "./components/SignupModal";
import SubmissionModal from "./components/SubmissionModal";

const App: FC = () => {
	const { instructure, mastery } = Brands;

	const themeOverrides = {
		canvas: {
			componentOverrides: {
				Link: {
					color: "#0E68B3",
					hoverColor: "#0E35B3",
				},
				ProgressCircle: {
					meterColorSuccess: mastery.color,
				},
				SourceCodeEditor: {
					focusBorderColor: "#0E68B3",
				},
			},
			"ic-brand-font-color-dark": instructure.color,
			"ic-brand-primary": "#0E68B3",
			typography: {
				fontFamily: "circularxx, Arial, Helvetica, sans-serif",
			},
		},
	};

	useEffect(() => {
		console.info(
			"Hey, what are you doing here? 👋\n",
			"https://www.instructure.com/careers",
		);
	}, []);

	const [isTrayOpen, setIsTrayOpen] = useState<boolean>(false);
	const [hasSuccess, setSuccess] = useState<boolean>(true);
	const [hasError, setError] = useState<string | null>(null);
	const [isSubmissionModalOpen, setIsSubmissionModalOpen] =
		useState<boolean>(false);

	return (
		<InstUISettingsProvider
			theme={{
				themeOverrides: themeOverrides,
			}}
		>
			{window.location.hash === "#/test" ? (
				<View as="div" id="App">
					<View as="section">
						<Banner variant="new" />
					</View>
					<View
						as="main"
						insetBlockEnd="0"
						insetInlineEnd="0"
						padding="medium"
						position="fixed"
					>
						<SignupModal
							setError={setError}
							setIsSubmissionModalOpen={setIsSubmissionModalOpen}
							setIsTrayOpen={setIsTrayOpen}
							setSuccess={setSuccess}
						/>
					</View>
					<View as="aside">
						<HelpTray isTrayOpen={isTrayOpen} setIsTrayOpen={setIsTrayOpen} />
					</View>
					<View as="aside">
						<SubmissionModal
							hasError={hasError}
							hasSuccess={hasSuccess}
							isOpen={isSubmissionModalOpen}
							setIsOpen={setIsSubmissionModalOpen}
						/>
					</View>
				</View>
			) : (
				<View as="section">
					<Banner href="https://www.instructure.com/instructurecon/spokane" />
				</View>
			)}
		</InstUISettingsProvider>
	);
};

export default App;
