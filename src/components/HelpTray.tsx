import { List } from "@instructure/ui-list";
import { Text } from "@instructure/ui-text";
import { Tray } from "@instructure/ui-tray";
import { View } from "@instructure/ui-view";

const HelpTray = ({ isTrayOpen, setIsTrayOpen }) => {
	return (
		<Tray
			label="Tray Example"
			onDismiss={() => setIsTrayOpen(false)}
			open={isTrayOpen}
			placement="start"
			size="small"
		>
			<View as="div" padding="small">
				<List delimiter="solid" isUnstyled margin="0" size="small">
					<List.Item>
						<Text size="small" weight="weightImportant">
							Discovery:
						</Text>{" "}
						lorem ipsum
					</List.Item>
					<List.Item>
						<Text size="small" weight="weightImportant">
							Experimentation:
						</Text>{" "}
						lorem ipsum
					</List.Item>
					<List.Item>
						<Text size="small" weight="weightImportant">
							Early Access:
						</Text>{" "}
						lorem ipsum
					</List.Item>
					<List.Item>
						<Text size="small" weight="weightImportant">
							Feature Preview:
						</Text>{" "}
						lorem ipsum
					</List.Item>
					<List.Item>
						<Text size="small" weight="weightImportant">
							General Access:
						</Text>{" "}
						lorem ipsum
					</List.Item>
				</List>
			</View>
		</Tray>
	);
};

export default HelpTray;
