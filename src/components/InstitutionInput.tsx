import { IconHomeLine } from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import { useState } from "react";

type InstitutionInputProps = {
	isDisabled?: boolean;
};

const InstitutionInput: React.FC<InstitutionInputProps> = ({ isDisabled }) => {
	const [messages, setMessages] = useState([]);
	const [showError, setShowError] = useState(false);

	return (
		<TextInput
			disabled={isDisabled}
			isRequired={true}
			messages={showError ? messages : []}
			placeholder="Springfield Elementary"
			renderBeforeInput={IconHomeLine}
			renderLabel="Institution"
		/>
	);
};
export default InstitutionInput;
