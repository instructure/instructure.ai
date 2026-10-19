import manifest from "./scopes.generated.json";

export const SCOPE_MANIFEST = manifest.scopes.join("\n");
export const SCOPE_PROVENANCE = {
	status: manifest.status,
	mapleRevision: manifest.mapleRevision,
	generatedAt: manifest.generatedAt,
	reviewedAt: manifest.reviewedAt as string | null,
};
export function scopeManifestReady(): boolean {
	const { status, mapleRevision, generatedAt, reviewedAt } = SCOPE_PROVENANCE;
	return (
		status === "reviewed" &&
		/^[a-f0-9]{40}$/u.test(mapleRevision) &&
		/^\d{4}-\d{2}-\d{2}$/u.test(generatedAt) &&
		Boolean(reviewedAt && /^\d{4}-\d{2}-\d{2}$/u.test(reviewedAt))
	);
}
