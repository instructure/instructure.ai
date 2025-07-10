import { useCallback } from "react";

type SubmitCallback = (
	formData: FormData,
	handlers: {
		setSuccess: (hasSuccess: boolean) => void;
		setError: (hasError: string | null) => void;
	},
) => Promise<void>;

const useSubmitCallback = (): SubmitCallback => {
	return useCallback(
		async (formData: FormData, { setSuccess, setError }): Promise<void> => {
			try {
				const params = new URLSearchParams({
					"entry.291273221": formData.get("role") as string,
					"entry.458799281": formData.get("name") as string,
					"entry.825096550": formData.get("features") as string,
					"entry.1188554997": formData.get("consent") as string,
					"entry.1289925100": formData.get("email") as string,
					"entry.1874730912": formData.get("institution") as string,
				});
				const formURL =
					"https://docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/formResponse?";
				const url = `${formURL}${params}`;
				await fetch(url);
				setSuccess(true);
				console.log("success!");
			} catch (e: unknown) {
				const msg =
					e instanceof Error ? e.message : "An unknown error occurred";
				const hit = "NetworkError when attempting to fetch resource.";
				msg === hit ? setSuccess(true) : setError(msg);
			}
		},
		[],
	);
};

export default useSubmitCallback;
