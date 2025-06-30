import { AccessibleContent } from "@instructure/ui-a11y-content";
import { Alert } from "@instructure/ui-alerts";
import { IconLaunchLine } from "@instructure/ui-icons";
import { Select } from "@instructure/ui-select";
import { Tag } from "@instructure/ui-tag";
import React, {
	type ChangeEvent,
	type FocusEvent,
	type KeyboardEvent,
	useRef,
	useState,
} from "react";
import Features, { type FeatureInterface } from "../assets/Features";
import type { SignupFormMultiSelectProps } from "./SignupForm";

const FeatureSelect: React.FC<SignupFormMultiSelectProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
}) => {
	const sortFeatures = (features: FeatureInterface[]): FeatureInterface[] =>
		features.slice().sort((a, b) => a.label.localeCompare(b.label));
	const options: FeatureInterface[] = sortFeatures(Features);

	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [selectedOptionId, setSelectedOptionId] = useState<string[]>([]);
	const [filteredOptions, setFilteredOptions] =
		useState<FeatureInterface[]>(options);
	const [announcement, setAnnouncement] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const isValidFeature = (feature: string): boolean => {
		const allLabels = Object.values(options)
			.flat()
			.map((feature) => feature.label.toLowerCase());
		return allLabels.includes(feature.toLowerCase());
	};

	const focusInput = () => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (queryId: string): FeatureInterface | undefined => {
		return options.find(({ id }) => id === queryId);
	};

	const getOptionsChangedMessage = (
		newOptions: FeatureInterface[],
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

	const filterOptions = (value: string): FeatureInterface[] => {
		return options.filter((option) =>
			option.label.toLowerCase().startsWith(value.toLowerCase()),
		);
	};

	const matchValue = () => {
		if (filteredOptions.length === 1) {
			const onlyOption = filteredOptions[0];
			if (onlyOption.label.toLowerCase() === value.toLowerCase()) {
				setValue("");
				setSelectedOptionId([...selectedOptionId, onlyOption.id]);
				setFilteredOptions(filterOptions(""));
			}
		} else if (highlightedOptionId) {
			const highlightedOption = getOptionById(highlightedOptionId);
			if (highlightedOption && value === highlightedOption.label) {
				setValue("");
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
		event.persist();
		const { id } = data;
		if (!id) return;
		const option = getOptionById(id);
		if (!option) return;
		setHighlightedOptionId(id);
		setValue(event.type === "keydown" ? option.label : value);
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
		setValue("");
		setIsShowingOptions(false);
		setAnnouncement(`${option.label} selected. List collapsed.`);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const newOptions = filterOptions(value);
		setValue(value);
		setFilteredOptions(newOptions);
		setHighlightedOptionId(newOptions.length > 0 ? newOptions[0].id : null);
		setIsShowingOptions(true);
		setAnnouncement(getOptionsChangedMessage(newOptions));
	};

	const handleKeyDown = (event: KeyboardEvent<Element>) => {
		if (
			(event.key === "Backspace" || event.key === "Delete") &&
			value === "" &&
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

	const renderTags = (): (React.JSX.Element | null)[] => {
		return selectedOptionId.map(
			(id: string, index: number): React.JSX.Element | null => {
				const option = getOptionById(id);
				if (!option) return null;
				return (
					<Tag
						dismissible
						key={id}
						margin={
							index > 0 ? "xxx-small xx-small xxx-small 0" : "0 xx-small 0 0"
						}
						onClick={(e: React.MouseEvent) => dismissTag(e, id)}
						text={
							<AccessibleContent alt={`Remove ${option.label}`}>
								{option.icon && <option.icon />} {option.label}
							</AccessibleContent>
						}
					/>
				);
			},
		);
	};

	return (
		<div>
			<Select
				assistiveText="Type or use arrow keys to navigate options. Multiple selections allowed."
				disabled={isDisabled}
				inputRef={(el: HTMLInputElement | null) => {
					inputRef.current = el;
				}}
				inputValue={value}
				isRequired={true}
				isShowingOptions={isShowingOptions}
				messages={messages}
				name="features"
				onBlur={handleBlur}
				onInputChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onRequestHideOptions={handleHideOptions}
				onRequestHighlightOption={handleHighlightOption}
				onRequestSelectOption={handleSelectOption}
				onRequestShowOptions={handleShowOptions}
				placeholder={selectedOptionId.length > 0 ? "" : "Ignite Agent"}
				renderBeforeInput={
					selectedOptionId.length > 0 ? renderTags() : IconLaunchLine
				}
				renderLabel="Features"
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
