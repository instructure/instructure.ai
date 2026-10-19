import catalog from "./tools.generated.json";
import { escapeHtml } from "../ui/html";
import { renderCodeSample, renderInlineText } from "../guides/render";

export interface AvailableTool {
	title: string;
	description: string;
	roles: string[];
	readOnly: boolean;
	resource: string;
	example?: string;
}

function roleLabel(role: string): string {
	return role === "ta" ? "TA" : role.charAt(0).toUpperCase() + role.slice(1);
}

export function renderTool(tool: AvailableTool): string {
	const roles = tool.roles.map(roleLabel).sort((left, right) => left.localeCompare(right, "en"));
	return `<li class="instui-card -variant-nested" data-tool-card><div class="content">
		<h3 class="instui-heading -variant-title-card-regular">${escapeHtml(tool.title)}</h3>
		<p class="tool-access"><span class="instui-pill -color-info">${escapeHtml(roleLabel(tool.resource))}</span><span class="instui-pill tool-access-pill ${tool.readOnly ? "-color-success" : "-color-warning"}">${tool.readOnly ? "Read only" : "Write access"}</span>${roles.map((role) => `<span class="instui-pill">${escapeHtml(role)}</span>`).join(" ")}</p>
		<p class="tool-description">${renderInlineText(tool.description)}</p>
		${tool.example ? `<h4 class="instui-heading -level-h4">Example</h4>${renderCodeSample(tool.example, "prompt", "Example")}` : ""}
		</div></li>`;
}

export function renderTools(): string {
	const roles = [...new Set(catalog.tools.flatMap((tool) => tool.roles))].sort((left, right) =>
		roleLabel(left).localeCompare(roleLabel(right), "en"),
	);
	const resources = [...new Set(catalog.tools.map((tool) => tool.resource))].sort();
	return `<p id="tool-catalog-description">Catalog date: <time datetime="${catalog.catalog}">${catalog.catalog}</time></p><p>Availability depends on your Canvas permissions and developer-key scopes. Roles describe intended use, not access enforcement.</p>
		<div class="controls tool-filter-controls instui-card -variant-nested --bg-secondary --pb-2xl"><label class="field-label" for="tool-search">Filter tools</label><input id="tool-search" class="instui-text-input text-input" type="search" placeholder="Search titles, descriptions, resources, roles, or examples" aria-controls="tool-list" />
		<div class="tool-filters">
		<div><label class="field-label" for="tool-resource-filter">Resource</label><select id="tool-resource-filter" class="instui-simple-select text-input" aria-controls="tool-list"><option value="">All resources</option>${resources.map((resource) => `<option value="${escapeHtml(resource)}">${escapeHtml(roleLabel(resource))}</option>`).join("")}</select></div>
		<div><label class="field-label" for="tool-access-filter">Access</label><select id="tool-access-filter" class="instui-simple-select text-input" aria-controls="tool-list"><option value="">All access</option><option value="read">Read only</option><option value="write">Write access</option></select></div>
		<fieldset id="tool-role-filter" class="tool-role-filter" aria-describedby="tool-role-hint"><legend class="field-label">Roles</legend><p id="tool-role-hint" class="field-hint">Match any selected role. None selected shows all roles.</p><div class="tool-role-options">${roles.map((role) => `<label class="instui-checkbox"><input type="checkbox" name="tool-role" value="${escapeHtml(role)}" aria-controls="tool-list">${escapeHtml(roleLabel(role))}</label>`).join("")}</div></fieldset>
		</div></div>
		<p id="tool-results" role="status" aria-live="polite">${catalog.tools.length} of ${catalog.tools.length} tools</p>
		<p id="tool-empty" hidden>No tools match your filters.</p>
		<ul id="tool-list" class="tool-list" aria-describedby="tool-catalog-description">${catalog.tools.map(renderTool).join("")}</ul>`;
}

export function toolFilterQuery(search: string): URLSearchParams {
	const input = new URLSearchParams(search);
	const result = new URLSearchParams();
	const query = input.get("toolSearch");
	if (query) result.set("toolSearch", query);
	const access = input.get("toolAccess");
	if (access === "read" || access === "write") result.set("toolAccess", access);
	const resource = input.get("toolResource");
	if (resource && catalog.tools.some((tool) => tool.resource === resource))
		result.set("toolResource", resource);
	const roles = [...new Set(input.getAll("toolRole"))]
		.filter((role) => catalog.tools.some((tool) => tool.roles.includes(role)))
		.sort();
	for (const role of roles) result.append("toolRole", role);
	return result;
}

export function bindToolFilters(
	root: HTMLElement,
	query = "",
	onChange?: (query: string) => void,
): void {
	const search = root.querySelector<HTMLInputElement>("#tool-search");
	const access = root.querySelector<HTMLSelectElement>("#tool-access-filter");
	const role = root.querySelector<HTMLFieldSetElement>("#tool-role-filter");
	const resource = root.querySelector<HTMLSelectElement>("#tool-resource-filter");
	if (!search || !access || !role || !resource) return;
	const initial = toolFilterQuery(query);
	search.value = initial.get("toolSearch") ?? "";
	access.value = initial.get("toolAccess") ?? "";
	resource.value = initial.get("toolResource") ?? "";
	role.querySelectorAll<HTMLInputElement>("input").forEach((checkbox) => {
		checkbox.checked = initial.getAll("toolRole").includes(checkbox.value);
	});
	const items = [...root.querySelectorAll<HTMLElement>("[data-tool-card]")];
	const filter = (): void => {
		const terms = search.value.trim().toLowerCase().split(/\s+/u).filter(Boolean);
		const selectedRoles = [...role.querySelectorAll<HTMLInputElement>("input:checked")].map(
			(checkbox) => checkbox.value,
		);
		let count = 0;
		items.forEach((item, index) => {
			const tool = catalog.tools[index]!;
			const searchable = [
				tool.title,
				tool.description,
				tool.resource,
				...tool.roles.map(roleLabel),
				tool.readOnly ? "Read only" : "Write access",
				tool.example ?? "",
			]
				.join(" ")
				.toLowerCase();
			item.hidden =
				!terms.every((term) => searchable.includes(term)) ||
				(access.value !== "" && tool.readOnly !== (access.value === "read")) ||
				(resource.value !== "" && tool.resource !== resource.value) ||
				(selectedRoles.length > 0 &&
					!selectedRoles.some((selected) => tool.roles.includes(selected)));
			if (!item.hidden) count++;
		});
		root.querySelector("#tool-results")!.textContent = `${count} of ${items.length} tools`;
		root.querySelector<HTMLElement>("#tool-empty")!.hidden = count !== 0;
	};
	const update = (): void => {
		filter();
		const params = new URLSearchParams();
		if (search.value) params.set("toolSearch", search.value);
		if (access.value) params.set("toolAccess", access.value);
		if (resource.value) params.set("toolResource", resource.value);
		role
			.querySelectorAll<HTMLInputElement>("input:checked")
			.forEach((checkbox) => params.append("toolRole", checkbox.value));
		onChange?.(toolFilterQuery(params.toString()).toString());
	};
	search.addEventListener("input", update);
	access.addEventListener("change", update);
	role.addEventListener("change", update);
	resource.addEventListener("change", update);
	filter();
}
