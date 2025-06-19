import { useCallback } from "react";

type SubmitCallback = (formData: FormData) => Promise<void>;

const useSubmitCallback = (): SubmitCallback => {
	return useCallback(async (formData: FormData): Promise<void> => {
		try {
			const params = new URLSearchParams({
				"entry.291273221": formData.get("role") as string,
				"entry.458799281": formData.get("name") as string,
				"entry.825096550": formData.get("features") as string,
				"entry.1289925100": formData.get("email") as string,
				"entry.1874730912": formData.get("institution") as string,
			});

			const formURL =
				"https://docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/formResponse?";

			const url = `${formURL}${params}`;

			await fetch(url, {
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				method: "POST",
				mode: "no-cors",
			});
			console.log("Form submitted successfully:", url);
			console.log("Form data:", Object.fromEntries(formData.entries()));
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.error(e.message);
			} else {
				console.error("Unknown error", e);
			}
		}
	}, []);
};

export default useSubmitCallback;
