import { useCallback } from "react";

type SubmitCallback = (
	formData: FormData,
	handlers: {
		setSuccess: (hasSuccess: boolean) => void;
		setError: (hasError: string | null) => void;
	},
) => Promise<void>;

const useSubmitCallback = (): SubmitCallback => {
	const SAFARI = "Load failed";
	const CHROME = "Failed to fetch";
	const FIREFOX = "NetworkError when attempting to fetch resource.";

	return useCallback(
		async (formData: FormData, { setSuccess, setError }): Promise<void> => {
			try {
				const params = new URLSearchParams({
					"entry.291273221": formData.get("role") as string,
					"entry.458799281": formData.get("name") as string,
					"entry.825096550": formData.get("features") as string,
					"entry.1188554997": formData.get("consent") as string,
					"entry.1209006275": (formData.get("other") as string) ?? "",
					"entry.1289925100": formData.get("email") as string,
					"entry.1874730912": formData.get("institution") as string,
				});
				const formURL =
					"https://docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/formResponse?";
				const url = `${formURL}${params}`;
				await fetch(url);
			} catch (e: unknown) {
				setSuccess(false);
				const msg =
					e instanceof Error ? e.message : "An unknown error occurred";
				const hits = [SAFARI, CHROME, FIREFOX];
				hits.includes(msg) ? setSuccess(true) : setError(msg);
			}
		},
		[],
	);
};

export default useSubmitCallback;
