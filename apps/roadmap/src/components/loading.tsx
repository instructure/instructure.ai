import { Heading, Link, List, Text, View } from "@instructure/ui";

const Loading = ({ isDark }: { isDark: boolean }) => {
	const reload = () => {
		window.location.reload();
	};

	return (
		<View
			as="div"
			background={isDark ? "primary-inverse" : "primary"}
			borderColor={isDark ? "secondary" : "primary"}
			borderRadius="1rem"
			borderWidth="small"
			color={isDark ? "primary-inverse" : "primary"}
			padding="medium"
			themeOverride={{
				backgroundPrimaryInverse: "#171f24",
				borderColorSecondary: "#2A353F",
			}}
		>
			<Heading
				color={isDark ? "primary-inverse" : "primary"}
				level="h3"
				variant="titleCardSection"
			>
				Well, this is awkward.
			</Heading>
			<Text as="p">
				If you don't see any roadmap items, here are some ways to troubleshoot:
			</Text>
			<List>
				<List.Item
					themeOverride={{
						color: isDark ? "#fff" : undefined,
					}}
				>
					Make sure you're not logged in with a site admin account.
				</List.Item>
				<List.Item
					themeOverride={{
						color: isDark ? "#fff" : undefined,
					}}
				>
					Make sure{" "}
					<Link
						color={isDark ? "link-inverse" : "link"}
						href="/roadmap/themeEditor.js"
						target="_blank"
					>
						themeEditor.js
					</Link>{" "}
					and{" "}
					<Link
						color={isDark ? "link-inverse" : "link"}
						href="/roadmap/themeEditor.css"
						target="_blank"
					>
						themeEditor.css
					</Link>{" "}
					are installed in the current Sub-Account.
				</List.Item>
				<List.Item
					themeOverride={{
						color: isDark ? "#fff" : undefined,
					}}
				>
					Make sure the iframe has a valid <Text as="code">data-roadmap</Text>{" "}
					attribute.
				</List.Item>
				<List.Item
					themeOverride={{
						color: isDark ? "#fff" : undefined,
					}}
				>
					Make sure access to{" "}
					<Link
						color={isDark ? "link-inverse" : "link"}
						href="https://instructure.ai/roadmap"
						target="_blank"
					>
						instructure.ai/roadmap
					</Link>{" "}
					is not blocked by a firewall.
				</List.Item>
				<List.Item
					themeOverride={{
						color: isDark ? "#fff" : undefined,
					}}
				>
					Try{" "}
					<Link
						color={isDark ? "link-inverse" : "link"}
						href="#"
						onClick={reload}
					>
						reloading
					</Link>{" "}
					the page.
				</List.Item>
			</List>
		</View>
	);
};

export default Loading;
