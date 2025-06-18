import { IconEmailLine } from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import type React from "react";
import type { SyntheticEvent } from "react";
import type { SignupFormFieldProps } from "./SignupForm";

const EmailInput: React.FC<SignupFormFieldProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
}) => {
	const isInvalidEmail = (email: string): boolean => {
		const emailPattern =
			/^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
		return !emailPattern.test(email);
	};

	const isPersonalEmail = (email: string): boolean => {
		const emailPattern =
			/@(gmail|yahoo|outlook|hotmail|aol|icloud|mail|protonmail|zoho|yandex)\.com$/i;
		return emailPattern.test(email);
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
			m = "Email address is required.";
		} else if (isInvalidEmail(value)) {
			m = "Email address is invalid.";
		} else if (isPersonalEmail(value)) {
			m = "Input your institutional email address.";
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
			name="email"
			onBlur={handleBlur}
			onChange={handleChange}
			placeholder="bsimpson@springfield-elementary.edu"
			renderBeforeInput={IconEmailLine}
			renderLabel="Email Address"
			type="email"
			value={value}
		/>
	);
};
export default EmailInput;
