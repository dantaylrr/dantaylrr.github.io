import { WorldMap } from "@/components/world-map/WorldMap";
import { PlaceSection } from "@/components/place-section/PlaceSection";
import { PhotoDeck } from "@/components/photo-deck/PhotoDeck";
import { SpotifyPlayer } from "@/components/spotify-player/SpotifyPlayer";
import { places } from "@/content/places";
import styles from "./page.module.css";

// Photos of Daniel, auto-flicked through in the about deck. me-5 (the cottage)
// leads on every load.
const mePhotos = [
  { src: "/images/about/me-5.jpg", alt: "Daniel" },
  { src: "/images/about/me-1.jpg", alt: "Daniel" },
  { src: "/images/about/me-3.jpg", alt: "Daniel" },
  { src: "/images/about/me-4.jpg", alt: "Daniel" },
  { src: "/images/about/me-6.jpg", alt: "Daniel" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/dantaylrr/",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/danieltaylor97/",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/dantaylrr",
    icon: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
  },
];

export default function HomePage() {
  return (
    <main>
      {/* 1 — Landing hero */}
      <section id="top" className={styles.hero}>
        {/* Mobile shows the looping Sicily video full-bleed; desktop shows the
            still Sheffield image instead (see CSS). Reduced-motion → still image. */}
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className={styles.wash} />
        <div className={styles.brand}>
          <h1>nowt interesting</h1>
          <p className={styles.definition}>
            <em>(naʊt)</em> - sometimes used to mean the same as “nothing”
          </p>
          <a className={styles.enter} href="#about">
            <span>Enter</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className={styles.place}>
          <span className={styles.placeMobile}>Sicily, Italy</span>
          <span className={styles.placeDesktop}>Sheffield, England</span>
        </p>
      </section>

      {/* 2 — About */}
      <section id="about" className={styles.about}>
        <p className={styles.oldText}>
          the concept of this personal project came about during 2020&apos;s summer
          lockdown. i have always been fascinated with the storytelling behind
          photography - whether that be of people, places, or both. this fascination
          resulted in me buying my first ever camera, an original fuji x100, to which
          people often questioned: &lsquo;what are you gna take pictures of?&rsquo; - of
          which my reply would always be: <em>nowt interesting</em>
        </p>

        <div className={styles.aboutGrid}>
          <div className={styles.deckCol}>
            <PhotoDeck photos={mePhotos} interval={3000} />
          </div>

          <div className={styles.aboutText}>
            <p className={styles.aboutMeLabel}>about me</p>
            <p className={styles.aboutMe}>
              29 year old born &amp; raised in sheffield &amp; now living in london. solution
              architect at databricks by day &amp; exploring ways to stay creative where
              possible. this website functions entirely as a place to dump my own memories from
              all over the world. enjoy, or don&apos;t :)
            </p>
            <ul className={styles.socials} aria-label="Social links">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {social.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.playlist}>
          <p className={styles.playlistLabel}>a soundtrack, of sorts</p>
          <SpotifyPlayer uri="spotify:playlist:7brB5kYalgGK7DruuS7EEZ" showToggle />
        </div>

        <a className={styles.enter} href="#map">
          <span>Explore</span>
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      {/* 3 — Map pane */}
      <section id="map" className={styles.mapSection}>
        <p className={styles.mapTitle}>where to?</p>
        <div className={styles.mapFrame}>
          <WorldMap markerTarget="section" />
        </div>
        <p className={styles.mapHint}>Drag to roam · scroll or pinch to zoom · tap a pin to jump to it</p>
        <a className={styles.enter} href={`#place-${places[0].slug}`}>
          <span>Roam</span>
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      {/* 4 — One section per location */}
      {places.map((place, index) => (
        <PlaceSection key={place.slug} place={place} index={index} />
      ))}
    </main>
  );
}
