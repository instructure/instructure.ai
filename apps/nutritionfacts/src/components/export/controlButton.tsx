import { IconButton, Tooltip } from "@instructure/ui/latest";
import { type InstUIIconProps } from "@instructure/ui/latest";

interface ControlButtonProps {
	label: string;
	Icon: React.ElementType<InstUIIconProps>;
	onClick: () => void;
	background?: boolean;
	disabled?: boolean;
	color?: "primary" | "primary-inverse";
	border?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
	label,
	Icon,
	onClick,
	background = false,
	disabled = false,
	color = "primary",
	border = false,
}) => (
	<Tooltip
		className="screen-only"
		data-print="hidden"
		offsetY={5}
		placement="top"
		renderTip={label}
	>
		<IconButton
			color={color}
			disabled={disabled}
			onClick={onClick}
			screenReaderLabel={label}
			withBackground={background}
			withBorder={border}
		>
			<Icon />
		</IconButton>
	</Tooltip>
);

export { ControlButton };
