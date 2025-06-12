import { Button, IconButton } from "@instructure/ui-buttons";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import { IconAddLine, IconAiSolid, IconXSolid } from "@instructure/ui-icons";
import { Modal } from "@instructure/ui-modal";
import { View } from "@instructure/ui-view";
import { useState, useTransition } from "react";
import SignupForm from "./SignupForm";

const SignupModal = (): React.ReactElement => {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setOpen] = useState(false);

	const handleButtonClick = () => {
		startTransition(() => {
			setOpen((state) => !state);
		});
		console.log("button clicked");
	};

	const handleFormSubmit = (e: Event) => {
		e.preventDefault();
		console.log("form submitted");
		setOpen(false);
	};

	return (
		<>
			<Button
				color="primary-inverse"
				disabled={isPending}
				margin="small"
				onClick={handleButtonClick}
				renderIcon={<IconAddLine />}
				withBackground={false}
			>
				Sign up
			</Button>
			<Modal
				as="form"
				id="signupForm"
				label="Hello World"
				onDismiss={handleButtonClick}
				onSubmit={() => handleFormSubmit}
				open={isOpen}
				overflow="fit"
				shouldCloseOnDocumentClick
				size="fullscreen"
				variant="inverse"
			>
				<Modal.Header
					themeOverride={{
						inverseBackground: "transparent",
						inverseBorderColor: "#ffffff",
					}}
				>
					<Flex>
						<Flex.Item shouldGrow shouldShrink>
							<Heading level="h1">Oops, there's nothing here (yet)</Heading>
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
						padding="medium"
						shadow="topmost"
					>
						<SignupForm />
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
						disabled={isPending}
						margin="small"
						onClick={handleButtonClick}
						renderIcon={<IconAiSolid />}
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
