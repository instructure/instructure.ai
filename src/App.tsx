import "./App.css";
import {
	Button,
	IconAddSolid,
	IconEditSolid,
	IconInfoBorderlessLine,
	InstUISettingsProvider,
	Text,
	View,
} from "@instructure/ui";
import { type FC, useEffect, useState, useTransition } from "react";
import { Brands } from "./assets/Features";
import Banner from "./components/Banner";
import HelpTray from "./components/HelpTray";
import SignupModal from "./components/SignupModal";
import SubmissionModal from "./components/SubmissionModal";
import { readLocalStorage } from "./utils/FormData";

const App: FC = () => {
	const [isPending, startTransition] = useTransition();
	const [isTrayOpen, setIsTrayOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [hasSuccess, setSuccess] = useState<boolean>(false);
	const [hasError, setError] = useState<string | null>(null);
	const [isSubmissionModalOpen, setIsSubmissionModalOpen] =
		useState<boolean>(false);
	const hasFormData = !!readLocalStorage("formData");
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

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
					borderColor: "#fff",
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

	const handleButtonClick = () => {
		startTransition(() => {
			setIsModalOpen(!isModalOpen);
			window.location.hash = isModalOpen ? "" : "#/signup";
		});
	};

	useEffect(() => {
		console.info(
			"Hey, what are you doing here? 👋\n",
			"https://www.instructure.com/careers",
		);
	}, []);

	return (
		<InstUISettingsProvider
			theme={{
				themeOverrides: themeOverrides,
			}}
		>
			<View as="main" id="App">
				<View as="section">
					<Banner />
				</View>
				<View
					insetBlockEnd="0"
					insetInlineStart="0"
					padding="medium"
					position="fixed"
				>
					<SignupModal
						isDisabled={isDisabled}
						isOpen={isModalOpen}
						isPending={isPending}
						setError={setError}
						setIsDisabled={setIsDisabled}
						setIsOpen={setIsModalOpen}
						setIsSubmissionModalOpen={setIsSubmissionModalOpen}
						setIsTrayOpen={setIsTrayOpen}
						setSuccess={setSuccess}
						startTransition={startTransition}
					/>
					<View as="div" className="cta">
						<Button
							color="primary-inverse"
							margin="small"
							onClick={() => {
								setIsTrayOpen?.(true);
							}}
							renderIcon={<IconInfoBorderlessLine />}
						>
							<Text className="cta">Info</Text>
						</Button>
						<Button
							className="cta"
							color="primary-inverse"
							disabled={isDisabled}
							margin="small"
							onClick={handleButtonClick}
							renderIcon={hasFormData ? <IconEditSolid /> : <IconAddSolid />}
						>
							{hasFormData ? "Edit" : "Sign up"}
						</Button>
					</View>
				</View>
				<View>
					<HelpTray isTrayOpen={isTrayOpen} setIsTrayOpen={setIsTrayOpen} />
				</View>
				<View>
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
