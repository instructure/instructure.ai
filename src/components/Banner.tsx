import { Heading, Link, ScreenReaderContent, View } from "@instructure/ui";
import { InstructureBugNew } from "../assets/Logos";

interface BannerProps {
	handleButtonClick: () => void;
}

const Banner = ({ handleButtonClick }: BannerProps): React.ReactElement => {
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
				<Link as="button" onClick={handleButtonClick}>
					<Heading level="h1">
						<ScreenReaderContent>
							Instructure feature interest sign up
						</ScreenReaderContent>
						<InstructureBugNew />
					</Heading>
				</Link>
			</View>
		</View>
	);
};
export default Banner;
