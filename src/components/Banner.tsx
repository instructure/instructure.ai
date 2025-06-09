import { IconInstructureLogoLine } from "@instructure/ui-icons";
import { Link } from "@instructure/ui-link";
import { View } from "@instructure/ui-view";

interface BannerProps {
	href?: string;
}

const Banner = ({ href }: BannerProps): React.ReactElement => {
	const logo = (
		<IconInstructureLogoLine
			className="logo"
			color="primary-inverse"
			style={{ fontSize: "10rem", padding: "5rem" }}
			title="Instructure"
		/>
	);

	return (
		<View as="div" borderRadius="medium" overflowX="hidden" overflowY="hidden">
			<View as="div" className="logoWrapper" padding="medium">
				{href ? <Link href={href}>{logo}</Link> : logo}
			</View>
		</View>
	);
};
export default Banner;
