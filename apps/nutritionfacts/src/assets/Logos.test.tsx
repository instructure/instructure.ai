import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    CanvasBug,
    IgniteBug,
    InstructureBug,
    MasteryBug,
    StudioBug,
    ParchmentBug,
} from "./Logos";
import { render } from "@testing-library/react";
import { InlineSVG } from "@instructure/ui";

// Mock InlineSVG to inspect props and children
vi.mock("@instructure/ui", async (orig) => {
    const mod = await orig();
    // Define InlineSVGMock inside the factory to avoid hoisting issues
    const InlineSVGMock = vi.fn(({ children, ...props }) => (
        <svg data-testid="inline-svg" {...props}>
            {children}
        </svg>
    ));
    return {
        ...(typeof mod === "object" && mod !== null ? mod : {}),
        InlineSVG: InlineSVGMock,
    };
});

// Mock useId to return a stable value for IgniteBug
vi.mock("react", async (orig) => {
    const mod = await orig();
    return {
        ...(typeof mod === "object" && mod !== null ? mod : {}),
        useId: () => "testid",
    };
});

const InlineSVGMock = InlineSVG as unknown as ReturnType<typeof vi.fn>;

describe("Logo Bug Components", () => {
    beforeEach(() => {
        InlineSVGMock.mockClear();
    });

    const logoCases = [
        {
            name: "CanvasBug",
            Component: CanvasBug,
            expected: {
                title: "Canvas",
                viewBox: "0 0 59.68 59.68",
            },
        },
        {
            name: "MasteryBug",
            Component: MasteryBug,
            expected: {
                title: "Mastery",
                viewBox: "0 0 70.82 53.92",
            },
        },
        {
            name: "StudioBug",
            Component: StudioBug,
            expected: {
                title: "Studio",
                viewBox: "0 0 135.85 118.73",
            },
        },
        {
            name: "ParchmentBug",
            Component: ParchmentBug,
            expected: {
                title: "Parchment",
                viewBox: "0 0 70.82 53.92",
            },
        },
    ];

    logoCases.forEach(({ name, Component, expected }) => {
        it(`${name} renders with default props`, () => {
            render(<Component />);
            expect(InlineSVGMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: expected.title,
                    viewBox: expected.viewBox,
                }),
                undefined,
            );
        });

        it(`${name} passes color prop and wraps children in <g fill>`, () => {
            const { getAllByTestId } = render(<Component color="#123456" />);
            const svg = getAllByTestId("inline-svg").pop();
            if (!svg) throw new Error("SVG not found");
            const g = svg.querySelector("g[fill='#123456']");
            expect(g).not.toBeNull();
        });
    });

    it("InstructureBug renders with default props", () => {
        render(<InstructureBug />);
        expect(InlineSVGMock).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Instructure",
                viewBox: "0 0 53.42 53.42",
            }),
            undefined,
        );
    });

    it("InstructureBug renders with color and custom fills", () => {
        const { getAllByTestId } = render(<InstructureBug color="#abc" />);
        const svg = getAllByTestId("inline-svg").pop();
        expect(svg).toBeTruthy();
        if (!svg) throw new Error("SVG not found");
        const rects = svg.querySelectorAll("rect");
        expect(rects.length).toBeGreaterThan(0);
        expect(rects[0].getAttribute("stroke")).toBe("#0E1721");
        expect(rects[1].getAttribute("fill")).toBe("#0E1721");
        const path = svg.querySelector("path");
        expect(path).not.toBeNull();
        if (!path) throw new Error("path not found");
        expect(path.getAttribute("fill")).toBe("#D42E21");
    });

    it("IgniteBug renders with default props (no color)", () => {
        render(<IgniteBug />);
        const call = InlineSVGMock.mock.calls[0][0];
        expect(call.title).toBe("IgniteAI");
        expect(call.viewBox).toBe("0 0 1920 1920");
    });

    it("IgniteBug renders with color and gradients/defs", () => {
        const { getAllByTestId } = render(<IgniteBug color="#f00" />);
        const svg = getAllByTestId("inline-svg").pop();
        expect(svg).toBeTruthy();
        if (!svg) throw new Error("SVG not found");
        const defs = svg.querySelector("defs");
        expect(defs).not.toBeNull();
        if (!defs) throw new Error("defs not found");
        const grad = defs.querySelector("linearGradient#paint0_linear_testid");
        expect(grad).not.toBeNull();
        const clip = defs.querySelector("clipPath#clip0_testid");
        expect(clip).not.toBeNull();
        const g = svg.querySelector("g[clip-path='url(#clip0_testid)']");
        expect(g).not.toBeNull();
    });

    it("All logo bug components render without crashing", () => {
        expect(() => {
            render(<CanvasBug />);
            render(<MasteryBug />);
            render(<StudioBug />);
            render(<ParchmentBug />);
            render(<IgniteBug />);
            render(<InstructureBug />);
        }).not.toThrow();
    });
});