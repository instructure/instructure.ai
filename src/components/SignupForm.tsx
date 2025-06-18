import { Flex } from "@instructure/ui-flex";
import type { FormMessage } from "@instructure/ui-form-field";
import { FormFieldGroup } from "@instructure/ui-form-field";
import { Heading } from "@instructure/ui-heading";
import type React from "react";
import { useRef, useState } from "react";
import EmailInput from "./EmailInput";
import FeatureSelect from "./FeatureSelect";
import InstitutionInput from "./InstitutionInput";
import NameInput from "./NameInput";
import RoleSelect from "./RoleSelect";
import SignupProgress from "./SignupProgress";

export type SignupFormFieldProps<T extends string | string[]> = {
	isDisabled: boolean;
	value: T;
	setValue: (value: T) => void;
	messages: FormMessage[];
	setMessages: (messages: FormMessage[]) => void;
};

const SignupForm = () => {
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [nameValue, setNameValue] = useState<string>("");
	const [emailValue, setEmailValue] = useState("");
	const [roleValue, setRoleValue] = useState("");
	const [institutionValue, setInstitutionValue] = useState<string>("");
	const [featureValue, setFeatureValue] = useState<string[]>([]);
	const [nameMessages, setNameMessages] = useState<FormMessage[]>([]);
	const [emailMessages, setEmailMessages] = useState<FormMessage[]>([]);
	const [roleMessages, setRoleMessages] = useState<FormMessage[]>([]);
	const [institutionMessages, setInstitutionMessages] = useState<FormMessage[]>(
		[],
	);
	const [featureMessages, setFeatureMessages] = useState<FormMessage[]>([]);

	const formFieldGroupRef = useRef<FormFieldGroup | null>(null);

	const formFieldGroupChildren = [
		<NameInput
			isDisabled={isDisabled}
			key="nameInput"
			messages={nameMessages}
			setMessages={setNameMessages}
			setValue={setNameValue}
			value={nameValue}
		/>,
		<EmailInput
			isDisabled={isDisabled}
			key="emailInput"
			messages={emailMessages}
			setMessages={setEmailMessages}
			setValue={setEmailValue}
			value={emailValue}
		/>,
		<RoleSelect
			isDisabled={isDisabled}
			key="roleSelect"
			messages={roleMessages}
			setMessages={setRoleMessages}
			setValue={setRoleValue}
			value={roleValue}
		/>,
		<InstitutionInput
			isDisabled={isDisabled}
			key="institutionInput"
			messages={institutionMessages}
			setMessages={setInstitutionMessages}
			setValue={setInstitutionValue}
			value={institutionValue}
		/>,
		<FeatureSelect
			isDisabled={isDisabled}
			key="featureSelect"
			messages={featureMessages}
			setMessages={setFeatureMessages}
			setValue={setFeatureValue}
			value={featureValue}
		/>,
	];
	const formFieldCount = formFieldGroupChildren.length;

	const validFormFieldCount = (): number => {
		const count = 0;

		return count;
	};

	const handleChange = (e: React.FocusEvent<Element>) => {
		e.preventDefault();
		//console.log("formFieldCount", formFieldCount);
		console.log("validFormFieldCount", validFormFieldCount());
	};

	const Header = (
		<Flex>
			<Flex.Item shouldGrow shouldShrink>
				<Heading as="h2" level="h3">
					Early Adopter Program Signup
				</Heading>
			</Flex.Item>
			<Flex.Item>
				<SignupProgress status={progress} />
			</Flex.Item>
		</Flex>
	);

	return (
		<FormFieldGroup
			description={Header}
			disabled={isDisabled}
			onBlur={handleChange}
			ref={formFieldGroupRef}
		>
			{formFieldGroupChildren}
		</FormFieldGroup>
	);
};

export default SignupForm;
