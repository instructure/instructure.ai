import { AccessibleContent } from "@instructure/ui-a11y-content";
import { Checkbox } from "@instructure/ui-checkbox";
import { Link } from "@instructure/ui-link";
import { Text } from "@instructure/ui-text";
import type { ChangeEvent, SyntheticEvent } from "react";

const consentNotice = (
	<Text size="small">
		I consent to receive marketing communications from Instructure in accordance
		with the{" "}
		<Link
			href="https://www.instructure.com/policies/marketing-privacy"
			target="_blank"
		>
			<AccessibleContent alt="Privacy policy">
				Privacy policy {"\u29C9"}
			</AccessibleContent>
		</Link>
		.
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
