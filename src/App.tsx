import React, {
	type FC,
	Suspense,
	useEffect,
	useState,
	useTransition,
} from "react";
import "./App.css";
import { InstUISettingsProvider, View } from "@instructure/ui";
import { Brands } from "./assets/Features";
import Banner from "./components/Banner";
import CTAButtons from "./components/CTAButtons";

const SignupModal = React.lazy(() => import("./components/SignupModal"));
const HelpTray = React.lazy(() => import("./components/HelpTray"));
const SubmissionModal = React.lazy(
	() => import("./components/SubmissionModal"),
);

const App: FC = () => {
	const [isPending, startTransition] = useTransition();
	const [isTrayOpen, setIsTrayOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [hasSuccess, setSuccess] = useState<boolean>(false);
	const [hasError, setError] = useState<string | null>(null);
	const [isSubmissionModalOpen, setIsSubmissionModalOpen] =
		useState<boolean>(false);
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
				IconButton: {
					borderRadius: "2rem",
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

	const handleModalButtonClick = () => {
		startTransition(() => {
			setIsModalOpen(!isModalOpen);
			window.location.hash = isModalOpen ? "" : "#/signup";
		});
	};

	const handleTrayButtonClick = () => {
		startTransition(() => {
			setIsTrayOpen(!isTrayOpen);
		});
	};

	useEffect(() => {
		if (window.location.hash === "#/signup") {
			setIsModalOpen(true);
		}
	}, []);

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
				<Banner handleButtonClick={handleModalButtonClick} />
				<CTAButtons
					handleModalButtonClick={handleModalButtonClick}
					handleTrayButtonClick={handleTrayButtonClick}
					isDisabled={isDisabled}
				/>
				<Suspense fallback={null}>
					{isModalOpen && (
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
					)}
					{isTrayOpen && (
						<HelpTray isTrayOpen={isTrayOpen} setIsTrayOpen={setIsTrayOpen} />
					)}
					{isSubmissionModalOpen && (
						<SubmissionModal
							hasError={hasError}
							hasSuccess={hasSuccess}
							isOpen={isSubmissionModalOpen}
							setIsOpen={setIsSubmissionModalOpen}
						/>
					)}
				</Suspense>
			</View>
		</InstUISettingsProvider>
	);
};

export default App;
