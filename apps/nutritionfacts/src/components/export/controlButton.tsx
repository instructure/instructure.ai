import { IconButton, Tooltip } from "@instructure/ui";
import { type SVGIconProps } from "@instructure/ui";

interface ControlButtonProps {
  label: string;
  Icon: React.ElementType<SVGIconProps>;
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
