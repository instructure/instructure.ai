import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { View } from "@instructure/ui-view";
import { InstructureBugClassic, InstructureBugColor } from "../assets/Logos";

interface BannerProps {
	href?: string;
}

const Banner = ({ href }: BannerProps): React.ReactElement => {
	const LogoComponent =
		window?.location?.hash === "#/test"
			? InstructureBugColor
			: InstructureBugClassic;

	return (
		<View as="div" borderRadius="medium">
			<View
				as="div"
				className="logoWrapper"
				overflowY="hidden"
				padding="medium"
			>
				{href ? (
					<Heading level="h1">
						<Link href={href}>
							<LogoComponent />
						</Link>
					</Heading>
				) : (
					<LogoComponent />
				)}
			</View>
		</View>
	);
};
export default Banner;
