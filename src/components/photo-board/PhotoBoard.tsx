"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/content/places";
import styles from "./PhotoBoard.module.css";

export function PhotoBoard({ photos, placeName }: { photos: Photo[]; placeName: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((activeIndex + 1) % photos.length);
      if (event.key === "ArrowLeft") setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, photos.length]);

  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      {/* A clean, minimalist gallery: tidy masonry columns, upright, evenly
          spaced. Natural orientation (portrait/landscape) preserved; scales to
          any number of photos. */}
      <section className={styles.wall} aria-label={`Photographs from ${placeName}`}>
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.id}
            className={styles.photo}
            onClick={() => setActiveIndex(index)}
            aria-label={`View photograph from ${placeName}`}
          >
            {/* Natural-size image so portrait/landscape are preserved (no crop);
                next/image's fill can't do intrinsic aspect without known dims.
                width/height carry the real ratio (height ÷ width) so the browser
                reserves the correct box up front — no layout shift as photos load.
                The first few are eager + high-priority (they're above the fold). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={placeName}
              width={1000}
              height={Math.round(1000 * photo.ratio)}
              loading={index < 3 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              decoding="async"
            />
          </button>
        ))}
      </section>

      {activePhoto && activeIndex !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`Photograph from ${placeName}`}>
          <button className={styles.backdrop} onClick={() => setActiveIndex(null)} aria-label="Close photo" />
          <figure className={styles.viewer}>
            <button className={styles.close} type="button" onClick={() => setActiveIndex(null)} aria-label="Close photo">×</button>
            <div className={styles.fullImage}>
              <Image src={activePhoto.src} alt={placeName} fill sizes="95vw" priority />
            </div>
            <figcaption>
              <span>{activeIndex + 1} / {photos.length}</span>
            </figcaption>
            <button
              className={`${styles.arrow} ${styles.previous}`}
              type="button"
              onClick={() => setActiveIndex((activeIndex - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
            >←</button>
            <button
              className={`${styles.arrow} ${styles.next}`}
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
              aria-label="Next photo"
            >→</button>
          </figure>
        </div>
      )}
    </>
  );
}
