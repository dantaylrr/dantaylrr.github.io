"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./PhotoDeck.module.css";

type DeckPhoto = { src: string; alt: string };

// A stack of photos that auto-flicks through like a deck of cards: every
// `interval` ms the top card is dealt to the back and the next comes forward.
// Pauses on hover; under prefers-reduced-motion it becomes a gentle crossfade.
export function PhotoDeck({ photos, interval = 5000 }: { photos: DeckPhoto[]; interval?: number }) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const count = photos.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [count, interval]);

  return (
    <div
      className={styles.deck}
      aria-label="A rotating stack of photographs of Daniel"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {photos.map((photo, i) => {
        const rel = (i - active + count) % count; // 0 = top of the deck
        const isTop = rel === 0;
        return (
          <figure
            key={photo.src}
            className={styles.card}
            data-top={isTop}
            style={{ "--rel": rel, zIndex: count - rel } as CSSProperties}
          >
            <Image
              src={photo.src}
              alt={isTop ? photo.alt : ""}
              fill
              sizes="(max-width: 820px) 70vw, 30vw"
              priority={i < 2}
            />
          </figure>
        );
      })}
    </div>
  );
}
