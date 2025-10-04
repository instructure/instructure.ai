import { Log } from "../utils";
import { UpdateCache } from "./";
import { name } from "../package.json";

const main = async () => {
  const start = true;
  const end = true;
  const color = "greenBright";
	Log({ message: `Building ${name}`, start, color });
  await UpdateCache();
	Log({ message: "Build complete.", end, color });
};

console.log("import.meta.url:", import.meta.url);
console.log("process.argv[1]:", process.argv[1]);

if (process.env.BUILD) {
	main().catch((error) => {
		Log({ color: "redBright", message: ["Error building aiinfo:", error] });
		process.exit(1);
	});
}

export { main as Build };
