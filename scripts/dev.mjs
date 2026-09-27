// Dev runner: starts `next dev` AND watches public/images/places/ so that
// dropping photos in (or removing them) auto-runs resize + manifest generation,
// which Next then hot-reloads. One command, no extra dependencies.
//
// Extra args are forwarded to next dev, e.g. `npm run dev -- --hostname 0.0.0.0`.

import { spawn, execFileSync } from "node:child_process";
import { watch, existsSync } from "node:fs";
import { basename, join } from "node:path";

const PLACES_DIR = join(process.cwd(), "public", "images", "places");
const forwardedArgs = process.argv.slice(2);

let running = false;
let queued = false;
let timer = null;

function regenerate() {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  try {
    execFileSync("node", ["scripts/resize-photos.mjs"], { stdio: "inherit" });
    execFileSync("node", ["scripts/generate-photos.mjs"], { stdio: "inherit" });
  } catch (error) {
    console.error("[watch-photos] regeneration failed:", error.message);
  }
  running = false;
  if (queued) {
    queued = false;
    regenerate();
  }
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(regenerate, 600); // debounce bursts of file events
}

// Initial pass, then start watching.
regenerate();

if (existsSync(PLACES_DIR)) {
  watch(PLACES_DIR, { recursive: true }, (_event, file) => {
    if (!file) return;
    const name = basename(file);
    if (name.startsWith(".tmp-")) return; // ignore resize's temp files
    schedule();
  });
  console.log("[watch-photos] watching public/images/places/ for changes");
}

// Start Next's dev server; when it exits, so do we. Resolve the local binary
// directly so we don't need a shell (avoids the shell-args deprecation warning).
const nextBin = join(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");
const next = spawn(nextBin, ["dev", ...forwardedArgs], { stdio: "inherit" });
next.on("exit", (code) => process.exit(code ?? 0));

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => next.kill(signal));
}
