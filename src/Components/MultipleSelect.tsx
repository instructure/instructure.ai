import { AccessibleContent, Select, Tag } from "@instructure/ui";
import { useRef, useState } from "react";

const MultipleSelect = ({
	options,
	selectedOptionIds,
	setSelectedOptionIds,
	value,
	setValue,
	onChange,
	placeholder,
}) => {
	const [isShowingOptions, setIsShowingOptions] = useState(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState(null);
	const [announcement, setAnnouncement] = useState(null);
	const inputRef = useRef();

	const filterOptions = (val) =>
		options.filter(
			(option) =>
				option.label.toLowerCase().startsWith(val.toLowerCase()) &&
				!selectedOptionIds.includes(option.id),
		);

	const filteredOptions = filterOptions(value);

	const focusInput = () => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (queryId) => options.find(({ id }) => id === queryId);

	const handleShowOptions = () => {
		setIsShowingOptions(true);
	};

	const handleHideOptions = () => {
		setIsShowingOptions(false);
	};

	const handleBlur = () => {
		setHighlightedOptionId(null);
	};

	const handleHighlightOption = (_event, { id }) => {
		setHighlightedOptionId(id);
	};

	const handleSelectOption = (_event, { id }) => {
		if (!id || selectedOptionIds.includes(id)) return;
		const newSelected = [...selectedOptionIds, id];
		setSelectedOptionIds(newSelected);
		setValue("");
		setIsShowingOptions(false);
		if (onChange) {
			const selectedLabels = newSelected
				.map((selectedId) => {
					const opt = getOptionById(selectedId);
					return opt ? opt.label : "";
				})
				.filter(Boolean)
				.join(", ");
			onChange(selectedLabels);
		}
	};

	const handleInputChange = (event) => {
		setValue(event.target.value);
		setIsShowingOptions(true);
	};

	const handleKeyDown = (event) => {
		if (
			(event.key === "Backspace" || event.key === "Delete") &&
			value === "" &&
			selectedOptionIds.length > 0
		) {
			const newSelection = selectedOptionIds.slice(0, -1);
			setSelectedOptionIds(newSelection);
			if (onChange) {
				const selectedLabels = newSelection
					.map((selectedId) => {
						const opt = getOptionById(selectedId);
						return opt ? opt.label : "";
					})
					.filter(Boolean)
					.join(", ");
				onChange(selectedLabels);
			}
		}
	};

	const dismissTag = (e, tag) => {
		e.stopPropagation();
		e.preventDefault();
		const newSelection = selectedOptionIds.filter((id) => id !== tag);
		setSelectedOptionIds(newSelection);
		setHighlightedOptionId(null);
		if (onChange) {
			const selectedLabels = newSelection
				.map((selectedId) => {
					const opt = getOptionById(selectedId);
					return opt ? opt.label : "";
				})
				.filter(Boolean)
				.join(", ");
			onChange(selectedLabels);
		}
		inputRef.current?.focus();
	};

	const renderTags = () =>
		selectedOptionIds.map((id, index) => (
			<Tag
				dismissible
				key={id}
				margin={index > 0 ? "xxx-small xx-small xxx-small 0" : "0 xx-small 0 0"}
				onClick={(e) => dismissTag(e, id)}
				text={
					<AccessibleContent alt={`Remove ${getOptionById(id)?.label}`}>
						{getOptionById(id)?.label}
					</AccessibleContent>
				}
			/>
		));

	return (
		<Select
			assistiveText="Type or use arrow keys to navigate options. Multiple selections allowed."
			inputRef={(el) => {
				inputRef.current = el;
			}}
			inputValue={value}
			isShowingOptions={isShowingOptions}
			onBlur={handleBlur}
			onInputChange={handleInputChange}
			onKeyDown={handleKeyDown}
			onRequestHideOptions={handleHideOptions}
			onRequestHighlightOption={handleHighlightOption}
			onRequestSelectOption={handleSelectOption}
			onRequestShowOptions={handleShowOptions}
			placeholder={selectedOptionIds.length > 0 ? "" : placeholder}
			renderBeforeInput={selectedOptionIds.length > 0 ? renderTags() : null}
			renderLabel={placeholder}
		>
			{filteredOptions.length > 0 ? (
				filteredOptions.map((option) => (
					<Select.Option
						id={option.id}
						isHighlighted={option.id === highlightedOptionId}
						key={option.id}
					>
						{option.label}
					</Select.Option>
				))
			) : (
				<Select.Option id="empty-option" key="empty-option">
					---
				</Select.Option>
			)}
		</Select>
	);
};

export default MultipleSelect;
