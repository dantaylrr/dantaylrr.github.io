import { GENERATED_PHOTOS } from "./photos.generated";

export type Photo = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  orientation: "portrait" | "landscape";
  ratio: number; // height ÷ width
};

export type Place = {
  slug: string;
  name: string;
  country: string;
  coordinates: [longitude: number, latitude: number];
  accent: string;
  photos: Photo[];
};

// Place metadata only. Photos are discovered from public/images/places/<slug>/
// at build time (see scripts/generate-photos.mjs) and merged in below — so
// adding photos is just dropping files in the right folder, no edits here.
type PlaceMeta = Omit<Place, "photos">;

const placeMeta: PlaceMeta[] = [
  { slug: "london", name: "London", country: "England", coordinates: [-0.1276, 51.5072], accent: "#b84b38" },
  { slug: "sheffield", name: "Sheffield", country: "England", coordinates: [-1.4701, 53.3811], accent: "#356f59" },
  { slug: "paris", name: "Paris", country: "France", coordinates: [2.3522, 48.8566], accent: "#b84b38" },
  { slug: "reims", name: "Reims", country: "France", coordinates: [4.0347, 49.2583], accent: "#b84b38" },
  { slug: "strasbourg", name: "Strasbourg", country: "France", coordinates: [7.7521, 48.5734], accent: "#b84b38" },
  { slug: "lyon", name: "Lyon", country: "France", coordinates: [4.8357, 45.764], accent: "#b84b38" },
  { slug: "toulouse", name: "Toulouse", country: "France", coordinates: [1.4442, 43.6047], accent: "#b84b38" },
  { slug: "bordeaux", name: "Bordeaux", country: "France", coordinates: [-0.5792, 44.8378], accent: "#b84b38" },
  { slug: "marseille", name: "Marseille", country: "France", coordinates: [5.3698, 43.2965], accent: "#b84b38" },
  { slug: "nice", name: "Nice", country: "France", coordinates: [7.262, 43.7102], accent: "#b84b38" },
  { slug: "saint-cirq-lapopie", name: "Saint-Cirq-Lapopie", country: "France", coordinates: [1.6717, 44.4675], accent: "#b84b38" },
  { slug: "aix-en-provence", name: "Aix-en-Provence", country: "France", coordinates: [5.4474, 43.85], accent: "#b84b38" },
  { slug: "saint-tropez", name: "Saint-Tropez", country: "France", coordinates: [6.6407, 43.2727], accent: "#b84b38" },
  { slug: "genoa", name: "Genoa", country: "Italy", coordinates: [8.9463, 44.4056], accent: "#b84b38" },
  { slug: "portofino", name: "Portofino", country: "Italy", coordinates: [9.2098, 44.3036], accent: "#b84b38" },
  { slug: "cinque-terre", name: "Cinque Terre", country: "Italy", coordinates: [9.7089, 44.1461], accent: "#b84b38" },
  { slug: "florence", name: "Florence", country: "Italy", coordinates: [11.2558, 43.7696], accent: "#b84b38" },
  { slug: "rome", name: "Rome", country: "Italy", coordinates: [12.4964, 41.9028], accent: "#b84b38" },
  { slug: "milan", name: "Milan", country: "Italy", coordinates: [9.19, 45.4642], accent: "#b84b38" },
  { slug: "venice", name: "Venice", country: "Italy", coordinates: [12.3155, 45.4408], accent: "#b84b38" },
  { slug: "lake-como", name: "Lake Como", country: "Italy", coordinates: [9.2572, 45.9852], accent: "#b84b38" },
  { slug: "taormina", name: "Taormina", country: "Italy", coordinates: [15.287, 37.8526], accent: "#b84b38" },
  { slug: "cefalu", name: "Cefalù", country: "Italy", coordinates: [14.0228, 38.0397], accent: "#b84b38" },
  { slug: "palermo", name: "Palermo", country: "Italy", coordinates: [13.3615, 38.1157], accent: "#b84b38" },
  { slug: "scopello", name: "Scopello", country: "Italy", coordinates: [12.8129, 38.0722], accent: "#b84b38" },
  { slug: "lucerne", name: "Lucerne", country: "Switzerland", coordinates: [8.3093, 47.0502], accent: "#b84b38" },
  { slug: "black-forest", name: "Black Forest", country: "Germany", coordinates: [8.24, 48.1], accent: "#b84b38" },
  { slug: "heidelberg", name: "Heidelberg", country: "Germany", coordinates: [8.6724, 49.3988], accent: "#b84b38" },
  { slug: "frankfurt", name: "Frankfurt", country: "Germany", coordinates: [8.6821, 50.1109], accent: "#b84b38" },
  { slug: "cologne", name: "Cologne", country: "Germany", coordinates: [6.9603, 50.9375], accent: "#b84b38" },
  { slug: "hamburg", name: "Hamburg", country: "Germany", coordinates: [9.9937, 53.5511], accent: "#b84b38" },
  { slug: "berlin", name: "Berlin", country: "Germany", coordinates: [13.405, 52.52], accent: "#b84b38" },
  { slug: "munich", name: "Munich", country: "Germany", coordinates: [11.582, 48.1351], accent: "#b84b38" },
  { slug: "copenhagen", name: "Copenhagen", country: "Denmark", coordinates: [12.5683, 55.6761], accent: "#b84b38" },
  { slug: "malmo", name: "Malmö", country: "Sweden", coordinates: [13.0038, 55.605], accent: "#b84b38" },
  { slug: "prague", name: "Prague", country: "Czechia", coordinates: [14.4378, 50.0755], accent: "#b84b38" },
  { slug: "kitzbuhel", name: "Kitzbühel", country: "Austria", coordinates: [12.3924, 47.4467], accent: "#b84b38" },
  { slug: "lake-bled", name: "Lake Bled", country: "Slovenia", coordinates: [14.0937, 46.3625], accent: "#b84b38" },
  { slug: "ljubljana", name: "Ljubljana", country: "Slovenia", coordinates: [14.5058, 46.0569], accent: "#b84b38" },
  { slug: "zagreb", name: "Zagreb", country: "Croatia", coordinates: [15.9819, 45.815], accent: "#b84b38" },
  { slug: "budapest", name: "Budapest", country: "Hungary", coordinates: [19.0402, 47.4979], accent: "#b84b38" },
  { slug: "bratislava", name: "Bratislava", country: "Slovakia", coordinates: [17.1077, 48.1486], accent: "#b84b38" },
  { slug: "vienna", name: "Vienna", country: "Austria", coordinates: [16.3738, 48.2082], accent: "#b84b38" },
  { slug: "athens", name: "Athens", country: "Greece", coordinates: [23.7275, 37.9838], accent: "#b84b38" },
  { slug: "tokyo", name: "Tokyo", country: "Japan", coordinates: [139.6917, 35.6895], accent: "#b84b38" },
  { slug: "osaka", name: "Osaka", country: "Japan", coordinates: [135.5023, 34.6937], accent: "#b84b38" },
  { slug: "kanazawa", name: "Kanazawa", country: "Japan", coordinates: [136.6256, 36.5613], accent: "#b84b38" },
  { slug: "mt-fuji", name: "Mt. Fuji", country: "Japan", coordinates: [138.7274, 35.3606], accent: "#b84b38" },
  { slug: "kyoto", name: "Kyoto", country: "Japan", coordinates: [135.7681, 35.0116], accent: "#b84b38" },
  { slug: "nara", name: "Nara", country: "Japan", coordinates: [135.8048, 34.6851], accent: "#b84b38" },
  { slug: "hiroshima", name: "Hiroshima", country: "Japan", coordinates: [132.4553, 34.3853], accent: "#b84b38" },
  { slug: "seoul", name: "Seoul", country: "South Korea", coordinates: [126.978, 37.5665], accent: "#b84b38" },
  { slug: "cancun", name: "Cancún", country: "Mexico", coordinates: [-86.8515, 21.1619], accent: "#b84b38" },
  { slug: "mexico-city", name: "Mexico City", country: "Mexico", coordinates: [-99.1332, 19.4326], accent: "#b84b38" },
  { slug: "san-francisco", name: "San Francisco", country: "United States", coordinates: [-122.4194, 37.7749], accent: "#b84b38" },
  { slug: "yosemite", name: "Yosemite", country: "United States", coordinates: [-119.5383, 37.8651], accent: "#b84b38" },
  { slug: "chicago", name: "Chicago", country: "United States", coordinates: [-87.6298, 41.8781], accent: "#b84b38" },
  { slug: "new-york", name: "New York", country: "United States", coordinates: [-74.006, 40.7128], accent: "#b84b38" },
  { slug: "iceland", name: "Iceland", country: "Iceland", coordinates: [-21.8174, 64.1265], accent: "#b84b38" },
  { slug: "amsterdam", name: "Amsterdam", country: "Netherlands", coordinates: [4.9041, 52.3676], accent: "#b84b38" },
  // Temporarily removed until photos are found:
  // { slug: "newcastle", name: "Newcastle", country: "England", coordinates: [-1.6178, 54.9783], accent: "#b84b38" },
  // { slug: "dartmouth", name: "Dartmouth", country: "England", coordinates: [-3.5809, 50.351], accent: "#b84b38" },
];

