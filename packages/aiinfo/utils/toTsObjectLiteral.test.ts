import { describe, expect, it } from "vitest";
import { raw, toTsObjectLiteral } from "./toTsObjectLiteral";

describe("toTsObjectLiteral", () => {
	it("serializes basic primitives", () => {
		expect(toTsObjectLiteral("hello")).toBe(JSON.stringify("hello"));
		expect(toTsObjectLiteral("line\nbreak")).toBe(
			JSON.stringify("line\nbreak"),
		);
		expect(toTsObjectLiteral(42)).toBe("42");
		expect(toTsObjectLiteral(true)).toBe("true");
		expect(toTsObjectLiteral(false)).toBe("false");
		expect(toTsObjectLiteral(undefined)).toBe("undefined");
		expect(toTsObjectLiteral(null)).toBe("null");
	});

	it("serializes bigint", () => {
		expect(toTsObjectLiteral(123n)).toBe("123n");
	});

	it("serializes functions by toString()", () => {
		function add(a: number, b: number) {
			return a + b;
		}
		const arrow = (x: number) => x * 2;
		const decl = toTsObjectLiteral(add);
		const arr = toTsObjectLiteral(arrow);
		expect(decl).toContain("function add");
		// Type annotations are erased at runtime; just assert core structure
		expect(arr).toContain("(x) => x * 2");
	});

	it("serializes Date", () => {
		const d = new Date("2024-01-01T00:00:00.000Z");
		expect(toTsObjectLiteral(d)).toBe(
			`new Date(${JSON.stringify(d.toISOString())})`,
		);
	});

	it("serializes RegExp", () => {
		expect(toTsObjectLiteral(/abc/i)).toBe("/abc/i");
	});

	it("serializes arrays (including nested)", () => {
		const arr = [1, "a", true, [2, "b"]];
		expect(toTsObjectLiteral(arr)).toBe('[1, "a", true, [2, "b"]]');
	});

	it("serializes empty array", () => {
		expect(toTsObjectLiteral([])).toBe("[]");
	});

	it("serializes Set (mixed values) and empty Set", () => {
		const s = new Set(["x", 5, false]);
		expect(toTsObjectLiteral(s)).toBe('new Set(["x", 5, false])');
		expect(toTsObjectLiteral(new Set())).toBe("new Set([])");
	});

	it("serializes Map (mixed key/value) and empty Map", () => {
		const m = new Map<unknown, unknown>([
			[1, "one"],
			["two", 2],
			[true, false],
		]);
		expect(toTsObjectLiteral(m)).toBe(
			'new Map([[1, "one"], ["two", 2], [true, false]])',
		);
		expect(toTsObjectLiteral(new Map())).toBe("new Map([])");
	});

	it("serializes object with valid and invalid identifiers", () => {
		const obj = {
			" spaced key ": 6,
			_underscore: 3,
			$dollar_ok: 2,
			"1x": 5,
			"a-b": 4,
			normalKey: 1,
		};
		const out = toTsObjectLiteral(obj);
		expect(out).toContain("normalKey: 1");
		expect(out).toContain("$dollar_ok: 2");
		expect(out).toContain("_underscore: 3");
		expect(out).toContain('"a-b": 4');
		expect(out).toContain('"1x": 5');
		expect(out).toContain(`${JSON.stringify(" spaced key ")}: 6`);
	});

	it("serializes nested composite structure", () => {
		const composite = {
			arr: [new Date("2024-03-03T00:00:00.000Z"), /x/i],
			date: new Date("2024-02-02T00:00:00.000Z"),
			inner: { value: 10 },
			map: new Map([["k", new Set([1, 2])]]),
			rx: /test/g,
		};
		const out = toTsObjectLiteral(composite);
		expect(out).toContain("date: new Date(");
		expect(out).toContain("rx: /test/g");
		expect(out).toContain('map: new Map([["k", new Set([1, 2])]])');
		expect(out).toContain("arr: [new Date(");
		expect(out).toContain("inner: { value: 10 }");
	});

	it("uses raw() to embed unquoted code", () => {
		const obj = {
			handler: raw('() => console.log("hi")'),
			nested: [raw("doThing()"), "plain"],
			value: raw("SOME_CONST"),
		};
		const out = toTsObjectLiteral(obj);
		expect(out).toContain('handler: () => console.log("hi")');
		expect(out).toContain("value: SOME_CONST");
		expect(out).toContain('[doThing(), "plain"]');
	});

	it("represents symbol values as undefined literal", () => {
		const obj = { sym: Symbol("x") };
		const out = toTsObjectLiteral(obj);
		expect(out).toContain("sym: undefined");
	});

	it("serializes empty object", () => {
		expect(toTsObjectLiteral({})).toBe("{  }");
	});

	it("is deterministic for identical object across calls", () => {
		const target = {
			a: 1,
			b: [2, 3],
			c: new Set(["x"]),
			d: new Map([[1, "y"]]),
		};
		const out1 = toTsObjectLiteral(target);
		const out2 = toTsObjectLiteral(target);
		expect(out1).toBe(out2);
	});

	it("wraps errors for circular structures", () => {
		const circ: Record<string, unknown> = {};
		(circ as { self?: unknown }).self = circ;
		expect(() => toTsObjectLiteral(circ)).toThrow(
			/Error in toTsObjectLiteral:/,
		);
	});

	it("RawTs constructor assigns code", () => {
		const snippet = raw("X");
		expect((snippet as { code: string }).code).toBe("X");
	});

	it("complex snapshot", () => {
		const complex = {
			active: true,
			big: 9007199254740991n,
			data: [raw("compute()"), null, new Date("2024-01-01T00:00:00.000Z")],
			id: 7,
			meta: {
				"needs-quote": "yes",
				validKey: new Map([["a", new Set([1, 2, 3])]]),
			},
			pattern: /abc/i,
			title: "Hello",
		};
		const out = toTsObjectLiteral(complex);
		const expected =
			'{ active: true, big: 9007199254740991n, data: [compute(), null, new Date("2024-01-01T00:00:00.000Z")], id: 7, meta: { "needs-quote": "yes", validKey: new Map([["a", new Set([1, 2, 3])]]) }, pattern: /abc/i, title: "Hello" }';
		expect(out).toBe(expected);
		expect(out).toContain("id: 7");
		expect(out).toContain('title: "Hello"');
		expect(out).toContain("active: true");
		expect(out).toContain("big: 9007199254740991n");
	});
});
