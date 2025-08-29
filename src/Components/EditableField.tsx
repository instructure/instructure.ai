import {
	Checkbox,
	Focusable,
	type FormMessage,
	Heading,
	type HeadingProps,
	IconEditLine,
	ScreenReaderContent,
	Select,
	type SelectOptionProps,
	Text,
	TextArea,
	TextInput,
	type TextProps,
	View,
} from "@instructure/ui";
import type { FC } from "react";
import { useRef, useState } from "react";
import type { SegmentBase } from "../types.ts";

type AllowedColor = TextProps["color"];

type EditableFieldProps = {
	value: string | undefined;
	placeholder: string | undefined;
	onChange: (value: string) => void;
	heading?: boolean;
	hint?: string | undefined;
	color?: AllowedColor;
	themeOverride?: object;
	fontStyle?: TextProps["fontStyle"];
	size?: TextProps["size"];
	dataPrint?: string;
	inputType?: SegmentBase["inputType"];
	selectOptions?: string[];
};

const EditableField: FC<EditableFieldProps> = ({
	value,
	placeholder,
	onChange,
	heading = false,
	hint,
	color = "brand",
	themeOverride,
	fontStyle,
	size,
	dataPrint,
	inputType = "text",
	selectOptions,
}) => {
	const safeValue = value ?? "";
	const safePlaceholder = placeholder ?? "";
	const safeHint = hint ?? "";
	const safeOptions: SelectOptionProps[] = (selectOptions ?? []).map((opt) => ({
		id: opt,
		label: opt,
		value: opt,
	}));

	const thisRef = useRef<
		HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	>(null);
	const [inputValue, setInputValue] = useState(safePlaceholder);
	const [isShowingOptions, setIsShowingOptions] = useState(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [selectedOptionId, setSelectedOptionId] = useState(
		safeOptions[0]?.id ?? "",
	);

	const safeColor: AllowedColor = color ?? "primary";

	const allowedHeadingColors: HeadingProps["color"][] = [
		"ai",
		"inherit",
		"primary",
		"primary-inverse",
		"secondary",
		"secondary-inverse",
	];

	const focusInput = () => thisRef.current?.focus();

	const getOptionById = (queryId: string) => {
		return safeOptions.find(({ id }) => id === queryId);
	};

	const handleShowOptions = (event: React.SyntheticEvent<Element, Event>) => {
		setIsShowingOptions(true);
		if (inputValue || selectedOptionId || safeOptions.length === 0) return;
		const keyEvent = event as React.KeyboardEvent<Element>;

		switch (keyEvent.key) {
			case "ArrowDown":
				return handleHighlightOption(event, { id: safeOptions[0].id });
			case "ArrowUp":
				return handleHighlightOption(event, {
					id: safeOptions[safeOptions.length - 1].id,
				});
		}
	};

	const handleHideOptions = () => {
		const optionLabel = getOptionById(selectedOptionId)?.label ?? "";
		setIsShowingOptions(false);
		setHighlightedOptionId(null);
		setSelectedOptionId(selectedOptionId ? selectedOptionId : "");
		setInputValue(optionLabel);
	};

	const handleSelectBlur = () => setHighlightedOptionId(null);

	const handleHighlightOption = (
		_event: React.SyntheticEvent<Element, Event>,
		data: { id?: string; direction?: -1 | 1 },
	) => {
		if (data.id) {
			setHighlightedOptionId(data.id);
			setInputValue(inputValue);
		}
	};

	const handleSelectOption = (
		_event: React.SyntheticEvent<Element, Event>,
		data: { id?: string },
	) => {
		focusInput();
		const option = data.id ? (getOptionById(data.id)?.label ?? "") : "";
		setSelectedOptionId(data.id ?? "");
		setInputValue(option);
		setIsShowingOptions(false);
		onChange(option);
		handleBlur();
	};

	const handleBlur = () => thisRef.current?.blur();

	const getHeadingColor = (color: string | undefined): HeadingProps["color"] =>
		allowedHeadingColors.includes(color as HeadingProps["color"])
			? (color as HeadingProps["color"])
			: "primary";

	const handleMessages = (
		inputType: SegmentBase["inputType"],
		safeValue: string,
	): FormMessage[] => {
		const messages: FormMessage[] = [];
		if (inputType === "textarea") {
			let type: FormMessage["type"] = "hint";
			if (safeValue.length > 250) type = "error";
			const text: FormMessage["text"] = `${safeValue.length} / 250`;
			messages.push({ text, type });
		}
		return messages;
	};

	const renderInput = () => {
		const messages = handleMessages(inputType, safeValue);
		switch (inputType) {
			case "checkbox":
				return (
					<Checkbox
						checked={safeValue === "Yes"}
						label={<ScreenReaderContent>{safePlaceholder}</ScreenReaderContent>}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							onChange(e.target.checked ? "Yes" : "No")
						}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleBlur();
							}
						}}
					/>
				);
			case "textarea":
				return (
					<TextArea
						autoGrow={false}
						label={<ScreenReaderContent>{safePlaceholder}</ScreenReaderContent>}
						messages={messages}
						onBlur={handleBlur}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === "Escape") {
								handleBlur();
							}
						}}
						placeholder={safePlaceholder}
						textareaRef={(el) => {
							thisRef.current = el;
						}}
						value={safeValue}
					/>
				);
			case "select":
				return (
					<Select
						assistiveText="Use arrow keys to navigate options."
						inputRef={(el) => {
							thisRef.current = el;
						}}
						inputValue={inputValue}
						isShowingOptions={isShowingOptions}
						onBlur={handleSelectBlur}
						onFocus={() => {
							focusInput();
							setIsShowingOptions(true);
						}}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								handleSelectBlur();
								handleBlur();
							}
						}}
						onRequestHideOptions={handleHideOptions}
						onRequestHighlightOption={handleHighlightOption}
						onRequestSelectOption={handleSelectOption}
						onRequestShowOptions={handleShowOptions}
						renderLabel={
							<ScreenReaderContent>Single Select</ScreenReaderContent>
						}
					>
						{safeOptions.map((option) => (
							<Select.Option
								id={option.id}
								isHighlighted={option.id === highlightedOptionId}
								isSelected={option.id === selectedOptionId}
								key={option.id}
							>
								{option.label}
							</Select.Option>
						))}
					</Select>
				);
			default:
				return (
					<TextInput
						display="inline-block"
						inputRef={(el) => {
							thisRef.current = el;
						}}
						messages={messages}
						onBlur={handleBlur}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === "Escape") {
								handleBlur();
							}
						}}
						placeholder={safePlaceholder}
						value={safeValue}
					/>
				);
		}
	};

	return (
		<Focusable>
			{({ focused }) =>
				focused ? (
					renderInput()
				) : (
					<View
						data-print={dataPrint ?? (safeValue.length ? "" : "hidden")}
						tabIndex={0}
					>
						{safeValue.length ? (
							heading ? (
								<Heading as="h2">
									{safeValue}{" "}
									<IconEditLine
										color="brand"
										data-print="hidden"
										size="x-small"
									/>
								</Heading>
							) : (
								<Text>
									{safeValue} <IconEditLine color="brand" data-print="hidden" />
								</Text>
							)
						) : heading ? (
							<Heading
								as="h2"
								color={getHeadingColor(safeColor)}
								themeOverride={themeOverride}
							>
								<Text fontStyle={fontStyle} size={size}>
									{safeHint || safePlaceholder} <IconEditLine />
								</Text>
							</Heading>
						) : (
							<Text color={safeColor} fontStyle={fontStyle}>
								{safeHint || safePlaceholder} <IconEditLine />
							</Text>
						)}
					</View>
				)
			}
		</Focusable>
	);
};

export { EditableField };
