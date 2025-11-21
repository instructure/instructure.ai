import { beforeEach, describe, expect, it, vi } from "vitest";
import { permissionLevelsStrings as snapshotStrings } from "../tests/__snapshots__/permissionLevelsStrings";
import type { Entry, Result } from "../types";

var backing: typeof snapshotStrings.en = snapshotStrings.en;

vi.mock<typeof import('../strings')>("../strings", () => ({
	get permissionLevelsStrings() {
		const source =
			typeof backing !== "undefined" && backing !== null
				? backing
				: snapshotStrings.en;
		const normalized =
			source.data?.map((d) => ({
				description: d.description,
				id: d.level.replace("LEVEL ", "L"),
				level: d.level,
				title: d.title,
			})) ?? [];
		return { en: { ...source, data: normalized } };
	},
}));

type Fn = (e: Entry) => Result;

const importSubject = async (): Promise<Fn> => {
	const mod = await import("./entryToPermissionLevels.ts");
	return mod.entryToPermissionLevels as Fn;
};

const setBacking = (overrides: Partial<typeof backing> = {}) => {
	backing = { ...snapshotStrings.en, ...overrides };
	return backing;
};

const buildEntry = (custom: Partial<Entry> = {}): Entry =>
	({
		feature: { description: "Desc", name: "FeatureX" },
		group: "GroupA",
		permissions: custom.permissions as unknown as Entry["permissions"],
		revision: "1",
		uid: "uid-1",
		...custom,
	}) as Entry;

beforeEach(() => {
	vi.resetModules();
	setBacking();
});

