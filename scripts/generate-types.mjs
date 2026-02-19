import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const input = resolve("openapi/v3-reference.yaml");
const output = resolve("src/generated/openapi-types.ts");

await mkdir(dirname(output), { recursive: true });

await new Promise((resolvePromise, rejectPromise) => {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const child = spawn(command, ["openapi-typescript", input, "-o", output], {
    stdio: "inherit"
  });

  child.on("error", rejectPromise);
  child.on("exit", (code) => {
    if (code === 0) {
      resolvePromise(undefined);
      return;
    }

    rejectPromise(new Error(`openapi-typescript exited with code ${code}`));
  });
});

console.log(`Generated ${output}`);
