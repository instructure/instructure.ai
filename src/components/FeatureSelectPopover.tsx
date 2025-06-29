import { IconInfoLine } from "@instructure/ui-icons";
import { Link } from "@instructure/ui-link";
import { Popover } from "@instructure/ui-popover";
import { View } from "@instructure/ui-view";

const FeatureSelectPopover = () => {
	return (
		<Popover
			color="primary-inverse"
			placement="end top"
			renderTrigger={
				<Link aria-describedby="tip">
					<IconInfoLine />
				</Link>
			}
			shouldAlignArrow
			shouldRenderOffscreen
			shouldReturnFocus
			withArrow
		>
			<View as="div" padding="small">
				<View as="p" margin="0 small 0 0">
					Feature information goes here.
				</View>
			</View>
		</Popover>
	);
};

export default FeatureSelectPopover;
