import { promises as fs } from "fs";
import path from "path";

/**
 * Runtime data directory.
 * Locally: ./data
 * On Zerops: /data (Local Storage volume) so admin edits survive deploys.
 */
export function getDataDir(): string {
  return process.env.DATA_DIR?.trim() || path.join(process.cwd(), "data");
}

/** Bundled seed files shipped with the deploy (git `data/`). */
export function getSeedDir(): string {
  return path.join(process.cwd(), "data");
}

export function dataFile(...parts: string[]): string {
  return path.join(getDataDir(), ...parts);
}

export function seedFile(...parts: string[]): string {
  return path.join(getSeedDir(), ...parts);
}

/**
 * Ensure a runtime JSON file exists. If missing, copy from the seed
 * shipped with the app (first boot on a fresh volume). Never overwrites
 * an existing runtime file — that is what keeps admin edits alive.
 */
export async function ensureRuntimeFile(
  name: string,
  fallbackContents?: string,
): Promise<string> {
  const runtimePath = dataFile(name);
  try {
    await fs.access(runtimePath);
    return runtimePath;
  } catch {
    // missing
  }

  await fs.mkdir(path.dirname(runtimePath), { recursive: true });

  const fromSeed = seedFile(name);
  try {
    await fs.copyFile(fromSeed, runtimePath);
    return runtimePath;
  } catch {
    if (fallbackContents != null) {
      await fs.writeFile(runtimePath, fallbackContents, "utf8");
      return runtimePath;
    }
    throw new Error(`Missing runtime data file: ${name}`);
  }
}
