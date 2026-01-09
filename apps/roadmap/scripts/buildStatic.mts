import { type Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const fontsRoot = path.join(projectRoot, "src/assets/fonts");
const imagesRoot = path.join(projectRoot, "src/assets/images");

const outRoot = path.join(projectRoot, "public");
const outFonts = path.join(outRoot, "fonts");
const outImages = path.join(outRoot, "images");

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

const copyTree = async (srcRoot: string, destRoot: string) => {
  if (!(await existsDir(srcRoot))) {
    // eslint-disable-next-line no-console
    console.warn(`⚠️  Skipping missing dir: ${path.relative(projectRoot, srcRoot)}`);
    return;
  }

  const files = await walk(srcRoot);

  await Promise.all(
    files.map(async (srcAbs) => {
      const rel = path.relative(srcRoot, srcAbs);
      const dest = path.join(destRoot, rel);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(srcAbs, dest);
    }),
  );

  // eslint-disable-next-line no-console
  console.log(
    `✅ Copied ${files.length} file(s): ${path.relative(projectRoot, srcRoot)} → ${path.relative(
      projectRoot,
      destRoot,
    )}`,
  );
};

const main = async () => {
  await fs.mkdir(outRoot, { recursive: true });

  await Promise.all([copyTree(fontsRoot, outFonts), copyTree(imagesRoot, outImages)]);
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
