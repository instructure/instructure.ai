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
	const { Instructure, Mastery } = Brands;
	const inst25 = "#0E68B3";
	const inst25h = "#0E35B3";

	const themeOverrides = {
		canvas: {
			componentOverrides: {
				Button: {
					borderRadius: "2rem",
					borderWidth: "0.125rem",
					fontWeight: 700,
					primaryActiveBackground: inst25h,
					primaryBackground: inst25,
					primaryBorderColor: inst25h,
					primaryHoverBackground: inst25h,
					primaryInverseColor: "#fff",
				},
				Link: {
					color: inst25,
					hoverColor: inst25h,
				},
				ProgressCircle: {
					meterColorSuccess: Mastery.color,
				},
				SourceCodeEditor: {
					focusBorderColor: inst25,
				},
			},
			"ic-brand-font-color-dark": Instructure.color,
			"ic-brand-primary": inst25,
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
			<View as="div" id="App">
				<View as="section">
					<Banner variant="new" />
				</View>
				<View
					as="main"
					insetBlockEnd="0"
					insetInlineStart="0"
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
		</InstUISettingsProvider>
	);
};

export default App;
