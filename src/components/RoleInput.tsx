import { IconAnnotateLine, TextInput } from "@instructure/ui";
import type React from "react";
import type { SyntheticEvent } from "react";
import type { SignupFormInputProps } from "./SignupForm";

const RoleInput: React.FC<SignupFormInputProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
}) => {
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
			m = "Role is required.";
		} else if (value.length < 3) {
			m = "Please input full role.";
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
			name="other"
			onBlur={handleBlur}
			onChange={handleChange}
			placeholder="Chief Awesome Officer"
			renderBeforeInput={IconAnnotateLine}
			renderLabel="Other Role"
			shouldNotWrap
			value={value}
		/>
	);
};
export default RoleInput;
