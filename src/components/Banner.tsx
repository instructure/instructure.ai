import { Link } from "@instructure/ui-link";
import { View } from "@instructure/ui-view";
import { InstructureBug } from "../assets/Logos";

interface BannerProps {
	href?: string;
}

const Banner = ({ href }: BannerProps): React.ReactElement => {
	return (
		<View as="div" borderRadius="medium" overflowX="hidden" overflowY="hidden">
			<View as="div" className="logoWrapper" padding="medium">
				{href ? (
					<Link href={href}>
						<InstructureBug />
					</Link>
				) : (
					<InstructureBug />
				)}{" "}
			</View>
		</View>
	);
};
export default Banner;
