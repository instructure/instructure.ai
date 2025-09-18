import {
	exitWithError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const { output } = Workspace(["workspace"], "info");

try {
	console.log(output);
} catch (e) {
	console.error(e);
	exitWithError("No workspace info found in output.");
}
