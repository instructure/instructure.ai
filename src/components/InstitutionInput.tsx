import { IconHomeLine, TextInput } from "@instructure/ui";
import type React from "react";
import type { SyntheticEvent } from "react";
import { SpacePattern } from "../utils/RegEx";
import type { SignupFormInputProps } from "./SignupForm";

const InstitutionInput: React.FC<SignupFormInputProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
}) => {
	const isInvalidInstitution = (name: string): boolean => {
		return SpacePattern.test(name);
	};

	const handleChange = (
		_e: SyntheticEvent<Element, Event>,
		value: string,
	): void => {
		setMessages([]);
		setValue(value);
	};

	const handleBlur = (_e: SyntheticEvent<Element, Event>): void => {
		let m: null | string = null;
		if (value === "") {
			m = "Institution is required.";
		} else if (isInvalidInstitution(value)) {
			m = "Please input full institution name.";
		} else if (value.length < 3) {
			m = "Please input full institution name.";
		}
		if (m) {
			setMessages([{ text: m, type: "error" }]);
		}
	};

	return (
		<TextInput
			disabled={isDisabled}
			isRequired={true}
			messages={messages}
			name="institution"
			onBlur={handleBlur}
			onChange={handleChange}
			placeholder="Springfield Elementary"
			renderBeforeInput={IconHomeLine}
			renderLabel="Institution"
			shouldNotWrap
			type="text"
			value={value}
		/>
	);
};
export default InstitutionInput;
