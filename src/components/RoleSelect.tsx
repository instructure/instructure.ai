import { Alert, IconEducatorsLine, Select, View } from "@instructure/ui";
import {
	type FocusEvent,
	type SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import Roles, { type Role, type RolesType } from "../assets/Roles";
import type { SignupFormSelectProps } from "./SignupForm";

const RoleSelect: React.FC<SignupFormSelectProps> = ({
	isDisabled,
	value,
	setValue,
	messages,
	setMessages,
	selectedOptionId,
	setSelectedOptionId,
}) => {
	const sortRoles = (roles: RolesType) =>
		Object.fromEntries(
			Object.entries(roles)
				.filter(([_, arr]) => Array.isArray(arr) && arr.length > 0)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, arr]) => [
					key,
					arr.slice().sort((a, b) => a.label.localeCompare(b.label)),
				]),
		);

	const options = sortRoles(Roles);

	useEffect(() => {
		if (selectedOptionId === "") {
			setMessages([
				{
					text: "Role is required.",
					type: "error",
				},
			]);
		} else {
			setMessages([]);
		}
	}, [selectedOptionId, setMessages]);

	const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);
	const [highlightedOptionId, setHighlightedOptionId] = useState<string | null>(
		null,
	);
	const [announcement, setAnnouncement] = useState<string | null>(null);
	const [filteredOptions, setFilteredOptions] = useState<RolesType>(options);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const isValidRole = (role: string): boolean => {
		const allLabels = Object.values(options)
			.flat()
			.map((role) => role.label.toLowerCase());
		return allLabels.includes(role.toLowerCase());
	};

	const focusInput = (): void => {
		if (inputRef.current) {
			inputRef.current.blur();
			inputRef.current.focus();
		}
	};

	const getOptionById = (id: string): Role | undefined => {
		return Object.values(options)
			.flat()
			.find((o) => o?.id === id);
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = event.target.value;
		const newOptions = filterOptions(value, Roles as RolesType);
		setValue(value);
		setFilteredOptions(newOptions);
		const firstKey = Object.keys(newOptions)[0];
		const firstOption = firstKey ? newOptions[firstKey][0] : null;
		setHighlightedOptionId(firstOption ? firstOption.id : null);
		setIsShowingOptions(true);
		setSelectedOptionId(value === "" ? null : selectedOptionId);
		setMessages([]);
	};

	const filterOptions = (value: string, options: RolesType): RolesType => {
		const filteredOptions: RolesType = {};
		Object.keys(options).forEach((key) => {
			filteredOptions[key] = options[key]?.filter((option) =>
				option.label.toLowerCase().includes(value.toLowerCase()),
			);
		});
		const optionsWithoutEmptyKeys = Object.keys(filteredOptions)
			.filter((k) => filteredOptions[k].length > 0)
			.reduce<RolesType>((acc, k) => {
				acc[k] = filteredOptions[k];
				return acc;
			}, {});
		return optionsWithoutEmptyKeys;
	};

	const handleShowOptions = (_e: SyntheticEvent): void => {
		setIsShowingOptions(true);
		setMessages([]);
	};

	const handleHideOptions = (_e: SyntheticEvent): void => {
		setIsShowingOptions(false);
		setHighlightedOptionId(null);
		setSelectedOptionId(selectedOptionId ? selectedOptionId : "");
		setAnnouncement("List collapsed.");
	};

	const handleBlur = (_e: FocusEvent): void => {
		setHighlightedOptionId(null);
		!isValidRole(value) &&
			setMessages([
				{
					text: "Select a valid role.",
					type: "error",
				},
			]);
	};

	const handleHighlightOption = (
		event: SyntheticEvent & { type: string; persist: () => void },
		data: { id?: string; direction?: 1 | -1 },
	): void => {
		event.persist();
		const { id } = data;
		const optionsAvailable = `${Object.values(options).flat().length} options available.`;
		const nowOpen = !isShowingOptions
			? `List expanded. ${optionsAvailable}`
			: "";
		const option = id ? (getOptionById(id)?.label ?? "") : "";
		setHighlightedOptionId(id ?? null);
		setValue(event.type === "keydown" && option ? option : value);
		setAnnouncement(`${option} ${nowOpen}`);
	};

	const handleSelectOption = (
		_e: SyntheticEvent,
		data: { id?: string },
	): void => {
		const { id } = data;
		const option = id ? (getOptionById(id)?.label ?? "") : "";
		focusInput();
		setSelectedOptionId(id ?? null);
		setValue(option);
		setIsShowingOptions(false);
		setAnnouncement(`"${option}" selected. List collapsed.`);
	};

	const renderGroup = (): React.ReactNode => {
		return Object.keys(filteredOptions).map((key) => {
			return (
				<Select.Group key={key} renderLabel={key}>
					{filteredOptions[key].map((option) => (
						<Select.Option
							id={option.id}
							isHighlighted={option.id === highlightedOptionId}
							isSelected={option.id === selectedOptionId}
							key={option.id}
							value={option.label}
						>
							<View margin="0 0 0 medium">{option.label}</View>
						</Select.Option>
					))}
				</Select.Group>
			);
		});
	};

	return (
		<>
			<Select
				assistiveText="Use arrow keys to navigate options."
				disabled={isDisabled}
				inputRef={(el: HTMLInputElement | null) => {
					inputRef.current = el;
				}}
				inputValue={value}
				isRequired={true}
				isShowingOptions={isShowingOptions}
				messages={messages}
				name="role"
				onBlur={handleBlur}
				onInputChange={handleInputChange}
				onRequestHideOptions={handleHideOptions}
				onRequestHighlightOption={handleHighlightOption}
				onRequestSelectOption={handleSelectOption}
				onRequestShowOptions={handleShowOptions}
				placeholder="Student"
				renderBeforeInput={IconEducatorsLine}
				renderLabel="Role"
				shouldNotWrap
			>
				{renderGroup()}
			</Select>
			<Alert
				liveRegion={() => {
					const el = document.getElementById("flash-messages");
					if (!el)
						throw new Error('Element with id "flash-messages" not found');
					return el;
				}}
				liveRegionPoliteness="assertive"
				screenReaderOnly
			>
				{announcement}
			</Alert>
		</>
	);
};
export default RoleSelect;
