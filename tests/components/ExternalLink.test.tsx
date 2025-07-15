import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExternalLink from "../../src/components/ExternalLink";

vi.mock("@instructure/ui", () => ({
	IconExternalLinkLine: () => (
		<svg
			aria-hidden="true"
			data-testid="external-icon"
			focusable="false"
			viewBox="0 0 16 16"
		/>
	),
	Link: ({ children, ...props }: React.ComponentProps<"a">) => (
		<a {...props}>{children}</a>
	),
}));

describe("ExternalLink", () => {
	it("is not hidden", () => {
		render(
			<ExternalLink href="https://example.com">Visible Link</ExternalLink>,
		);
		const link = screen.getByRole("link");
		expect(link).not.toHaveAttribute("aria-hidden");
	});

	it("renders the icon as hidden", () => {
		render(
			<ExternalLink href="https://example.com">Visible Link</ExternalLink>,
		);
		const icon = screen.getByTestId("external-icon");
		expect(icon).toHaveAttribute("aria-hidden", "true");
	});
});
