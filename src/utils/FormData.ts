const LOCAL_STORAGE_KEY = "formData";

const serializeFormData = (formData: FormData): string => {
	const obj: Record<string, string> = {};
	formData.forEach((value, key) => {
		obj[key] = value.toString();
	});
	return JSON.stringify(obj, null, 2);
};

const deserializeFormData = (data: string): FormData => {
	const obj = JSON.parse(data);
	const formData = new FormData();
	Object.entries(obj).forEach(([key, value]) => {
		formData.append(key, value as string);
	});
	return formData;
};

const readLocalStorage = (
	storageKey: string = LOCAL_STORAGE_KEY,
	fieldKey?: string,
): FormData | string | null => {
	const data = localStorage.getItem(storageKey);
	if (data) {
		if (fieldKey) {
			const obj = JSON.parse(data);
			return obj[fieldKey] ?? null;
		}
		return deserializeFormData(data);
	}
	return null;
};

const readLocalStorageField = (fieldKey: string) => {
	return readLocalStorage(LOCAL_STORAGE_KEY, fieldKey)?.toString() ?? "";
};

const writeLocalStorage = (
	formData: FormData,
	key: string = LOCAL_STORAGE_KEY,
): void => {
	const serializedData = serializeFormData(formData);
	localStorage.setItem(key, serializedData);
};

export {
	readLocalStorage,
	writeLocalStorage,
	readLocalStorageField,
	serializeFormData,
};
