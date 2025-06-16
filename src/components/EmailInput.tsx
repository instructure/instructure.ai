import { IconEmailLine } from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import { useState } from "react";

type EmailInputProps = {
	isDisabled?: boolean;
};

const EmailInput: React.FC<EmailInputProps> = ({ isDisabled }) => {
	const [messages, setMessages] = useState([]);
	const [showError, setShowError] = useState(false);
	return (
		<TextInput
			disabled={isDisabled}
			isRequired={true}
			messages={showError ? messages : []}
			placeholder="bsimpson@springfield-elementary.edu"
			renderBeforeInput={IconEmailLine}
			renderLabel="Email Address"
		/>
	);
};
export default EmailInput;
