import { describe, it, expect } from "vitest";
import type { PageLayout } from "../types";
import { DefaultLayout } from "./Layout";

import { Layout } from "./Layout";

describe("Layout", () => {
    it("should correctly assign all true properties", () => {
        const input: PageLayout = {
            copyright: true,
            disclaimer: true,
            revision: true,
        };
        const layout = new Layout(input);
        expect(layout.copyright).toBe(true);
        expect(layout.disclaimer).toBe(true);
        expect(layout.revision).toBe(true);
    });

    it("should correctly assign all false properties", () => {
        const input: PageLayout = {
            copyright: false,
            disclaimer: false,
            revision: false,
        };
        const layout = new Layout(input);
        expect(layout.copyright).toBe(false);
        expect(layout.disclaimer).toBe(false);
        expect(layout.revision).toBe(false);
    });

    it("should correctly assign mixed property values", () => {
        const input: PageLayout = {
            copyright: true,
            disclaimer: false,
            revision: true,
        };
        const layout = new Layout(input);
        expect(layout.copyright).toBe(true);
        expect(layout.disclaimer).toBe(false);
        expect(layout.revision).toBe(true);
    });

    it("DefaultLayout should have all properties true", () => {
        expect(DefaultLayout.copyright).toBe(true);
        expect(DefaultLayout.disclaimer).toBe(true);
        expect(DefaultLayout.revision).toBe(true);
    });
});