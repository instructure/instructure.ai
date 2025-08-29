import { IconPrinterLine } from "@instructure/ui";
import { useEffect } from "react";
import { ControlButton } from "./ControlButton.tsx";

const Print = () => {
	window.print();
};

const PrintControl: React.FC = () => {
	useEffect(() => {
		const handleBeforePrint = () => {
			const control = document.getElementById("control");
			if (control) {
				control.classList.add("hidden");
			}
		};
		const handleAfterPrint = () => {
			const control = document.getElementById("control");
			if (control) {
				control.classList.remove("hidden");
			}
		};
		window.addEventListener("beforeprint", handleBeforePrint);
		window.addEventListener("afterprint", handleAfterPrint);
		return () => {
			window.removeEventListener("beforeprint", handleBeforePrint);
			window.removeEventListener("afterprint", handleAfterPrint);
		};
	}, []);

	return <ControlButton Icon={IconPrinterLine} label="Print" onClick={Print} />;
};

export { PrintControl };
