import { FormFieldGroup } from "@instructure/ui-form-field";
import {
	IconEmailLine,
	IconHomeLine,
	IconUserLine,
} from "@instructure/ui-icons";
import { TextInput } from "@instructure/ui-text-input";
import FeatureSelect from "./FeatureSelect";
import RoleSelect from "./RoleSelect";

const SignupForm = () => {
	return (
		<>
			<FormFieldGroup description="Early Adopter Program Signup">
				<TextInput
					isRequired={true}
					placeholder="Bart Simpson"
					renderBeforeInput={IconUserLine}
					renderLabel="Name"
				/>
				<TextInput
					isRequired={true}
					placeholder="bsimpson@springfield-elementary.edu"
					renderBeforeInput={IconEmailLine}
					renderLabel="Email Address"
				/>
				<RoleSelect />
				<TextInput
					isRequired={true}
					placeholder="Springfield Elementary"
					renderBeforeInput={IconHomeLine}
					renderLabel="Institution"
				/>
				<FeatureSelect />
			</FormFieldGroup>
		</>
	);
};

export default SignupForm;