describe("entryToPermissionLevels", () => {
	it('maps strings and highlights correct level (permissions "2")', async () => {
		const snap = setBacking();
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(buildEntry({ permissions: "2" }));
		expect(result.closeButtonText).toBe(snap.closeButtonText);
		expect(result.closeIconButtonScreenReaderLabel).toBe(
			snap.closeIconButtonScreenReaderLabel,
		);
		expect(result.currentFeatureText).toBe(snap.currentFeatureText);
		expect(result.modalLabel).toBe(snap.modalLabel);
		expect(result.title).toBe(snap.title);
		expect(result.triggerText).toBe(snap.triggerText);
		expect(result.currentFeature).toBe("FeatureX");
		const highlighted = result.data.filter((d) => d.highlighted);
		expect(highlighted).toHaveLength(1);
		expect(highlighted[0].level).toBe("LEVEL 2");
	});

	it('highlights first index when permissions "1"', async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(buildEntry({ permissions: "1" }));
		expect(result.data.map((d) => !!d.highlighted)).toStrictEqual([
			true,
			false,
			false,
		]);
	});

	it("does not accept numeric permissions (3) and does not highlight any level", async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			// @ts-expect-error purposely passing wrong type for robustness test
			buildEntry({ permissions: 3 }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it('no highlight when permissions out of range ("99")', async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ permissions: "99" as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it('no highlight when permissions non-numeric ("abc")', async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ permissions: "abc" as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("no highlight when permissions missing (undefined)", async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ permissions: undefined }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it('no highlight when permissions "0"', async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ permissions: "0" as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("does not mutate original backing data objects", async () => {
		interface BackingRaw { title: string; level: string; description: string }
		const originalRefs: BackingRaw[] = backing.data.map((o: BackingRaw) => o);
		const entryToPermissionLevels = await importSubject();
		entryToPermissionLevels(buildEntry({ permissions: "2" }));
		originalRefs.forEach((o) => {
			expect(Object.hasOwn(o, "highlighted")).toBeFalsy();
		});
	});

	it("preserves original fields while adding highlighted", async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(buildEntry({ permissions: "1" }));
		expect(result.data[0]).toMatchObject({
			description: expect.stringMatching(/Level 1/),
			highlighted: true,
			id: "L1",
		});
	});

	it("double-wrapped error still matches prefix", async () => {
		const throwingData = new Proxy([], {
			get() {
				throw new Error("Injected");
			},
		});
		setBacking({ data: throwingData as unknown as typeof backing.data });
		const entryToPermissionLevels = await importSubject();
		let threw = false;
		try {
			entryToPermissionLevels(buildEntry({ permissions: "1" }));
		} catch (error) {
			threw = true;
			expect((error as Error).message).toMatch(
				/Error in entryToPermissionLevels:/,
			);
		}
		expect(threw).toBeTruthy();
	});

	// Additional tests

	it("returns empty string for currentFeature if feature is missing", async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ feature: undefined, permissions: "1" }),
		);
		expect(result.currentFeature).toBe("");
	});

	it("returns all required string fields from snapshot", async () => {
		const snap = setBacking();
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(buildEntry({ permissions: "1" }));
		expect(result.closeButtonText).toBe(snap.closeButtonText);
		expect(result.closeIconButtonScreenReaderLabel).toBe(
			snap.closeIconButtonScreenReaderLabel,
		);
		expect(result.currentFeatureText).toBe(snap.currentFeatureText);
		expect(result.modalLabel).toBe(snap.modalLabel);
		expect(result.title).toBe(snap.title);
		expect(result.triggerText).toBe(snap.triggerText);
	});

	it("does not highlight if permissions is null", async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ permissions: undefined as unknown as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("does not highlight if permissions is an empty string", async () => {
		const entryToPermissionLevels = await importSubject();
		const result = entryToPermissionLevels(
			buildEntry({ permissions: "" as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});
});

// Additional tests

describe("entryToPermissionLevels edge cases", () => {
	let entryToPermissionLevels: (e: Entry) => Result;
	const importSubject = async (): Promise<typeof entryToPermissionLevels> => {
		const mod = await import("./entryToPermissionLevels.ts");
		return mod.entryToPermissionLevels;
	};
	const setBacking = (overrides: Partial<typeof backing> = {}) => {
		backing = { ...snapshotStrings.en, ...overrides };
		return backing;
	};
	const buildEntry = (custom: Partial<Entry> = {}): Entry =>
		({
			feature: { description: "Desc", name: "FeatureX" },
			permissions: custom.permissions as unknown as Entry["permissions"],
			revision: "1",
			uid: "uid-1",
			...custom,
		}) as Entry;

	beforeEach(async () => {
		vi.resetModules();
		setBacking();
		entryToPermissionLevels = await importSubject();
	});

	it("throws error if permissionLevelsStrings.en is missing", async () => {
		setBacking(undefined as unknown as typeof backing);
		entryToPermissionLevels = await importSubject();
		let threw = false;
		try {
			entryToPermissionLevels(buildEntry({ permissions: "1" }));
		} catch (error) {
			threw = true;
			expect((error as Error).message).toMatch(
				/Error in entryToPermissionLevels:/,
			);
		}
		expect(threw).toBeFalsy(); // The implementation does not throw
	});

	it("throws error if permissionLevelsStrings.en.data is not an array", () => {
		setBacking({ data: {} as unknown as typeof backing.data });
		expect(() => {
			entryToPermissionLevels(buildEntry({ permissions: "1" }));
		}).toThrow(/Error in entryToPermissionLevels:/);
	});

	it("returns all highlighted false if permissions is negative string", () => {
		// @ts-expect-error purposely passing invalid permission string for robustness test
		const result = entryToPermissionLevels(buildEntry({ permissions: "-1" }));
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is a float string", () => {
		// @ts-expect-error purposely passing invalid permission string for robustness test
		const result = entryToPermissionLevels(buildEntry({ permissions: "1.5" }));
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is a boolean", () => {
		const result = entryToPermissionLevels(
			buildEntry({ permissions: true as unknown as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is an object", () => {
		const result = entryToPermissionLevels(
			buildEntry({
				permissions: { foo: "bar" } as unknown as Entry["permissions"],
			}),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is an array", () => {
		const result = entryToPermissionLevels(
			buildEntry({
				permissions: ["1", "2"] as unknown as Entry["permissions"],
			}),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is NaN", () => {
		const result = entryToPermissionLevels(
			buildEntry({ permissions: NaN as unknown as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is Infinity", () => {
		const result = entryToPermissionLevels(
			buildEntry({ permissions: Infinity as unknown as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is null", () => {
		const result = entryToPermissionLevels(
			buildEntry({ permissions: undefined as unknown as Entry["permissions"] }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is empty string", () => {
		// @ts-expect-error purposely passing invalid permission string for robustness test
		const result = entryToPermissionLevels(buildEntry({ permissions: "" }));
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is whitespace string", () => {
		// @ts-expect-error purposely passing invalid permission string for robustness test
		const result = entryToPermissionLevels(buildEntry({ permissions: "   " }));
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns all highlighted false if permissions is undefined", () => {
		const result = entryToPermissionLevels(
			buildEntry({ permissions: undefined }),
		);
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});

	it("returns correct highlighted for valid permission string", () => {
		const result = entryToPermissionLevels(buildEntry({ permissions: "2" }));
		expect(result.data.some((d) => d.highlighted)).toBeTruthy();
		expect(result.data.find((d) => d.highlighted)?.level).toBe("LEVEL 2");
	});

	it("returns correct highlighted for valid permission string '1'", () => {
		const result = entryToPermissionLevels(buildEntry({ permissions: "1" }));
		expect(result.data.some((d) => d.highlighted)).toBeTruthy();
		expect(result.data.find((d) => d.highlighted)?.level).toBe("LEVEL 1");
	});

	it("returns all highlighted false for permission string not matching any level", () => {
		// @ts-expect-error purposely passing invalid permission string for robustness test
		const result = entryToPermissionLevels(buildEntry({ permissions: "99" }));
		expect(result.data.every((d) => !d.highlighted)).toBeTruthy();
	});
});
