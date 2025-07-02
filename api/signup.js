// AWS Lambda handler (Node.js 18+)
export const handler = async (event) => {
	if (event.httpMethod !== "POST") {
		return { body: "Method Not Allowed", statusCode: 405 };
	}

	const params = event.body; // body is a URL-encoded string

	try {
		await fetch(
			"https://docs.google.com/forms/d/e/1FAIpQLSfnORpEEhEYb6if1mPKU_OEQvznxy8-nq8SG9r9XZvYEssvEQ/formResponse?",
			{
				body: params,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				method: "POST",
			},
		);
		return { body: "OK", statusCode: 200 };
	} catch (err) {
		return { body: "Error", statusCode: 500 };
	}
};
