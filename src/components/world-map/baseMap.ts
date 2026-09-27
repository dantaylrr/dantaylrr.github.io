// Shared, framework-agnostic map geometry + base-map SVG builder.
//
// This is the single source of truth for the static base map, used by BOTH:
//   • the WorldMap component (for the crisp zoomed-in vector base + marker
//     projection), and
//   • scripts/generate-base-map.mjs (which rasterises buildBaseSvg to the
//     cached public/map-base.webp the map shows when zoomed out / moving).
//
// Keeping it here means the pre-rendered bitmap can never drift from the live
// vector rendering — regenerate the webp with `npm run generate:map` whenever
// any of these colours/paths change.

import {
  geoEquirectangular,
  geoGraticule10,
  geoMercator,
  geoPath,
  type GeoPermissibleObjects,
  type GeoProjection,
} from "d3-geo";
import { feature, mesh } from "topojson-client";

export const WIDTH = 1200;
export const HEIGHT = 650;

type LandTopology = {
  objects: { countries: unknown };
};

export type TerrainRegion = {
  name: string;
  coordinates: [number, number][];
};

export const desertRegions: TerrainRegion[] = [
  { name: "Sahara", coordinates: [[-17, 30], [8, 34], [31, 31], [35, 22], [22, 14], [-5, 16], [-17, 22], [-17, 30]] },
  { name: "Arabian Desert", coordinates: [[36, 30], [58, 28], [56, 17], [43, 13], [36, 21], [36, 30]] },
  { name: "Gobi Desert", coordinates: [[76, 45], [101, 49], [116, 44], [108, 36], [84, 37], [76, 45]] },
  { name: "Australian Outback", coordinates: [[116, -20], [130, -16], [145, -22], [142, -32], [124, -34], [113, -27], [116, -20]] },
  { name: "Kalahari and Namib", coordinates: [[12, -17], [27, -18], [29, -30], [17, -32], [11, -24], [12, -17]] },
  { name: "North American deserts", coordinates: [[-117, 38], [-102, 35], [-99, 25], [-112, 23], [-117, 30], [-117, 38]] },
];

export type MapGeometry = {
  landPath: string;
  antarcticaPath: string;
  greenlandPath: string;
  bordersPath: string;
  graticulePath: string;
  projection: GeoProjection;
};

export function buildMapGeometry(topology: unknown): MapGeometry {
  const topo = topology as LandTopology;
  const countryCollection = feature(
    topology as never,
    topo.objects.countries as never,
  ) as unknown as {
    features: Array<GeoPermissibleObjects & { id?: string | number }>;
  };
  const antarctica = countryCollection.features.find((country) => String(country.id) === "010");
  const greenland = countryCollection.features.find((country) => String(country.id) === "304");
  const mainLand = {
    type: "FeatureCollection",
    features: countryCollection.features.filter((country) => String(country.id) !== "010"),
  } as GeoPermissibleObjects;
  const projection = geoMercator()
    .scale(WIDTH / (2 * Math.PI))
    .translate([WIDTH / 2, 320])
    .clipExtent([[0, 0], [WIDTH, HEIGHT]]);
  // Keep longitude aligned with the Mercator map, while compressing the extreme
  // southern latitudes into a restrained edge instead of letting Mercator
  // stretch Antarctica across the viewport.
  const antarcticaProjection = geoEquirectangular()
    .scale(WIDTH / (2 * Math.PI))
    .translate([WIDTH / 2, 350]);

  return {
    landPath: geoPath(projection)(mainLand) ?? "",
    antarcticaPath: antarctica ? geoPath(antarcticaProjection)(antarctica) ?? "" : "",
    greenlandPath: greenland ? geoPath(projection)(greenland) ?? "" : "",
    bordersPath: geoPath(projection)(mesh(
      topology as never,
      topo.objects.countries as never,
      (a, b) => a !== b,
    ) as unknown as GeoPermissibleObjects) ?? "",
    graticulePath: geoPath(projection)(geoGraticule10()) ?? "",
    projection,
  };
}

export function regionPath(projection: GeoProjection, region: TerrainRegion): string {
  const winding = region.coordinates.slice(0, -1).reduce((sum, point, index) => {
    const next = region.coordinates[index + 1];
    return sum + (next[0] - point[0]) * (next[1] + point[1]);
  }, 0);
  const coordinates = winding < 0 ? [...region.coordinates].reverse() : region.coordinates;

  return geoPath(projection)({
    type: "Polygon",
    coordinates: [coordinates],
  } as GeoPermissibleObjects) ?? "";
}

// Build a fully self-contained SVG string of the static base map (all colours,
// patterns, gradients and filters inlined) so it renders identically whether
// drawn by the browser or rasterised by sharp/librsvg. Mirrors exactly the
// vector fallback layers in WorldMap.tsx.
export function buildBaseSvg(geometry: MapGeometry): string {
  const { landPath, antarcticaPath, greenlandPath, bordersPath, graticulePath, projection } = geometry;

  const defs =
    `<defs>` +
    `<pattern id="waves" width="34" height="18" patternUnits="userSpaceOnUse"><path d="M0 10 Q8 4 17 10 T34 10" fill="none" stroke="#89ab9d" stroke-width="1" opacity="0.27"/></pattern>` +
    `<radialGradient id="warm-sea" cx="50%" cy="40%" r="78%"><stop offset="0%" stop-color="#f3e8c9" stop-opacity="0.34"/><stop offset="55%" stop-color="#e9dcbc" stop-opacity="0.13"/><stop offset="100%" stop-color="#c8b78c" stop-opacity="0"/></radialGradient>` +
    `<filter id="terrain-soft" x="-8%" y="-8%" width="116%" height="116%"><feGaussianBlur stdDeviation="3.5"/></filter>` +
    `<pattern id="land-speckle" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r="0.7" fill="#536f4e" opacity="0.22"/><circle cx="14" cy="12" r="0.5" fill="#f4edd7" opacity="0.38"/><path d="M7 16 l3 -1" stroke="#667e59" stroke-width="0.45" opacity="0.22"/></pattern>` +
    `<clipPath id="land-clip"><path d="${landPath}"/></clipPath>` +
    `</defs>`;

  const deserts = desertRegions
    .map((region) => `<path d="${regionPath(projection, region)}" fill="#e0cd8d" opacity="0.5"/>`)
    .join("");

  const body =
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="#c6dbcf"/>` +
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#waves)"/>` +
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#warm-sea)"/>` +
    `<path d="${graticulePath}" fill="none" stroke="#557f7b" stroke-width="0.55" stroke-dasharray="2 5" opacity="0.22"/>` +
    `<path d="${antarcticaPath}" fill="rgba(42,67,49,0.22)" transform="translate(0 5)"/>` +
    `<path d="${antarcticaPath}" fill="#eef2e8" stroke="#647868" stroke-width="1.1" stroke-linejoin="round"/>` +
    `<path d="${landPath}" fill="rgba(42,67,49,0.22)" transform="translate(0 5)"/>` +
    `<path d="${landPath}" fill="#bdc487" stroke="#726844" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="${landPath}" fill="url(#land-speckle)"/>` +
    `<path d="${greenlandPath}" fill="#eef2e8" stroke="#647868" stroke-width="1.1" stroke-linejoin="round"/>` +
    `<g clip-path="url(#land-clip)" filter="url(#terrain-soft)">${deserts}</g>` +
    `<path d="${bordersPath}" fill="none" stroke="#7c7150" stroke-width="0.34" stroke-linejoin="round" opacity="0.45"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${defs}${body}</svg>`;
}
