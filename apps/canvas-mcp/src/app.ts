import { guideValues, resolveCodeBlock } from "./guides/render";
import { CallbackCache, type CallbackResolution } from "./oauth/codex-callback";
import { connectionReadiness, normalizeSetup } from "./setup";
import "./main.css";
import { clientDefinition, normalizeKeyType } from "./clients";
import { renderPage, type PageMode } from "./page";
import { copyToClipboard } from "./ui/copy";
import { applyTheme, setTheme } from "./ui/theme";
import {
	type AppState,
	type StorageLike,
	normalizeCanvasDomain,
	deriveUrls,
	readState,
	savePreferences,
	stateQuery,
} from "./state";
const mounts = new WeakMap<HTMLElement, symbol>();

export function mountApp(mode: PageMode): void {
	const root = document.querySelector<HTMLElement>("#root");
	if (!root) {
		return;
	}
	const appRoot = root,
		state = readState(globalThis.location.search, getStorage());
	const mount = Symbol();
	mounts.set(appRoot, mount);
	let pageMode = pageModeFromQuery(globalThis.location.search) ?? mode;
	normalizeSetup(state);
	function isConnectionReady(): boolean {
		return connectionReadiness(state).ready;
	}
	if (pageMode === "user" && !isConnectionReady()) {
		pageMode = "admin";
	}
	if (!new URLSearchParams(globalThis.location.search).has("surface"))
		state.surface = pageMode === "user" ? "provider" : "canvas";
	normalizeSetup(state);
	const viewState = { domainInputValue: state.domain };
	const callbacks = new CallbackCache();
	let activeCallbackKey = "";
	function callbackResolution(): CallbackResolution | undefined {
		const redirect = clientDefinition(state.client).facts.redirectUri;
		if (
			redirect.kind !== "computed" ||
			redirect.mode === "unknown" ||
			!state.domain ||
			!state.region
		) {
			activeCallbackKey = "";
			return;
		}
		const url = deriveUrls(state).mcp,
			key = JSON.stringify([url, redirect.base, redirect.mode]);
		activeCallbackKey = key;
		return callbacks.request(url, redirect.base, redirect.mode, () => {
			if (activeCallbackKey === key && appRoot.isConnected && mounts.get(appRoot) === mount)
				persistAndRender();
		});
	}

	function render() {
		if (pageMode === "admin" && state.install !== "enterprise") state.surface = "canvas";
		appRoot.innerHTML = renderPage(
			state,
			pageMode,
			viewState.domainInputValue,
			isConnectionReady(),
			callbackResolution(),
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
			.querySelectorAll<HTMLInputElement | HTMLButtonElement>("[data-guide-surface]")
			.forEach((control) => {
				control.addEventListener(control instanceof HTMLInputElement ? "change" : "click", () => {
					state.surface = control.dataset.guideSurface === "provider" ? "provider" : "canvas";
					persistAndRender();
					if (control.hasAttribute("data-scroll-guide")) {
						appRoot
							.querySelector<HTMLElement>("#guide-surface-provider")
							?.focus({ preventScroll: true });
						globalThis.scrollTo({ top: 0, behavior: "smooth" });
					}
				});
			});
		appRoot.querySelectorAll<HTMLButtonElement>("[data-install]").forEach((button) =>
			button.addEventListener("click", () => {
				state.install = button.dataset.install === "enterprise" ? "enterprise" : "personal";
				persistAndRender();
			}),
		);
		appRoot.querySelector('[role="tablist"]')?.addEventListener("keydown", (event) => {
			const key = (event as KeyboardEvent).key;
			if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
			const tabs = [...appRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
			const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
			if (index < 0) return;
			event.preventDefault();
			const next =
				key === "Home"
					? 0
					: key === "End"
						? tabs.length - 1
						: (index + (key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
			tabs.forEach((tab, i) => (tab.tabIndex = i === next ? 0 : -1));
			tabs[next]?.focus();
		});
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
				state.surface = pageMode === "user" ? "provider" : "canvas";
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
				state.key = normalizeKeyType(state.client, "");
				state.surface = "canvas";
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
				appRoot
					.querySelectorAll<HTMLElement>('[data-guide-token="clientId"]')
					.forEach(
						(element) =>
							(element.textContent = state.clientId || "Enter the Client ID from your Canvas key"),
					);
				appRoot.querySelectorAll<HTMLButtonElement>("[data-copy-template]").forEach((button) => {
					const resolved = resolveCodeBlock(
						button.dataset.copyTemplate!,
						guideValues(clientDefinition(state.client), state),
					);
					button.dataset.copy = resolved.text;
					button.disabled = !resolved.ready;
				});
				const permalink = appRoot.querySelector<HTMLElement>(".print-permalink");
				if (permalink) permalink.textContent = globalThis.location.href;
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
		if (pageMode === "admin" && state.install !== "enterprise") state.surface = "canvas";
		savePreferences(state, getStorage());
		const search = pageQuery(state, pageMode);
		globalThis.history.replaceState(
			null,
			"",
			`${globalThis.location.pathname}${search ? `?${search}` : ""}`,
		);
	}

	function persistAndRender() {
		const focusedId = document.activeElement?.id;
		persist();
		render();
		if (focusedId) {
			const target = document.getElementById(focusedId);
			if (target instanceof HTMLElement && !target.closest("[hidden]"))
				target.focus({ preventScroll: true });
		}
	}

	render();
	persist();
}

function updatePrintPageBreaks(root: HTMLElement): void {
	const cards = [
		...root.querySelectorAll<HTMLElement>(
			".workspace-grid > .instui-card, .configuration-stack > .server-details-card",
		),
	].filter((card) => !card.classList.contains("is-hidden"));
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
