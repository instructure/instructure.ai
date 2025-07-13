import { Heading } from "@instructure/ui-heading";
import { Link } from "@instructure/ui-link";
import { View } from "@instructure/ui-view";
import { InstructureBugClassic } from "../assets/Logos";

interface BannerProps {
	href?: string;
	variant?: "default" | "new";
}

const Placeholder = ({ href }: BannerProps): React.ReactElement => {
	return (
		<View as="div" borderRadius="medium" maxHeight="300px" maxWidth="300px">
			<View
				as="div"
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
							<InstructureBugClassic />
						</Link>
					</Heading>
				) : (
					<InstructureBugClassic />
				)}
			</View>
		</View>
	);
};
export default Placeholder;
