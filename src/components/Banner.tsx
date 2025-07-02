import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { View } from "@instructure/ui-view";
import { InstructureBugClassic, InstructureBugColor } from "../assets/Logos";

interface BannerProps {
	href?: string;
}

const Banner = ({ href }: BannerProps): React.ReactElement => {
	const isTestRoute =
		typeof window !== "undefined" && window.location.hash === "#/test";
	const LogoComponent = isTestRoute
		? InstructureBugColor
		: InstructureBugClassic;

	return (
		<View as="div" borderRadius="medium" overflowX="hidden" overflowY="hidden">
			<View as="div" className="logoWrapper" padding="medium">
				{href ? (
					<Link href={href}>
						<Heading as="h1" level="h1">
							<LogoComponent />
						</Heading>
					</Link>
				) : (
					<LogoComponent />
				)}
			</View>
		</View>
	);
};
export default Banner;