const rawPlaces: Place[] = placeMeta.map((meta) => ({
  ...meta,
  photos: GENERATED_PHOTOS[meta.slug] ?? [],
}));

// Countries in the order their sections appear down the page. The first block
// is the requested order; the rest follow in any order.
const COUNTRY_ORDER = [
  "England", "Japan", "South Korea", "Netherlands", "France", "Italy",
  "United States", "Mexico", "Germany", "Iceland", "Denmark", "Sweden",
  "Austria", "Greece",
  // others, any order:
  "Switzerland", "Czechia", "Slovenia", "Croatia", "Hungary", "Slovakia",
];

// City order within each country. England is deliberately NOT by size (keeps
// sheffield → london → newcastle → dartmouth); every other country is largest
// city first. Any slug not listed sorts to the end of its country.
const CITY_ORDER: Record<string, string[]> = {
  England: ["sheffield", "london", "newcastle", "dartmouth"],
  Japan: ["tokyo", "osaka", "kyoto", "hiroshima", "kanazawa", "nara", "mt-fuji"],
  France: ["paris", "marseille", "lyon", "toulouse", "nice", "strasbourg", "bordeaux", "reims", "aix-en-provence", "saint-tropez", "saint-cirq-lapopie"],
  Italy: ["rome", "milan", "palermo", "genoa", "florence", "venice", "lake-como", "cefalu", "taormina", "cinque-terre", "scopello", "portofino"],
  "United States": ["new-york", "chicago", "san-francisco", "yosemite"],
  Mexico: ["mexico-city", "cancun"],
  Germany: ["berlin", "hamburg", "munich", "cologne", "frankfurt", "heidelberg", "black-forest"],
  Austria: ["vienna", "kitzbuhel"],
  Slovenia: ["ljubljana", "lake-bled"],
};

const countryRank = (place: Place) => {
  const index = COUNTRY_ORDER.indexOf(place.country);
  return index === -1 ? COUNTRY_ORDER.length : index;
};

const cityRank = (place: Place) => {
  const order = CITY_ORDER[place.country];
  if (!order) return 0;
  const index = order.indexOf(place.slug);
  return index === -1 ? order.length : index;
};

// Group by country (requested order), then by city size within each country.
export const places: Place[] = [...rawPlaces].sort((a, b) => {
  const byCountry = countryRank(a) - countryRank(b);
  if (byCountry !== 0) return byCountry;
  return cityRank(a) - cityRank(b);
});

export function getPlace(slug: string) {
  return places.find((place) => place.slug === slug);
}
