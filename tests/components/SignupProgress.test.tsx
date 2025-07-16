import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SignupProgress from "../../src/components/SignupProgress";

describe("SignupProgress", () => {
	it("renders a progress element with aria-valuetext containing current status", () => {
		const status = 42;
		render(<SignupProgress status={status} />);
		const progress = screen.getByRole("progressbar");
		expect(progress).toHaveAttribute(
			"aria-valuetext",
			expect.stringContaining(`${status}`),
		);
	});
});
