import { AccessibleContent, IconExternalLinkLine, Link } from "@instructure/ui";

type ExternalLinkProps = Omit<React.ComponentProps<typeof Link>, "target">;

const ExternalLink: React.FC<ExternalLinkProps> = (props) => (
	<Link {...props} target="_blank">
		<AccessibleContent alt={props["aria-label"] || "External link"}>
			{props.children} <IconExternalLinkLine />
		</AccessibleContent>
	</Link>
);

export default ExternalLink;
