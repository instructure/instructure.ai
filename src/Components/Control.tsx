import { Flex, View } from "@instructure/ui";
import type { FC } from "react";
import type { StateProp } from "../types.ts";
import { CodeControl } from "./Code.tsx";
import { DownloadControl } from "./Download.tsx";
import { ImageControl } from "./Image.tsx";
import { PrintControl } from "./Print.tsx";
import { TextControl } from "./Text.tsx";

type DarkState = StateProp<boolean, "isDark">;

const Control: FC<DarkState> = ({ isDark }) => {
	const controls = [
		<PrintControl key="print" />,
		<ImageControl key="image" />,
		<TextControl key="text" />,
		<DownloadControl key="download" />,
		<CodeControl key="code" />,
	];

	return (
		<View
			as="div"
			background={isDark ? "secondary" : "primary"}
			borderRadius="large"
			display="inline-block"
			margin="small auto"
			shadow="above"
		>
			<Flex
				alignItems="stretch"
				gap="small"
				justifyItems="center"
				padding="small"
			>
				{controls.map((control) => (
					<Flex.Item key={control.key}>{control}</Flex.Item>
				))}
			</Flex>
		</View>
	);
};
export default Control;
