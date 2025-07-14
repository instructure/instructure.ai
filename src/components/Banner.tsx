import { Heading, Link, View } from "@instructure/ui";
import { InstructureBugColor } from "../assets/Logos";

interface BannerProps {
	href?: string;
	variant?: "default" | "new";
}

const Banner = ({ href }: BannerProps): React.ReactElement => {
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
							<InstructureBugColor />
						</Link>
					</Heading>
				) : (
					<InstructureBugColor />
				)}
			</View>
		</View>
	);
};
export default Banner;
