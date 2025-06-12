import { Link } from "@instructure/ui-link";
import { InlineSVG } from "@instructure/ui-svg-images";
import { View } from "@instructure/ui-view";

interface BannerProps {
	href?: string;
}

const Banner = ({ href }: BannerProps): React.ReactElement => {
	const logo = (
		<InlineSVG height="100%" title="Logo" viewBox="0 0 100 100" width="100%">
			<svg viewBox="0 0 53.42 53.42" xmlns="http://www.w3.org/2000/svg">
				<title>Instructure Logo</title>
				<g data-name="Layer 1" id="Layer_1-2">
					<rect fill="#0b1722" height="53.42" width="53.42" />
					<path
						d="M30.24,37.26h0c0-2.05,1.66-3.71,3.71-3.71s3.71,1.66,3.71,3.71-1.66,3.71-3.71,3.71-3.71-1.66-3.71-3.71"
						fill="#e7222a"
					/>
					<rect fill="#fff" height="28.52" width="6.18" x="19.28" y="12.45" />
				</g>
			</svg>
		</InlineSVG>
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
