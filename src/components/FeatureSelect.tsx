import { AccessibleContent } from "@instructure/ui-a11y-content";
import { Alert } from "@instructure/ui-alerts";
import { IconLaunchLine } from "@instructure/ui-icons";
import { Select } from "@instructure/ui-select";
import { Tag } from "@instructure/ui-tag";
import { useRef, useState } from "react";
import Features from "../assets/features";

const FeatureSelect = () => {
	const sortFeatures = (features) =>
		features.slice().sort((a, b) => a.label.localeCompare(b.label));
	const options = sortFeatures(Features);

	const [inputValue, setInputValue] = useState("");
	const [isShowingOptions, setIsShowingOptions] = useState(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState(null);
	const [selectedOptionId, setSelectedOptionId] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [announcement, setAnnouncement] = useState(null);
	const inputRef = useRef();

	const focusInput = () => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (queryId) => {
		return options.find(({ id }) => id === queryId);
	};

	const getOptionsChangedMessage = (newOptions) => {
		let message =
			newOptions.length !== filteredOptions.length
				? `${newOptions.length} options available.`
				: null;
		if (message && newOptions.length > 0) {
			if (highlightedOptionId !== newOptions[0].id) {
				const option = getOptionById(newOptions[0].id).label;
				message = `${option}. ${message}`;
			}
		}
		return message;
	};

	const filterOptions = (value) => {
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
			if (inputValue === getOptionById(highlightedOptionId).label) {
				setInputValue("");
				setFilteredOptions(filterOptions(""));
			}
		}
	};

	const handleShowOptions = (_e) => {
		setIsShowingOptions(true);
	};

	const handleHideOptions = (_e) => {
		setIsShowingOptions(false);
		matchValue();
	};

	const handleBlur = (_e) => {
		setHighlightedOptionId(null);
	};

	const handleHighlightOption = (event, { id }) => {
		event.persist();
		const option = getOptionById(id);
		if (!option) return;
		setHighlightedOptionId(id);
		setInputValue(event.type === "keydown" ? option.label : inputValue);
		setAnnouncement(option.label);
	};

	const handleSelectOption = (_e, { id }) => {
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

	const handleInputChange = (event) => {
		const value = event.target.value;
		const newOptions = filterOptions(value);
		setInputValue(value);
		setFilteredOptions(newOptions);
		sethHighlightedOptionId(newOptions.length > 0 ? newOptions[0].id : null);
		setIsShowingOptions(true);
		setAnnouncement(getOptionsChangedMessage(newOptions));
	};

	const handleKeyDown = (event) => {
		if (event.keyCode === 8) {
			if (inputValue === "" && selectedOptionId.length > 0) {
				setHighlightedOptionId(null);
				setSelectedOptionId(selectedOptionId.slice(0, -1));
			}
		}
	};

	const dismissTag = (e, tag) => {
		e.stopPropagation();
		e.preventDefault();

		const newSelection = selectedOptionId.filter((id) => id !== tag);

		setSelectedOptionId(newSelection);
		setHighlightedOptionId(null);
		setAnnouncement(`${getOptionById(tag).label} removed`);

		inputRef.current.focus();
	};

	const renderTags = () => {
		return selectedOptionId.map((id, index) => {
			const option = getOptionById(id);
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
				inputRef={(el) => {
					inputRef.current = el;
				}}
				inputValue={inputValue}
				isRequired={false}
				isShowingOptions={isShowingOptions}
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
									renderBeforeLabel={option.icon ? option.icon : null}
								>
									{option.label}
								</Select.Option>
							);
						}
					})
				) : (
					<Select.Option id="empty-option" key="empty-option">
						---
					</Select.Option>
				)}
			</Select>
			<Alert
				liveRegion={() => document.getElementById("flash-messages")}
				liveRegionPoliteness="assertive"
				screenReaderOnly
			>
				{announcement}
			</Alert>
		</div>
	);
};
export default FeatureSelect;
