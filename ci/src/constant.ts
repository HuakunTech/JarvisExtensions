import fs from "fs";
import path from "path";

export const REPO_ROOT = path.resolve(__dirname, "../../");
export const DOCKER_BUILD_ENTRYPOINT = path.resolve(
  REPO_ROOT,
  "scripts",
  "docker",
  "entrypoint.sh",
);

/* -------------------------------------------------------------------------- */
/*                            Check Path Existence                            */
/* -------------------------------------------------------------------------- */

if (!fs.existsSync(DOCKER_BUILD_ENTRYPOINT)) {
  console.error(
    `Docker build entrypoint not found: ${DOCKER_BUILD_ENTRYPOINT}`,
  );
  process.exit(1);
}

if (!fs.existsSync(REPO_ROOT)) {
  console.error(`Repo root not found: ${REPO_ROOT}`);
  process.exit(1);
}
