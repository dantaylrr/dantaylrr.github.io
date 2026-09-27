// Pre-renders the static base map to public/map-base.webp so visitors' browsers
// never have to rasterise it themselves. Run with: npm run generate:map
//
// Rasterises the exact SVG the app would draw (from the shared baseMap module,
// so it can never drift from the live vector rendering) at ~3.4x — crisp at
// normal zooms while staying under the 4096px single-GPU-texture limit.

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import process from "node:process";
import sharp from "sharp";
import { buildMapGeometry, buildBaseSvg, WIDTH, HEIGHT } from "../src/components/world-map/baseMap.ts";

const require = createRequire(import.meta.url);
const topoPath = require.resolve("world-atlas/countries-110m.json");
const topology = JSON.parse(await readFile(topoPath, "utf8"));

const geometry = buildMapGeometry(topology);
const svg = buildBaseSvg(geometry);

const scale = 3.4;
const targetWidth = Math.round(WIDTH * scale);
const targetHeight = Math.round(HEIGHT * scale);
const outPath = join(process.cwd(), "public", "map-base.webp");

const info = await sharp(Buffer.from(svg), { density: Math.round(72 * scale) })
  .resize(targetWidth, targetHeight)
  .webp({ quality: 82, effort: 6 })
  .toFile(outPath);

console.log(`wrote public/map-base.webp — ${targetWidth}x${targetHeight}, ${(info.size / 1024).toFixed(0)} KB`);
