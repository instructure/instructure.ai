import { Heading, Link, ScreenReaderContent, View } from "@instructure/ui";
import { InstructureBugNew } from "../assets/Logos";

interface BannerProps {
	href?: string;
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
				<Heading level="h1">
					<ScreenReaderContent>
						Instructure feature interest sign up
					</ScreenReaderContent>
					{href ? (
						<Link href={href}>
							<InstructureBugNew />
						</Link>
					) : (
						<InstructureBugNew />
					)}
				</Heading>
			</View>
		</View>
	);
};
export default Banner;
