import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import sharp from "sharp";

const legacyRoot = process.argv[2];

if (!legacyRoot) {
  throw new Error("Usage: node scripts/import-legacy-assets.mjs <legacy-repo-path>");
}

const outputRoot = join(process.cwd(), "public", "images");
const assets = [
  ["background.jpg", "hero/sheffield-home.jpg", 2400],
  ["DSCF4371.JPG", "places/london/battersea-park.jpg", 1800],
  ["129290658_2870974616500034_7732703758045352225_n.jpg", "places/london/wandsworth.jpg", 1800],
  ["DSCF4125.JPG", "places/london/wandsworth-evening.jpg", 1800],
  ["DSCF4357.JPG", "places/london/hampton-court.jpg", 1800],
  ["DSCF4022.JPG", "places/sheffield/beighton-01.jpg", 1800],
  ["DSCF4002.JPG", "places/sheffield/beighton-02.jpg", 1800],
  ["DSCF4019.JPG", "places/sheffield/beighton-03.jpg", 1800],
  ["DSCF3844.JPG", "places/sheffield/beighton-04.jpg", 1800],
];

for (const [sourceName, destinationName, maxWidth] of assets) {
  const destination = join(outputRoot, destinationName);
  await mkdir(join(destination, ".."), { recursive: true });
  await sharp(join(legacyRoot, "images", sourceName))
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(destination);
}

console.log(`Imported ${assets.length} metadata-free images into public/images.`);
