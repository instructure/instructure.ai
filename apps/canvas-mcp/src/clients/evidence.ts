import { type Evidence, type Fact } from "./types";
export const setupGuidance: Evidence = {
	method: "instructure",
	label: "Instructure setup guidance",
	version: "2026-09-11",
	verifiedAt: "2026-10-17",
};
export function documented<T>(value: T): Fact<T> {
	return { value, status: "documented", evidence: [setupGuidance] };
}
