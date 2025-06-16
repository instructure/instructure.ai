import { FormFieldGroup } from "@instructure/ui-form-field";
import {
	IconEmailLine,
	IconHomeLine,
	IconUserLine,
} from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import { useState } from "react";
import FeatureSelect from "./FeatureSelect";
import RoleSelect from "./RoleSelect";

const SignupForm = () => {
	const [showError, setShowError] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	return (
		<FormFieldGroup
			description="Early Adopter Program Signup"
			disabled={isDisabled}
		>
			<TextInput
				isRequired={true}
				messages={
					showError
						? [
								{
									text: "Short error message",
									type: "newError",
								},
							]
						: []
				}
				placeholder="Bart Simpson"
				renderBeforeInput={IconUserLine}
				renderLabel="Name"
			/>
			<TextInput
				isRequired={true}
				messages={
					showError
						? [
								{
									text: "Short error message",
									type: "newError",
								},
							]
						: []
				}
				placeholder="bsimpson@springfield-elementary.edu"
				renderBeforeInput={IconEmailLine}
				renderLabel="Email Address"
			/>
			<RoleSelect isDisabled={isDisabled} showError={showError} />
			<TextInput
				isRequired={true}
				messages={
					showError
						? [
								{
									text: "Short error message",
									type: "newError",
								},
							]
						: []
				}
				placeholder="Springfield Elementary"
				renderBeforeInput={IconHomeLine}
				renderLabel="Institution"
			/>
			<FeatureSelect isDisabled={isDisabled} showError={showError} />
		</FormFieldGroup>
	);
};

export default SignupForm;
