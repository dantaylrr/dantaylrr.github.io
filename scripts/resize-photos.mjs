// Downsizes over-large photos in public/images/places/<slug>/ to a web-friendly
// size, in place. Non-destructive to anything already within the target: a photo
// whose long edge is already <= MAX_EDGE is left byte-for-byte untouched, so
// re-runs are idempotent and existing web-sized photos never change.
//
// Run via `npm run resize:photos` (also runs before `npm run dev`/`build`).

import sharp from "sharp";
import { readdirSync, statSync, existsSync, renameSync } from "node:fs";
import { join, parse } from "node:path";

const PLACES_DIR = join(process.cwd(), "public", "images", "places");
const MAX_EDGE = 2000; // longest side, in px
const QUALITY = 82; // JPEG/WebP quality
const RESIZABLE = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

if (!existsSync(PLACES_DIR)) {
  console.log("resize:photos → no photos directory, nothing to do");
  process.exit(0);
}

let resized = 0;
let skipped = 0;

const slugs = readdirSync(PLACES_DIR).filter((entry) =>
  statSync(join(PLACES_DIR, entry)).isDirectory(),
);

for (const slug of slugs) {
  const dir = join(PLACES_DIR, slug);
  for (const file of readdirSync(dir)) {
    const ext = parse(file).ext.toLowerCase();
    if (!RESIZABLE.has(ext)) continue;

    const filePath = join(dir, file);
    const image = sharp(filePath, { failOn: "none" });
    const meta = await image.metadata();
    const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

    // Already web-sized — leave it exactly as it is.
    if (longEdge <= MAX_EDGE) {
      skipped += 1;
      continue;
    }

    // Resize (preserving aspect ratio) and re-encode, then swap in atomically.
    const tmpPath = join(dir, `.tmp-${file}`);
    let pipeline = image.rotate().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
    if (ext === ".png") pipeline = pipeline.png({ quality: QUALITY });
    else if (ext === ".webp") pipeline = pipeline.webp({ quality: QUALITY });
    else if (ext === ".avif") pipeline = pipeline.avif({ quality: QUALITY });
    else pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });

    await pipeline.toFile(tmpPath);
    renameSync(tmpPath, filePath);
    resized += 1;
    console.log(`  resized ${slug}/${file} (${longEdge}px → ${MAX_EDGE}px)`);
  }
}

console.log(`resize:photos → ${resized} resized, ${skipped} already web-sized`);
