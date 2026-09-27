import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoBoard } from "@/components/photo-board/PhotoBoard";
import { SpotifyPlayer } from "@/components/spotify-player/SpotifyPlayer";
import { getPlace, places } from "@/content/places";
import { getTrackUri } from "@/content/tracks";
import styles from "./place.module.css";

export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  return place
    ? { title: place.name, description: `${place.photos.length} photographs from ${place.name}, ${place.country}.` }
    : {};
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const trackUri = getTrackUri(place.slug, place.country);

  return (
    <main className={styles.page} style={{ "--accent": place.accent } as React.CSSProperties}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/#map">← Back to the map</Link>
          <Link href="/" className={styles.wordmark}>nowt interesting</Link>
        </nav>
        <div className={styles.intro}>
          <p>{place.country} · {place.photos.length} photographs</p>
          <h1>{place.name}</h1>
          {trackUri && (
            <div className={styles.soundtrack}>
              <SpotifyPlayer uri={trackUri} />
            </div>
          )}
        </div>
      </header>
      <PhotoBoard photos={place.photos} placeName={place.name} />
    </main>
  );
}
