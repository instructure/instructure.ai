import { IconUserLine } from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import { useState } from "react";

type NameInputProps = {
	isDisabled?: boolean;
};

const NameInput: React.FC<NameInputProps> = ({ isDisabled }) => {
	const [messages, setMessages] = useState([]);
	const [showError, setShowError] = useState(false);

	return (
		<TextInput
			disabled={isDisabled}
			isRequired={true}
			messages={showError ? messages : []}
			placeholder="Bart Simpson"
			renderBeforeInput={IconUserLine}
			renderLabel="Name"
		/>
	);
};
export default NameInput;
