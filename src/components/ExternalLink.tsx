import { IconExternalLinkLine, Link } from "@instructure/ui";

type ExternalLinkProps = Omit<React.ComponentProps<typeof Link>, "target">;

const ExternalLink: React.FC<ExternalLinkProps> = (props) => (
	<Link {...props} target="_blank">
		{props.children} <IconExternalLinkLine />
	</Link>
);

export default ExternalLink;
