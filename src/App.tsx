import { View } from "@instructure/ui-view";
import "./App.css";
import { InstUISettingsProvider } from "@instructure/emotion";
import { darken } from "@instructure/ui-color-utils";
import { canvas } from "@instructure/ui-themes";
import { type FC, useEffect, useState } from "react";
import { Brands } from "./assets/Features";
import Banner from "./components/Banner";
import HelpTray from "./components/HelpTray";
import SignupModal from "./components/SignupModal";
import SubmissionModal from "./components/SubmissionModal";

const App: FC = () => {
	const { primitives: colors } = canvas.colors;

	const themeOverrides = {
		canvas: {
			componentOverrides: {
				IconStarSolid: {
					colorWarning: colors.violet57,
				},
				Link: {
					color: colors.violet57,
					hoverColor: darken(colors.violet57, 10),
				},
				ProgressCircle: {
					meterColorSuccess: colors.sea45,
				},
				SourceCodeEditor: {
					focusBorderColor: colors.violet57,
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
			<View as="section">
				<Banner href="https://www.instructure.com/instructurecon/spokane" />
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
		</InstUISettingsProvider>
	);
};

export default App;
