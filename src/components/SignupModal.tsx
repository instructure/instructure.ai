import { Button, IconButton } from "@instructure/ui-buttons";
import { Flex } from "@instructure/ui-flex";
import { Heading } from "@instructure/ui-heading";
import {
	IconAddSolid,
	IconPublishSolid,
	IconXSolid,
} from "@instructure/ui-icons";
import { Modal } from "@instructure/ui-modal";
import { View } from "@instructure/ui-view";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { InstructureLogo } from "../assets/Logos";
import useSubmitCallback from "../hooks/useSubmitCallback";
import SignupForm from "./SignupForm";

const SignupModal = (): React.ReactElement => {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setOpen] = useState(false);
	const submitCallback = useSubmitCallback();

	const handleButtonClick = () => {
		startTransition(() => {
			setOpen((state) => !state);
		});
	};

	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		submitCallback(new FormData(e.target as HTMLFormElement));
		setOpen(false);
	};

	return (
		<>
			<Button
				color="primary-inverse"
				disabled={isPending}
				margin="small"
				onClick={handleButtonClick}
				renderIcon={<IconAddSolid />}
				withBackground={false}
			>
				Sign up
			</Button>
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
						renderIcon={<IconPublishSolid />}
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
