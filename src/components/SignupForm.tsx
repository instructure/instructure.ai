import { FormFieldGroup } from "@instructure/ui-form-field";
import { Text } from "@instructure/ui-text";
import { TextInput } from "@instructure/ui-text-input";

const SignupForm = () => {
	return (
		<FormFieldGroup description="Sign up form">
			<TextInput
				placeholder="if you hit enter here, it should submit the form"
				renderLabel="Example"
			/>
			<Text lineHeight="double">This is text.</Text>
		</FormFieldGroup>
	);
};

export default SignupForm;
