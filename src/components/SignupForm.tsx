import { FormFieldGroup } from "@instructure/ui-form-field";
import { Heading } from "@instructure/ui-heading";
import { useState } from "react";
import EmailInput from "./EmailInput";
import FeatureSelect from "./FeatureSelect";
import InstitutionInput from "./InstitutionInput";
import NameInput from "./NameInput";
import RoleSelect from "./RoleSelect";

const SignupForm = () => {
	const [showError, setShowError] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [messages, setMessages] = useState([]);

	return (
		<FormFieldGroup
			description={
				<Heading as="h2" level="h3">
					Early Adopter Program Signup
				</Heading>
			}
			disabled={isDisabled}
			messages={showError ? messages : []}
		>
			<NameInput isDisabled={isDisabled} />
			<EmailInput isDisabled={isDisabled} />
			<RoleSelect isDisabled={isDisabled} />
			<InstitutionInput isDisabled={isDisabled} />
			<FeatureSelect isDisabled={isDisabled} />
		</FormFieldGroup>
	);
};

export default SignupForm;
