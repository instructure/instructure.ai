import {
	Checkbox,
	Focusable,
	type FormMessage,
	Heading,
	type HeadingProps,
	IconEditLine,
	IconPublishLine,
	IconPublishSolid,
	ScreenReaderContent,
	Select,
	type SelectOptionProps,
	Text,
	TextArea,
	TextInput,
	type TextProps,
	Tooltip,
	View,
	type ViewProps,
} from "@instructure/ui";
import type { FC } from "react";
import { useRef, useState } from "react";
import type { SegmentBase } from "../../types.ts";

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

	const thisRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
	const [inputValue, setInputValue] = useState<string>(safePlaceholder);
	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [selectedOptionId, setSelectedOptionId] = useState<string>(
		safeOptions[0]?.id ?? "",
	);
	const [selectedOptionIds, setselectedOptionIds] = useState<string[]>([]);
	const [bgColor, setBgColor] =
		useState<ViewProps["background"]>("transparent");

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

	const handleSelectOptions = (
		_e: React.SyntheticEvent<Element, Event>,
		data: { id?: string },
	) => {
		const option = data.id ? getOptionById(data.id) : undefined;
		if (!option || !data.id) return;
		let newSelected: string[];
		if (selectedOptionIds.includes(data.id)) {
			newSelected = selectedOptionIds.filter((id) => id !== data.id);
		} else {
			newSelected = [...selectedOptionIds, data.id];
		}
		setselectedOptionIds(newSelected);
		onChange(newSelected.map((id) => getOptionById(id)?.value).join(", "));
	};

	const handleBlur = () => thisRef.current?.blur();

	const getHeadingColor = (color: string | undefined): HeadingProps["color"] =>
		allowedHeadingColors.includes(color as HeadingProps["color"])
			? (color as HeadingProps["color"])
			: "primary";

	let hasError: boolean;

	const handleMessages = (
		inputType: SegmentBase["inputType"],
		safeValue: string,
	): FormMessage[] => {
		const messages: FormMessage[] = [];
		if (inputType === "textarea") {
			let type: FormMessage["type"] = "hint";
			if (safeValue.length > 250) {
				type = "error";
				hasError = true;
			}
			const text: FormMessage["text"] = `${safeValue.length} / 250`;
			messages.push({ text, type });
		}

		return messages;
	};

	const messages = handleMessages(inputType, safeValue);

	const renderInput = () => {
		switch (inputType) {
			case "multi-select":
				return (
					<Select
						assistiveText="Type or use arrow keys to navigate options. Multiple selections allowed."
						inputRef={(el) => {
							thisRef.current = el;
						}}
						inputValue=""
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
						onRequestSelectOption={handleSelectOptions}
						onRequestShowOptions={handleShowOptions}
						renderLabel={
							<ScreenReaderContent>{safePlaceholder}</ScreenReaderContent>
						}
					>
						{safeOptions.map((option) => {
							return (
								<Select.Option
									id={option.id}
									isHighlighted={option.id === highlightedOptionId}
									key={option.id}
									renderBeforeLabel={
										selectedOptionIds.includes(option.id) ? (
											<IconPublishSolid />
										) : (
											<IconPublishLine />
										)
									}
								>
									{option.label}
								</Select.Option>
							);
						})}
					</Select>
				);
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
							<ScreenReaderContent>{safePlaceholder}</ScreenReaderContent>
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
						renderLabel={
							<ScreenReaderContent>{safePlaceholder}</ScreenReaderContent>
						}
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
								<Text transform="capitalize">
									<Heading as="h2">
										{safeValue}{" "}
										<Tooltip
											className="screen-only"
											data-print="hidden"
											offsetY={5}
											renderTip="Edit"
										>
											<IconEditLine
												color={hasError ? "error" : "brand"}
												data-print="hidden"
												size="x-small"
											/>
										</Tooltip>
									</Heading>
								</Text>
							) : (
								<Text>
									{safeValue}{" "}
									<Tooltip data-print="hidden" offsetY={5} renderTip="Edit">
										<IconEditLine
											color={hasError ? "error" : "brand"}
											data-print="hidden"
										/>
									</Tooltip>
								</Text>
							)
						) : (
							<View
								background={bgColor}
								borderRadius="medium"
								display="inline-block"
								onMouseEnter={() => {
									setBgColor("brand");
								}}
								onMouseLeave={() => {
									setBgColor("transparent");
								}}
								padding="xx-small"
								themeOverride={{ backgroundBrand: "rgba(34, 95, 146, 0.1)" }}
							>
								{" "}
								{heading ? (
									<Text fontStyle={fontStyle}>
										<Heading
											as="h2"
											color={getHeadingColor(safeColor)}
											themeOverride={themeOverride}
										>
											<Tooltip data-print="hidden" offsetY={5} renderTip="Edit">
												{safeHint || safePlaceholder}{" "}
												<IconEditLine
													color={hasError ? "error" : "brand"}
													data-print="hidden"
													size="x-small"
												/>
											</Tooltip>
										</Heading>
									</Text>
								) : (
									<Tooltip data-print="hidden" offsetY={5} renderTip="Edit">
										<Text color={safeColor} fontStyle={fontStyle}>
											{safeHint || safePlaceholder}{" "}
											<IconEditLine
												color={hasError ? "error" : "brand"}
												data-print="hidden"
											/>
										</Text>
									</Tooltip>
								)}{" "}
							</View>
						)}
					</View>
				)
			}
		</Focusable>
	);
};

export { EditableField };
