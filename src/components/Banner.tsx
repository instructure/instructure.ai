import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { View } from "@instructure/ui-view";
import { InstructureBugClassic, InstructureBugColor } from "../assets/Logos";

interface BannerProps {
	href?: string;
	variant?: "default" | "new";
}

const Banner = ({
	href,
	variant = "default",
}: BannerProps): React.ReactElement => {
	const LogoComponent =
		variant === "new" ? InstructureBugColor : InstructureBugClassic;

	return (
		<View as="div" borderRadius="medium" maxHeight="300px" maxWidth="300px">
			<View
				as="div"
				className="logoWrapper"
				height="300px"
				overflowX="hidden"
				overflowY="hidden"
				padding="medium"
				position="relative"
				style={{ aspectRatio: "1 / 1" }}
				width="300px"
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
