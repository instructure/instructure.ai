export async function copyToClipboard(value: string, label: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(value);
	} catch {
		const temporary = document.createElement("textarea");
		temporary.value = value;
		temporary.setAttribute("readonly", "");
		temporary.style.position = "fixed";
		temporary.style.opacity = "0";
		document.body.append(temporary);
		temporary.select();
		document.execCommand("copy");
		temporary.remove();
	}
	const toast = document.querySelector<HTMLElement>(".toast");
	if (toast) {
		toast.textContent = label;
	}
}
