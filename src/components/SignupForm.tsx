import { ScreenReaderContent } from "@instructure/ui-a11y-content";
import { Flex } from "@instructure/ui-flex";
import type { FormMessage } from "@instructure/ui-form-field";
import { FormFieldGroup } from "@instructure/ui-form-field";
import { Heading } from "@instructure/ui-heading";
import { IconInfoLine } from "@instructure/ui-icons";
import { Link } from "@instructure/ui-link";
import { Text } from "@instructure/ui-text";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { readLocalStorageField } from "../utils/FormData";
import ConsentCheck from "./ConsentCheck";
import EmailInput from "./EmailInput";
import FeatureSelect from "./FeatureSelect";
import InstitutionInput from "./InstitutionInput";
import NameInput from "./NameInput";
import RoleSelect from "./RoleSelect";
import SignupProgress from "./SignupProgress";

export type SignupFormInputProps = {
	isDisabled: boolean;
	value: string;
	setValue: (value: string) => void;
	messages: FormMessage[];
	setMessages: (messages: FormMessage[]) => void;
};

export type SignupFormSelectProps = SignupFormInputProps & {
	selectedOptionId: string | null;
	setSelectedOptionId: (selectedOptionId: string | null) => void;
};

export type SignupFormMultiSelectProps = SignupFormInputProps & {
	selectedOptionIds: string[];
	setSelectedOptionIds: (selectedOptionIds: string[]) => void;
};

type SignupFormProps = {
	progress: number;
	setProgress: (progress: number) => void;
	isDisabled: boolean;
	setIsDisabled?: (isDisabled: boolean) => void;
	setIsTrayOpen?: (open: boolean) => void;
	featureValueOptionIDs: string[];
	setFeatureValueOptionIDs: (ids: string[]) => void;
};

const SignupForm: React.FC<SignupFormProps> = ({
	progress,
	setProgress,
	isDisabled,
	setIsTrayOpen,
	featureValueOptionIDs,
	setFeatureValueOptionIDs,
}) => {
	const storedRole = (() => {
		const stored = readLocalStorageField("role");
		return typeof stored === "string" && stored !== "" ? stored : null;
	})();
	const hasStoredRole = typeof storedRole === "string" && storedRole !== "";
	const [nameValue, setNameValue] = useState<string>(
		readLocalStorageField("name"),
	);
	const [emailValue, setEmailValue] = useState(readLocalStorageField("email"));
	const [roleValueOptionID, setRoleValueOptionID] = useState<string | null>(
		hasStoredRole ? storedRole : null,
	);
	const [roleValue, setRoleValue] = useState<string>(
		hasStoredRole ? storedRole.toString() : "",
	);
	const [institutionValue, setInstitutionValue] = useState<string>(
		readLocalStorageField("institution"),
	);
	const [featureValue, setFeatureValue] = useState<string>("");
	const [nameMessages, setNameMessages] = useState<FormMessage[]>([]);
	const [emailMessages, setEmailMessages] = useState<FormMessage[]>([]);
	const [roleMessages, setRoleMessages] = useState<FormMessage[]>([]);
	const [institutionMessages, setInstitutionMessages] = useState<FormMessage[]>(
		[],
	);
	const [featureMessages, setFeatureMessages] = useState<FormMessage[]>([]);
	const [consentValue, setConsentValue] = useState<boolean>(false);
	const [consentMessages, setConsentMessages] = useState<FormMessage[]>([]);

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
			selectedOptionId={roleValueOptionID}
			setMessages={setRoleMessages}
			setSelectedOptionId={setRoleValueOptionID}
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
			selectedOptionIds={featureValueOptionIDs}
			setMessages={setFeatureMessages}
			setSelectedOptionIds={setFeatureValueOptionIDs}
			setValue={setFeatureValue}
			value={featureValue}
		/>,
		<ConsentCheck
			key="consentCheck"
			messages={consentMessages}
			setMessages={setConsentMessages}
			setValue={setConsentValue}
			value={consentValue}
		/>,
	];
	const formFieldCount = formFieldGroupChildren.length;

	const updateProgress = useCallback(() => {
		const fields = [
			{ messages: nameMessages, value: nameValue },
			{ messages: emailMessages, value: emailValue },
			{ messages: roleMessages, value: roleValue },
			{ messages: institutionMessages, value: institutionValue },
			{
				messages: featureMessages,
				value: featureValueOptionIDs.flat().toString(),
			},
			{ messages: consentMessages, value: consentValue ? "true" : "" },
		];
		const validFormFieldCount = fields.filter(
			(field) => field.value.trim() !== "" && field.messages.length === 0,
		).length;
		const currentProgress = Math.ceil(
			(validFormFieldCount / formFieldCount) * 100,
		);
		setProgress(currentProgress);
	}, [
		nameValue,
		emailValue,
		roleValue,
		institutionValue,
		nameMessages,
		emailMessages,
		roleMessages,
		institutionMessages,
		featureMessages,
		setProgress,
		formFieldCount,
		featureValueOptionIDs,
		consentValue,
		consentMessages,
	]);

	useEffect(() => {
		updateProgress();
	}, [updateProgress]);

	const handleInfoClick = () => setIsTrayOpen?.(true);

	const Header = (
		<Flex>
			<Flex.Item shouldGrow shouldShrink>
				<Heading as="h2" level="h3">
					Feature Interest{" "}
					<Text size="medium" weight="weightRegular">
						<Link onClick={handleInfoClick} renderIcon={IconInfoLine}>
							<ScreenReaderContent>Form help</ScreenReaderContent>
						</Link>
					</Text>
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
			ref={formFieldGroupRef}
		>
			{formFieldGroupChildren}
		</FormFieldGroup>
	);
};

export default SignupForm;
