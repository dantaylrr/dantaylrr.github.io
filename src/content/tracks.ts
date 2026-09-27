// One Spotify song per location. Resolution order:
//   1. PLACE_TRACKS[slug]      — a song specific to that place
//   2. COUNTRY_TRACKS[country] — a shared default for the whole country
//   3. nothing                 — no player shown
//
// To set a song: open it in Spotify → Share → Copy Song Link, and paste the
// whole URL (or just the track id). Both forms work, e.g.
//   "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P?si=abc"
//   "7ouMYWpwJ422jRcDASZB7P"
// The ?si=… tracking suffix is stripped automatically.

// Place-specific songs (override the country default). Slugs match src/content/places.ts.
export const PLACE_TRACKS: Record<string, string> = {
  sheffield: "4TC0dnB5DxvoKcsalffFZe",
  london: "4kd3HIkMbwO4sVgkYkrBGo",
  newcastle: "0Xuh7O6BMfWnwA3SW81jV1",
};

// Shared per-country defaults, keyed by the country name in places.ts.
export const COUNTRY_TRACKS: Record<string, string> = {
  Italy: "5Zm1kucvIUSvGig5kJnbGP",
  France: "4UP2cLNgUjPzCHKS92pp2U",
  Japan: "0bm4iwcdNw9LmeeMUo31Hq",
};

// Pull the bare track id out of a Spotify link (or pass an id straight through).
function toTrackId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/track[/:]([A-Za-z0-9]+)/);
  if (match) return match[1];
  // Already a bare id.
  return /^[A-Za-z0-9]+$/.test(trimmed) ? trimmed : null;
}

// Returns the Spotify track URI for a place, or null if none is configured.
export function getTrackUri(slug: string, country: string): string | null {
  const id = toTrackId(PLACE_TRACKS[slug] ?? "") ?? toTrackId(COUNTRY_TRACKS[country] ?? "");
  return id ? `spotify:track:${id}` : null;
}
