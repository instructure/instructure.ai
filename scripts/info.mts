import {
	exec,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { output } = Workspace(["workspace"], "info");
	exec(() => {
		console.log(output);
	});
};

main().catch((e) => unknownError(e));
