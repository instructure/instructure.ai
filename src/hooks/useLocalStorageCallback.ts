import { useCallback } from "react";
import { writeLocalStorage } from "../utils/FormData";

type LocalStorageCallback = (formData: FormData) => void;

const useLocalStorageCallback = (): LocalStorageCallback => {
	return useCallback((formData: FormData) => {
		writeLocalStorage(formData);
	}, []);
};

export default useLocalStorageCallback;
