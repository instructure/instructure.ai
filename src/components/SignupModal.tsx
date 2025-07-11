import { debounce } from "@instructure/debounce";
import { Button, IconButton } from "@instructure/ui-buttons";
import { alpha } from "@instructure/ui-color-utils";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import {
	IconAddSolid,
	IconEditSolid,
	IconPublishLine,
	IconPublishSolid,
	IconXSolid,
} from "@instructure/ui-icons";
import { Modal } from "@instructure/ui-modal";
import { Spinner } from "@instructure/ui-spinner";
import { canvas } from "@instructure/ui-themes";
import { View } from "@instructure/ui-view";
import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { InstructureLogo } from "../assets/Logos";
import useLocalStorageCallback from "../hooks/useLocalStorageCallback";
import useSubmitCallback from "../hooks/useSubmitCallback";
import { readLocalStorage, readLocalStorageField } from "../utils/FormData";
import SignupForm from "./SignupForm";

export type SignupModalProps = {
	setIsTrayOpen?: (isOpen: boolean) => void;
	setError: (hasError: string | null) => void;
	setSuccess: (hasSuccess: boolean) => void;
	setIsSubmissionModalOpen: (isOpen: boolean) => void;
};

const SignupModal = ({
	setIsTrayOpen,
	setError,
	setSuccess,
	setIsSubmissionModalOpen,
}: SignupModalProps): React.ReactElement => {
	const initialFeatureValueOptionIDs = (() => {
		const stored = readLocalStorageField("features");
		if (typeof stored === "string") {
			return stored.split(",").filter(Boolean);
		}
		return [];
	})();

	const [isPending, startTransition] = useTransition();
	const [isOpen, setOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [shouldCleanup, setShouldCleanup] = useState(false);

	const [featureValueOptionIDs, setFeatureValueOptionIDs] = useState<string[]>(
		initialFeatureValueOptionIDs,
	);
	const submitCallback = useSubmitCallback();
	const localStorageCallback = useLocalStorageCallback();
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		if (window.location.hash === "#/signup") {
			setOpen(true);
		}
	}, []);

	const handleButtonClick = () => {
		startTransition(() => {
			setOpen((state) => !state);
			window.location.hash = isOpen ? "" : "#/signup";
		});
	};

	const hasFormData = !!readLocalStorage("formData");

	const closeModalDebounced = debounce(
		() => {
			setOpen(false);
			window.location.hash = "#";
		},
		2000,
		{ leading: false, trailing: true },
	);

	const handleFormSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setIsDisabled(true);
		try {
			const form = e.target as HTMLFormElement;
			const formData = new FormData(form);
			formData.set("features", featureValueOptionIDs.join(","));
			localStorageCallback(formData);
			await new Promise<void>((resolve) => {
				startTransition(() => {
					submitCallback(formData, { setError, setSuccess }).then(resolve);
				});
			});
			closeModalDebounced();
		} finally {
			setShouldCleanup(true);
		}
	};

	useEffect(() => {
		if (shouldCleanup && !isPending) {
			setIsDisabled(false);
			setIsLoading(false);
			setShouldCleanup(false);
			setIsSubmissionModalOpen(true);
		}
	}, [shouldCleanup, isPending, setIsSubmissionModalOpen]);

	return (
		<>
			{window.location.hash === "#/test" && (
				<Button
					color="primary-inverse"
					disabled={isDisabled}
					margin="small"
					onClick={handleButtonClick}
					renderIcon={hasFormData ? <IconEditSolid /> : <IconAddSolid />}
					withBackground={false}
				>
					{hasFormData ? "Edit" : "Signup"}
				</Button>
			)}
			<Modal
				as="form"
				id="signupForm"
				label="Signup Form"
				onDismiss={handleButtonClick}
				onSubmit={(e) => handleFormSubmit(e)}
				open={isOpen}
				overflow="fit"
				shouldCloseOnDocumentClick
				size="fullscreen"
				variant="inverse"
			>
				<Modal.Header
					themeOverride={{
						inverseBackground: "transparent",
						inverseBorderColor: "#fff",
						padding: "1rem 1.5rem 0.5rem",
					}}
				>
					<Flex>
						<Flex.Item shouldGrow shouldShrink>
							<Heading level="h1">
								<InstructureLogo />
							</Heading>
						</Flex.Item>
						<Flex.Item>
							<IconButton
								color="primary-inverse"
								margin="small"
								onClick={handleButtonClick}
								renderIcon={IconXSolid}
								screenReaderLabel="Close"
								withBackground={false}
								withBorder={false}
							/>
						</Flex.Item>
					</Flex>
				</Modal.Header>
				<Modal.Body
					themeOverride={{
						inverseBackground: "transparent",
					}}
				>
					<View
						as="div"
						background="primary"
						borderRadius="medium"
						height="inherit"
						id="formContainer"
						margin="auto"
						maxWidth="59.25rem"
						overflowX="hidden"
						overflowY="auto"
						padding="medium"
						shadow="topmost"
					>
						<SignupForm
							featureValueOptionIDs={featureValueOptionIDs}
							isDisabled={isDisabled}
							progress={progress}
							setFeatureValueOptionIDs={setFeatureValueOptionIDs}
							setIsTrayOpen={setIsTrayOpen}
							setProgress={setProgress}
						/>
					</View>
				</Modal.Body>
				<Modal.Footer
					themeOverride={{
						inverseBackground: "transparent",
						inverseBorderColor: "#ffffff",
					}}
				>
					<Button
						color="primary-inverse"
						disabled={isLoading || isDisabled || isPending || progress < 100}
						margin="small"
						renderIcon={
							isLoading ? (
								<Spinner
									renderTitle="Submitting"
									size="x-small"
									themeOverride={{
										color: canvas.colors.primitives.white,
										trackColor: alpha(canvas.colors.primitives.white, 50),
									}}
								/>
							) : progress < 100 ? (
								<IconPublishLine />
							) : (
								<IconPublishSolid />
							)
						}
						type="submit"
						withBackground={false}
					>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default SignupModal;
