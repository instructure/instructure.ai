import { beforeEach, describe, expect, it, vi } from "vitest";

// Set up the mock before importing Divider
vi.mock<typeof import('@instructure/ui')>("@instructure/ui", () => {
	const ViewMock = vi.fn(({ children, ...props }) => {
		const { borderColor, borderWidth, ...rest } = props;
		return (
			<div
				data-testid="view-mock"
				style={{ borderColor, borderWidth }}
				{...rest} // rest should not include borderColor or borderWidth
			>
				{children}
			</div>
		);
	});
	return { View: ViewMock };
});

import { Divider } from "./Divider";

describe("divider", () => {
	let ViewMock: ReturnType<typeof vi.fn>;

	beforeEach(async () => {
		// Dynamically import the mock after vi.mock is set up
		const mocked =
			await vi.importMock<typeof import("@instructure/ui")>("@instructure/ui");
		ViewMock = mocked.View as unknown as ReturnType<typeof vi.fn>;
		ViewMock.mockClear();
	});

	it("renders a View with correct props", async () => {
		const { container, getByTestId } = require("@testing-library/react").render(
			<Divider />,
		);
		expect(ViewMock).toHaveBeenCalledTimes(1);
		const call = ViewMock.mock.calls[0][0];
		expect(call.as).toBe("div");
		expect(call.borderColor).toBe("primary");
		expect(call.borderWidth).toBe("medium 0 0");
		expect(call.margin).toBe("0 0 medium");
		expect(getByTestId("view-mock")).toBeTruthy();
		expect(
			container.querySelector("div[data-testid='view-mock']"),
		).not.toBeNull();
	});

	it("does not render children", async () => {
		require("@testing-library/react").render(<Divider />);
		const call = ViewMock.mock.calls[0][0];
		expect(call.children).toBeUndefined();
	});
});
