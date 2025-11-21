import {
  Workspace,
  exec,
  unknownError,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
  const { output } = Workspace(["workspace"]);
  exec(() => {
    console.log(output);
  });
};

main().catch((error) => unknownError(error));

export { main };
