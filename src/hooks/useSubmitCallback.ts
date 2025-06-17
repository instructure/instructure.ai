import { useCallback } from "react";

type SubmitCallback = (formData: FormData) => Promise<void>;

/**
 * Custom hook to handle form submission for the signup modal.
 * It constructs a URL with form data and logs the submission.
 * https://docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/viewform?usp=pp_url&
 * entry.458799281=Bart+Simpson&
 * entry.1289925100=bsimpson@springfield-elementary.edu&
 * entry.291273221=Student&
 * entry.1874730912=Springfield+Elementary&
 * entry.825096550=canvas_career&
 * entry.825096550=rubric_generator&
 * entry.825096550=quiz_generator&
 * entry.825096550=grading_assistance&
 * entry.825096550=studio_captioning&
 * entry.825096550=canvas_translations&
 * entry.825096550=accessibility_remediation
 **/

//docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/formResponse?entry.291273221=Student&entry.458799281=Bart+Simpson&entry.825096550=Canvas+Career%2C+Rubric+Generator&entry.1289925100=bsimpson%40springfield.edu&entry.1874730912=Springfield+AM useSubmitCallback.ts:39:3

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
				"https: * docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/formResponse?";

			const url = `${formURL}${params}`;

			// await fetch(url, { mode: "no-cors" });
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
