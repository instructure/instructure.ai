import type { FormMessage } from "@instructure/ui-form-field";
import { IconHomeLine } from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import React, { type SyntheticEvent, useState } from "react";

type InstitutionInputProps = {
	isDisabled?: boolean;
};

const InstitutionInput: React.FC<InstitutionInputProps> = ({ isDisabled }) => {
	const [messages, setMessages] = useState<FormMessage[]>([]);
	const [value, setValue] = useState<string>("");

	const isInvalidInstitution = (name: string): boolean => {
		const namePattern = /^[\p{L}\p{M}'’\-. ]+$/u;
		const spacePattern = /^[ \t]+$/;
		return !namePattern.test(name) || spacePattern.test(name);
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
			onBlur={handleBlur}
			onChange={handleChange}
			placeholder="Springfield Elementary"
			renderBeforeInput={IconHomeLine}
			renderLabel="Institution"
			type="text"
			value={value}
		/>
	);
};
export default InstitutionInput;
