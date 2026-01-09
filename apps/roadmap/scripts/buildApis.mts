import { type Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const apisRoot = path.join(projectRoot, "src/assets/apis");
const outApis = path.join(projectRoot, "public/apis");

const getEntryPaths = (entries: Dirent[], dir: string) => {
  const files: string[] = [];
  const dirs: string[] = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      dirs.push(full);
    } else if (ent.isFile()) {
      files.push(full);
    }
  }
  return { dirs, files };
};

const walk = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const { files, dirs } = getEntryPaths(entries, dir);

  const nestedResults = await Promise.all(dirs.map(walk));
  for (const nested of nestedResults) {
    files.push(...nested);
  }
  return files;
};

const existsDir = async (dir: string): Promise<boolean> => {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

const copyAndMinifyJsonFlat = async (srcAbs: string, usedNames: Set<string>) => {
  const fileName = path.basename(srcAbs);
  if (usedNames.has(fileName)) {
    throw new Error(
      `Duplicate API definition filename "${fileName}". Flattening to ${outApis} would overwrite. Source: ${srcAbs}`,
    );
  }
  usedNames.add(fileName);

  const dest = path.join(outApis, fileName);
  const raw = await fs.readFile(srcAbs, "utf8");
  const minified = JSON.stringify(JSON.parse(raw));

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, minified, "utf8");
};

const main = async () => {
  if (!(await existsDir(apisRoot))) {
    // eslint-disable-next-line no-console
    console.warn(`⚠️  Skipping missing dir: ${path.relative(projectRoot, apisRoot)}`);
    return;
  }

  const apiFiles = await walk(apisRoot);
  const jsonFiles = apiFiles.filter((file) => file.endsWith(".json"));

  await fs.mkdir(outApis, { recursive: true });

  const usedNames = new Set<string>();
  await Promise.all(jsonFiles.map((jsonFile) => copyAndMinifyJsonFlat(jsonFile, usedNames)));

  // eslint-disable-next-line no-console
  console.log(
    `✅ Built ${jsonFiles.length} API file(s): ${path.relative(projectRoot, apisRoot)} → ${path.relative(
      projectRoot,
      outApis,
    )}`,
  );
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
