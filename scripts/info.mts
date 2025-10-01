/// <reference path="../types/index.d.ts" />

import {
	exec,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { output } = Workspace(["workspace"]);
	exec(() => {
		console.log(output);
	});
};

main().catch((e) => unknownError(e));
