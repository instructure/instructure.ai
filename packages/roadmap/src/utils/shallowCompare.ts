export function shallowCompare<T extends object>(
	a: T | null,
	b: T | null,
): boolean {
	if (a === b) return true;
	if (a == null || b == null) return false;
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) {
		if (!(key in b) || a[key as keyof T] !== b[key as keyof T]) return false;
	}
	return true;
}
export default shallowCompare;
