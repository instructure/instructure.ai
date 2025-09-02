import { IconButton, type SVGIconProps, Tooltip } from "@instructure/ui";

type ControlButtonProps = {
	label: string;
	Icon: React.ElementType<SVGIconProps>;
	onClick: () => void;
	background?: boolean;
};

const ControlButton: React.FC<ControlButtonProps> = ({
	label,
	Icon,
	onClick,
	background = false,
}) => (
	<Tooltip
		className="screen-only"
		data-print="hidden"
		offsetY={5}
		placement="top"
		renderTip={label}
	>
		<IconButton
			color="primary"
			onClick={onClick}
			screenReaderLabel={label}
			withBackground={background}
		>
			<Icon />
		</IconButton>
	</Tooltip>
);

export { ControlButton };
