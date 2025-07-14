import { IconUserLine, TextInput } from "@instructure/ui";
import type React from "react";
import type { SyntheticEvent } from "react";
import { NamePattern, SpacePattern } from "../utils/RegEx";
import type { SignupFormInputProps } from "./SignupForm";

const NameInput: React.FC<SignupFormInputProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
}) => {
	const isInvalidName = (name: string): boolean => {
		return !NamePattern.test(name) || SpacePattern.test(name);
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
			m = "Name is required.";
		} else if (isInvalidName(value)) {
			m = "Please input full name.";
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
			name="name"
			onBlur={handleBlur}
			onChange={handleChange}
			placeholder="Bart Simpson"
			renderBeforeInput={IconUserLine}
			renderLabel="Name"
			shouldNotWrap
			type="text"
			value={value}
		/>
	);
};
export default NameInput;
