import { Log } from "../utils";
import { name } from "../package.json";
import { cache } from "../cache";
import { parseCSV } from "./";

const main = async () => {
  const start = true;
  const end = true;
  const color = "greenBright";
	Log({ message: `Building ${name}`, start, color });
	const features = parseCSV(cache).parsed;
	Log(features);
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
