import { connectionReadiness, normalizeSetup } from "./setup";
import "./main.css";
import { normalizeKeyType } from "./clients";
import { renderPage, type PageMode } from "./page";
import { copyToClipboard } from "./ui/copy";
import { applyTheme, setTheme } from "./ui/theme";
import {
	type AppState,
	type StorageLike,
	normalizeCanvasDomain,
	readState,
	savePreferences,
	stateQuery,
} from "./state";
export function mountApp(mode: PageMode): void {
	const root = document.querySelector<HTMLElement>("#root");
	if (!root) {
		return;
	}
	const appRoot = root,
		state = readState(globalThis.location.search, getStorage());
	let pageMode = pageModeFromQuery(globalThis.location.search) ?? mode;
	normalizeSetup(state);
	function isConnectionReady(): boolean {
		return connectionReadiness(state).ready;
	}
	if (pageMode === "user" && !isConnectionReady()) {
		pageMode = "admin";
	}
	const viewState = { domainInputValue: state.domain };

	function render() {
		appRoot.innerHTML = renderPage(
			state,
			pageMode,
			viewState.domainInputValue,
			isConnectionReady(),
		);
		updatePrintPageBreaks(appRoot);
		bindEvents();
		applyTheme();
	}

	function syncConnectTab(): void {
		const connectTab = appRoot.querySelector<HTMLButtonElement>('[data-page="connect"]');
		if (pageMode === "admin" && connectTab) {
			const ready = isConnectionReady();
			connectTab.disabled = !ready;
			appRoot
				.querySelectorAll<HTMLButtonElement>("[data-configure-client]")
				.forEach((button) => (button.disabled = !ready));
		}
	}

	function bindEvents() {
		appRoot
			.querySelector<HTMLInputElement>("#enterprise-install-input")
			?.addEventListener("change", (event) => {
				state.install = (event.currentTarget as HTMLInputElement).checked
					? "enterprise"
					: "personal";
				persistAndRender();
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((tab) => {
			tab.addEventListener("click", () => {
				if (tab.hasAttribute("data-configure-client")) {
					globalThis.scrollTo({ top: 0, behavior: "smooth" });
				}
				pageMode = tab.dataset.page === "admin" ? "admin" : "user";
				persistAndRender();
			});
		});
		appRoot
			.querySelector<HTMLInputElement>("#domain-input")
			?.addEventListener("change", (event) => {
				viewState.domainInputValue = (event.currentTarget as HTMLInputElement).value;
				state.domain = normalizeCanvasDomain(viewState.domainInputValue) ?? "";
				persistAndRender();
			});
		appRoot
			.querySelector<HTMLSelectElement>("#region-select")
			?.addEventListener("change", (event) => {
				state.region = (event.currentTarget as HTMLSelectElement).value as AppState["region"];
				persistAndRender();
			});
		appRoot
			.querySelector<HTMLSelectElement>("#client-select")
			?.addEventListener("change", (event) => {
				state.client = (event.currentTarget as HTMLSelectElement).value as AppState["client"];
				state.key = normalizeKeyType(state.client, "public");
				persistAndRender();
			});
		appRoot
			.querySelector<HTMLInputElement>("#private-key-input")
			?.addEventListener("change", (event) => {
				state.key = normalizeKeyType(
					state.client,
					(event.currentTarget as HTMLInputElement).checked ? "private" : "public",
				);
				persistAndRender();
			});
		appRoot
			.querySelector<HTMLInputElement>("#client-id-input")
			?.addEventListener("input", (event) => {
				state.clientId = (event.currentTarget as HTMLInputElement).value
					.replace(/\D/gu, "")
					.slice(0, 17);
				persist();
				const generatedClientIdInput =
						appRoot.querySelector<HTMLInputElement>("#generated-client-id"),
					generatedClientIdCopy = appRoot.querySelector<HTMLButtonElement>(
						"#generated-client-id-copy",
					);
				if (generatedClientIdInput) {
					generatedClientIdInput.value = state.clientId;
				}
				if (generatedClientIdCopy) {
					generatedClientIdCopy.dataset.copy = state.clientId;
					generatedClientIdCopy.disabled = !state.clientId;
				}
				appRoot
					.querySelector(".server-details-card")
					?.classList.toggle("is-hidden", !isConnectionReady());
				updatePrintPageBreaks(appRoot);
				syncConnectTab();
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
			button.addEventListener("click", () => setTheme(button.dataset.themeChoice ?? "system"));
		});
		appRoot
			.querySelector<HTMLButtonElement>('[data-action="print"]')
			?.addEventListener("click", () => globalThis.print());
		appRoot
			.querySelector<HTMLButtonElement>('[data-action="copy-link"]')
			?.addEventListener("click", async () => {
				await copyToClipboard(
					new URL(
						`${globalThis.location.pathname}?${pageQuery(state, "user")}`,
						globalThis.location.origin,
					).toString(),
					"Setup link copied",
				);
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
			button.addEventListener("click", async () =>
				copyToClipboard(button.dataset.copy ?? "", `${button.dataset.label ?? "Value"} copied`),
			);
		});
	}

	function persist() {
		normalizeSetup(state);
		savePreferences(state, getStorage());
		const search = pageQuery(state, pageMode);
		globalThis.history.replaceState(
			null,
			"",
			`${globalThis.location.pathname}${search ? `?${search}` : ""}`,
		);
	}

	function persistAndRender() {
		persist();
		render();
	}

	render();
	persist();
}

function updatePrintPageBreaks(root: HTMLElement): void {
	const cards = [...root.querySelectorAll<HTMLElement>(".instui-card:not(.controls-panel)")].filter(
		(card) => !card.classList.contains("is-hidden"),
	);
	cards.forEach((card, index) =>
		card.classList.toggle("print-page-break-after", index < cards.length - 1),
	);
}

function pageModeFromQuery(search: string): PageMode | null {
	const page = new URLSearchParams(search).get("page");
	if (page === "connect") return "user";
	if (page === "admin") return "admin";
	return null;
}

function pageQuery(state: AppState, pageMode: PageMode): string {
	const params = new URLSearchParams(stateQuery(state));
	params.set("page", pageMode === "admin" ? "admin" : "connect");
	return params.toString();
}

function getStorage(): StorageLike | null {
	try {
		return globalThis.localStorage;
	} catch {
		return null;
	}
}
