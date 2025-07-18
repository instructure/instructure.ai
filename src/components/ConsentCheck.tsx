import { Checkbox, Text } from "@instructure/ui";
import type { ChangeEvent, SyntheticEvent } from "react";
import ExternalLink from "./ExternalLink";

const consentNotice = (
	<Text size="small">
		I consent to receive marketing communications from Instructure in accordance
		with the{" "}
		<ExternalLink href="https://www.instructure.com/policies/marketing-privacy">
			Privacy policy
		</ExternalLink>
	</Text>
);

const ConsentCheck = ({ value, setValue, messages, setMessages }) => {
	const handleBlur = (_e: SyntheticEvent<Element, Event>): void => {
		if (!value) {
			setMessages([
				{
					text: "You must consent to receive marketing communications.",
					type: "error",
				},
			]);
		} else {
			setMessages([]);
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setMessages([]);
		setValue(e.target.checked);
	};

	return (
		<Checkbox
			checked={value}
			isRequired
			label={consentNotice}
			messages={messages}
			name="consent"
			onBlur={handleBlur}
			onChange={handleChange}
			value={value}
		/>
	);
};

export default ConsentCheck;
