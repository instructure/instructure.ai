import { AccessibleContent } from "@instructure/ui-a11y-content";
import { Alert } from "@instructure/ui-alerts";
import { IconLaunchLine } from "@instructure/ui-icons";
import { Select } from "@instructure/ui-select";
import { Tag } from "@instructure/ui-tag";
import {
	type ChangeEvent,
	type FocusEvent,
	type KeyboardEvent,
	useRef,
	useState,
} from "react";
import Features from "../assets/Features";

type FeatureOption = {
	id: string;
	label: string;
	icon?: React.ElementType;
};

type FeatureSelectProps = {
	isDisabled: boolean;
	showError: boolean;
};

const FeatureSelect: React.FC<FeatureSelectProps> = ({
	isDisabled,
	showError,
}) => {
	const sortFeatures = (features: FeatureOption[]): FeatureOption[] =>
		features.slice().sort((a, b) => a.label.localeCompare(b.label));
	const options: FeatureOption[] = sortFeatures(Features);

	const [inputValue, setInputValue] = useState<string>("");
	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [selectedOptionId, setSelectedOptionId] = useState<string[]>([]);
	const [filteredOptions, setFilteredOptions] =
		useState<FeatureOption[]>(options);
	const [announcement, setAnnouncement] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const focusInput = () => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (queryId: string): FeatureOption | undefined => {
		return options.find(({ id }) => id === queryId);
	};

	const getOptionsChangedMessage = (
		newOptions: FeatureOption[],
	): string | null => {
		let message =
			newOptions.length !== filteredOptions.length
				? `${newOptions.length} options available.`
				: null;
		if (message && newOptions.length > 0) {
			if (highlightedOptionId !== newOptions[0].id) {
				const option = getOptionById(newOptions[0].id)?.label;
				if (option) {
					message = `${option}. ${message}`;
				}
			}
		}
		return message;
	};

	const filterOptions = (value: string): FeatureOption[] => {
		return options.filter((option) =>
			option.label.toLowerCase().startsWith(value.toLowerCase()),
		);
	};

	const matchValue = () => {
		if (filteredOptions.length === 1) {
			const onlyOption = filteredOptions[0];
			if (onlyOption.label.toLowerCase() === inputValue.toLowerCase()) {
				setInputValue("");
				setSelectedOptionId([...selectedOptionId, onlyOption.id]);
				setFilteredOptions(filterOptions(""));
			}
		} else if (highlightedOptionId) {
			const highlightedOption = getOptionById(highlightedOptionId);
			if (highlightedOption && inputValue === highlightedOption.label) {
				setInputValue("");
				setFilteredOptions(filterOptions(""));
			}
		}
	};

	const handleShowOptions = (_e: React.SyntheticEvent) => {
		setIsShowingOptions(true);
	};

	const handleHideOptions = (_e: React.SyntheticEvent) => {
		setIsShowingOptions(false);
		matchValue();
	};

	const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
		setHighlightedOptionId(null);
	};

	const handleHighlightOption = (
		event: React.SyntheticEvent,
		data: { id?: string; direction?: 1 | -1 },
	) => {
		(event as any).persist();
		const { id } = data;
		if (!id) return;
		const option = getOptionById(id);
		if (!option) return;
		setHighlightedOptionId(id);
		setInputValue(event.type === "keydown" ? option.label : inputValue);
		setAnnouncement(option.label);
	};

	const handleSelectOption = (
		_e: React.SyntheticEvent,
		data: { id?: string },
	) => {
		const { id } = data;
		if (!id) return;
		const option = getOptionById(id);
		if (!option) return;
		focusInput();
		setSelectedOptionId([...selectedOptionId, id]);
		setHighlightedOptionId(null);
		setFilteredOptions(filterOptions(""));
		setInputValue("");
		setIsShowingOptions(false);
		setAnnouncement(`${option.label} selected. List collapsed.`);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const newOptions = filterOptions(value);
		setInputValue(value);
		setFilteredOptions(newOptions);
		setHighlightedOptionId(newOptions.length > 0 ? newOptions[0].id : null);
		setIsShowingOptions(true);
		setAnnouncement(getOptionsChangedMessage(newOptions));
	};

	const handleKeyDown = (event: KeyboardEvent<Element>) => {
		if (
			(event.key === "Backspace" || event.key === "Delete") &&
			inputValue === "" &&
			selectedOptionId.length > 0
		) {
			setHighlightedOptionId(null);
			setSelectedOptionId(selectedOptionId.slice(0, -1));
		}
	};

	const dismissTag = (e: React.MouseEvent, tag: string) => {
		e.stopPropagation();
		e.preventDefault();

		const newSelection = selectedOptionId.filter((id) => id !== tag);

		setSelectedOptionId(newSelection);
		setHighlightedOptionId(null);
		const option = getOptionById(tag);
		if (option) {
			setAnnouncement(`${option.label} removed`);
		}

		inputRef.current?.focus();
	};

	const renderTags = () => {
		return selectedOptionId.map((id, index) => {
			const option = getOptionById(id);
			if (!option) return null;
			return (
				<Tag
					dismissible
					key={id}
					margin={
						index > 0 ? "xxx-small xx-small xxx-small 0" : "0 xx-small 0 0"
					}
					onClick={(e) => dismissTag(e, id)}
					text={
						<AccessibleContent alt={`Remove ${option.label}`}>
							{option.icon && <option.icon />} {option.label}
						</AccessibleContent>
					}
				/>
			);
		});
	};

	return (
		<div>
			<Select
				assistiveText="Type or use arrow keys to navigate options. Multiple selections allowed."
				disabled={isDisabled}
				inputRef={(el: HTMLInputElement | null) => {
					inputRef.current = el;
				}}
				inputValue={inputValue}
				isRequired={false}
				isShowingOptions={isShowingOptions}
				messages={
					showError ? [{ text: "Short error message", type: "newError" }] : []
				}
				onBlur={handleBlur}
				onInputChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onRequestHideOptions={handleHideOptions}
				onRequestHighlightOption={handleHighlightOption}
				onRequestSelectOption={handleSelectOption}
				onRequestShowOptions={handleShowOptions}
				placeholder={selectedOptionId.length > 0 ? "" : "Ignite AI"}
				renderBeforeInput={
					selectedOptionId.length > 0 ? renderTags() : IconLaunchLine
				}
				renderLabel="Feature(s)"
			>
				{filteredOptions.length > 0 ? (
					filteredOptions.map((option) => {
						if (selectedOptionId.indexOf(option.id) === -1) {
							return (
								<Select.Option
									id={option.id}
									isHighlighted={option.id === highlightedOptionId}
									key={option.id}
									renderBeforeLabel={
										option.icon
											? () => option.icon && <option.icon />
											: undefined
									}
								>
									{option.label}
								</Select.Option>
							);
						}
						return null;
					})
				) : (
					<Select.Option id="empty-option" key="empty-option">
						---
					</Select.Option>
				)}
			</Select>
			<Alert
				liveRegion={() => {
					const el = document.getElementById("flash-messages");
					if (!el) {
						throw new Error("flash-messages element not found");
					}
					return el;
				}}
				liveRegionPoliteness="assertive"
				screenReaderOnly
			>
				{announcement}
			</Alert>
		</div>
	);
};
export default FeatureSelect;
