import {
	MonitorInstUIIcon,
	MoonInstUIIcon,
	RadioInput,
	RadioInputGroup,
	ScreenReaderContent,
	SunInstUIIcon,
	Tooltip,
	View,
} from "@instructure/ui/latest";
import { type InstUIIconProps, type RadioInputProps } from "@instructure/ui/latest";
import { type ComponentType, type FC } from "react";
import { isPreference, type ColorSchemePreference } from "./colorScheme";
import { useColorSchemeContext } from "./colorSchemeProvider";

const OPTIONS: readonly {
	value: ColorSchemePreference;
	label: string;
	Icon: ComponentType<InstUIIconProps>;
}[] = [
	{ Icon: SunInstUIIcon, label: "Light", value: "light" },
	{ Icon: MonitorInstUIIcon, label: "System", value: "system" },
	{ Icon: MoonInstUIIcon, label: "Dark", value: "dark" },
];

/**
 * RadioInputGroup only injects name/checked/onChange into children whose display name is
 * "RadioInput", so the tooltip wrapper borrows that name to stay a recognized child.
 */
const TooltipRadioInput: FC<RadioInputProps & { tip: string }> = ({ tip, ...props }) => (
	<Tooltip
		as="span"
		renderTip={tip}
	>
		<RadioInput {...props} />
	</Tooltip>
);
TooltipRadioInput.displayName = "RadioInput";

const ColorSchemeToggle: FC = () => {
	const { preference, setPreference } = useColorSchemeContext();

	return (
		<View
			as="div"
			data-print="hidden"
		>
			<RadioInputGroup
				description={<ScreenReaderContent>Color scheme</ScreenReaderContent>}
				layout="columns"
				name="color-scheme"
				onChange={(_event, value) => {
					if (isPreference(value)) {
						setPreference(value);
					}
				}}
				size="small"
				value={preference}
				variant="toggle"
			>
				{OPTIONS.map(({ value, label, Icon }) => (
					<TooltipRadioInput
						key={value}
						label={
							<>
								<Icon
									color="inherit"
									size="sm"
								/>
								<ScreenReaderContent>{label}</ScreenReaderContent>
							</>
						}
						tip={label}
						value={value}
					/>
				))}
			</RadioInputGroup>
		</View>
	);
};

export { ColorSchemeToggle };
