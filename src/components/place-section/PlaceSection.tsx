import Link from "next/link";
import type { CSSProperties } from "react";
import type { Place } from "@/content/places";
import styles from "./PlaceSection.module.css";

// Three emojis per country: flag · landmark/known-for · food (loosely — closest
// fit where an exact one doesn't exist).
const COUNTRY_EMOJI: Record<string, string> = {
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 🎡 ☕",
  France: "🇫🇷 🗼 🥐",
  Italy: "🇮🇹 🏛️ 🍝",
  Switzerland: "🇨🇭 🏔️ 🍫",
  Germany: "🇩🇪 🏰 🥨",
  Denmark: "🇩🇰 🧜‍♀️ 🥐",
  Sweden: "🇸🇪 🦌 🧆",
  Czechia: "🇨🇿 🏰 🍺",
  Austria: "🇦🇹 🎻 🍰",
  Slovenia: "🇸🇮 🏔️ 🍯",
  Croatia: "🇭🇷 🏰 🦑",
  Hungary: "🇭🇺 🏛️ 🌶️",
  Slovakia: "🇸🇰 🏰 🥟",
  Greece: "🇬🇷 🏛️ 🫒",
  Japan: "🇯🇵 🗻 🍣",
  "South Korea": "🇰🇷 🏯 🍜",
  Mexico: "🇲🇽 🏛️ 🌮",
  "United States": "🇺🇸 🗽 🍔",
  Iceland: "🇮🇸 🌋 🐟",
  Netherlands: "🇳🇱 🌷 🧀",
};

// Deterministic "randomly tossed" layout for each preview photo — large,
// overlapping and rotated (not a neat grid). Deterministic from the photo id so
// SSR and client match. Loose per-index anchors keep them spread out.
// One full-height section per location. On desktop it's a two-column tile whose
// sides alternate; the photos are a large, loose scatter. Every tile has a
// "take me back" link that scrolls up to the map.
export function PlaceSection({ place, index }: { place: Place; index: number }) {
  // Preview uses standard-shaped portrait photos only (ratio ≈ 3:4), so the
  // collection stays tidy and uniform — no oddly tall/narrow shots towering over
  // the rest. Falls back to whatever the place has if none qualify.
  const tidyPortraits = place.photos.filter(
    (photo) => photo.orientation === "portrait" && photo.ratio <= 1.5,
  );
  const preview = (tidyPortraits.length > 0 ? tidyPortraits : place.photos).slice(0, 12);
  const flip = index % 2 === 1; // alternate which side the photos sit on

  return (
    <section
      id={`place-${place.slug}`}
      className={styles.section}
      style={{ "--accent": place.accent } as CSSProperties}
      aria-label={place.name}
    >
      <div className={`${styles.tile} ${flip ? styles.flip : ""}`}>
        <div className={styles.textCol}>
          <p className={styles.country}>
            {place.country}
            {COUNTRY_EMOJI[place.country] && (
              <span className={styles.countryEmoji}>{COUNTRY_EMOJI[place.country]}</span>
            )}
          </p>
          <h2 className={styles.name}>{place.name}</h2>
          <div className={styles.links}>
            {preview.length > 0 && (
              <Link className={styles.link} href={`/places/${place.slug}`}>
                see all {place.photos.length} photograph{place.photos.length === 1 ? "" : "s"}
                <span aria-hidden="true"> →</span>
              </Link>
            )}
            <a className={styles.link} href="#map">
              take me back to the map<span aria-hidden="true"> ↑</span>
            </a>
          </div>
        </div>

        <div className={styles.photosCol}>
          {preview.length > 0 ? (
            <ul className={styles.preview}>
              {preview.map((photo) => (
                <li key={photo.id} className={styles.thumb}>
                  {/* Natural-size so portrait/landscape keep their real shape. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>photographs coming soon</p>
          )}
        </div>
      </div>
    </section>
  );
}
