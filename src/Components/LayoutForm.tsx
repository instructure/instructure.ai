import {
	Checkbox,
	FormFieldGroup,
	ScreenReaderContent,
	SimpleSelect,
	Text,
} from "@instructure/ui";
import type { FC } from "react";
import { DefaultLayout } from "../assets/Layout.ts";
import type { PageLayout, StateProp } from "../types.ts";

type LayoutState = StateProp<PageLayout, "layout">;

const LayoutForm: FC<LayoutState> = ({ layout, setLayout }) => {
	const handleLayoutHeaderChange = (
		_e: React.SyntheticEvent<Element, Event>,
		{ value }: { value?: string | number },
	) => {
		if (
			typeof value === "string" &&
			["horizontal", "iconOnly", "stacked"].includes(value)
		) {
			setLayout({ ...layout, header: value as PageLayout["header"] });
		}
	};

	return (
		<FormFieldGroup
			description={<ScreenReaderContent>Layout</ScreenReaderContent>}
			layout="columns"
		>
			<SimpleSelect
				defaultValue={DefaultLayout.header}
				layout="stacked"
				onChange={handleLayoutHeaderChange}
				renderLabel={<Text weight="weightRegular">Header</Text>}
			>
				{[
					{
						id: "horizontal-option",
						label: "Horizontal",
						value: "horizontal",
					},
					{ id: "iconOnly-option", label: "Icon Only", value: "iconOnly" },
					{ id: "stacked-option", label: "Stacked", value: "stacked" },
				].map((opt) => (
					<SimpleSelect.Option id={opt.id} key={opt.id} value={opt.value}>
						{opt.label}
					</SimpleSelect.Option>
				))}
			</SimpleSelect>
			<Checkbox
				defaultChecked={DefaultLayout.icon}
				label="Instructure Logo"
				labelPlacement="top"
				onChange={() => setLayout({ ...layout, icon: !layout.icon })}
				size="small"
				variant="toggle"
			/>
			<Checkbox
				defaultChecked={DefaultLayout.disclaimer}
				label="Disclaimer"
				labelPlacement="top"
				onChange={() =>
					setLayout({ ...layout, disclaimer: !layout.disclaimer })
				}
				size="small"
				variant="toggle"
			/>
			<Checkbox
				defaultChecked={DefaultLayout.copyright}
				label="Copyright Notice"
				labelPlacement="top"
				onChange={() => setLayout({ ...layout, copyright: !layout.copyright })}
				size="small"
				variant="toggle"
			/>
		</FormFieldGroup>
	);
};
export { LayoutForm };
