import {
	AccessibleContent,
	Button,
	Flex,
	Heading,
	IconButton,
	IconEmailLine,
	IconXSolid,
	Modal,
	SourceCodeEditor,
	Text,
	ToggleDetails,
	View,
} from "@instructure/ui";
import { startTransition } from "react";
import { GoldStar } from "../assets/Logos";
import { readLocalStorage, serializeFormData } from "../utils/FormData";

export type SubmissionModalProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	hasSuccess: boolean;
	hasError: string | null;
};

const SubmissionModal = ({
	isOpen,
	setIsOpen,
	hasError,
	hasSuccess,
}: SubmissionModalProps): React.ReactElement => {
	const handleButtonClick = () => {
		startTransition(() => {
			setIsOpen(false);
		});
	};

	const formData: string | FormData | null = readLocalStorage("formData");
	const serializedFormData =
		formData instanceof FormData
			? serializeFormData(formData)
			: formData || "No form data available.";

	const SuccessBody = () => (
		<Flex direction="column" justifyItems="space-around" wrap="wrap">
			<Flex.Item align="center" padding="small" shouldGrow>
				<Flex alignItems="center" direction="column" justifyItems="center">
					<GoldStar />
					<Heading level="h3">Hooray!</Heading>
				</Flex>
			</Flex.Item>
			<Flex.Item>
				<Text as="p">
					If you come across other features you're interested in, you can always
					edit this form and resubmit.
				</Text>
			</Flex.Item>
		</Flex>
	);
	const ErrorBody = () => (
		<>
			<Text as="p">
				Oops, we ran into an error while submitting the form. Don't worry, we've
				saved your input so you can try again in a few minutes.
			</Text>
			<View as="div" padding="0 0 small">
				<ToggleDetails
					defaultExpanded
					fluidWidth
					summary="Error details"
					variant="filled"
				>
					<SourceCodeEditor
						defaultValue={hasError || "An unknown error occured."}
						label="Error Message"
						language="js"
						lineWrapping
						readOnly={true}
					/>
				</ToggleDetails>
			</View>
			<View as="div" padding="0">
				<ToggleDetails
					fluidWidth
					size="medium"
					summary="Form data"
					variant="filled"
				>
					<SourceCodeEditor
						defaultValue={serializedFormData}
						label="Form Data"
						language="json"
						lineWrapping
						readOnly={true}
					/>
				</ToggleDetails>
			</View>
		</>
	);

	const emailLink = () => {
		const address = "danny@instructure.com";
		const subject = "Signup Submission Error";
		const body = ["Error", hasError, "\n", "Form data", serializedFormData];

		const href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join("\n"))}`;
		return (
			<Button color="primary" href={href} onClick={handleButtonClick}>
				<AccessibleContent alt="Send your submission to Danny">
					<IconEmailLine /> Send
				</AccessibleContent>
			</Button>
		);
	};

	return (
		<Modal
			label="Submission Status"
			onDismiss={handleButtonClick}
			open={isOpen}
			shouldCloseOnDocumentClick
			size="small"
		>
			<Modal.Header spacing="compact">
				<Flex>
					<Flex.Item padding="small" shouldGrow shouldShrink>
						<Heading as="h2" color="primary" level="h3">
							Submission {hasSuccess ? "Successful" : "Error"}
						</Heading>
					</Flex.Item>
					<Flex.Item align="start">
						<IconButton
							onClick={handleButtonClick}
							renderIcon={IconXSolid}
							screenReaderLabel="Close"
							size="small"
							withBackground={false}
							withBorder={false}
						/>
					</Flex.Item>
				</Flex>
			</Modal.Header>
			<Modal.Body padding="small medium">
				{hasSuccess ? <SuccessBody /> : <ErrorBody />}
			</Modal.Body>
			<Modal.Footer>
				<Flex>
					{hasSuccess ? (
						<Flex.Item>
							<Button color="primary" onClick={handleButtonClick}>
								Close
							</Button>
						</Flex.Item>
					) : (
						<>
							<Flex.Item shouldGrow shouldShrink>
								<Text color="secondary" size="small">
									If you continue to experience issues, email us your submission
									directly.
								</Text>
							</Flex.Item>
							<Flex.Item margin="0 0 0 x-small">{emailLink()}</Flex.Item>
						</>
					)}
				</Flex>
			</Modal.Footer>
		</Modal>
	);
};

export default SubmissionModal;
