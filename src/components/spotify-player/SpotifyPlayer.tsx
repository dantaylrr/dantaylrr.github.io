"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SpotifyPlayer.module.css";

// Embeds any Spotify URI (playlist or track). No `theme=0`, so Spotify renders
// its "vibrant" variant that tints the player to the artwork.
const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
const DEFAULT_HEIGHT = 80; // thin single-row bar

type Controller = {
  togglePlay: () => void;
  addListener: (
    event: "playback_update" | "ready",
    cb: (e: { data: { isPaused: boolean } }) => void,
  ) => void;
};

type IframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string | number; height: string | number },
    callback: (controller: Controller) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IframeApi) => void;
  }
}

// Cache the API object across mounts — Spotify only fires the ready callback
// once, so a remount (e.g. fast refresh) would otherwise never get a controller.
let cachedApi: IframeApi | null = null;

// `uri` is any Spotify URI, e.g. "spotify:playlist:…" or "spotify:track:…".
// `showToggle` renders the site-wide, top-left floating play/pause (used by the
// About section's playlist; off for the per-place track panels).
export function SpotifyPlayer({
  uri,
  height = DEFAULT_HEIGHT,
  showToggle = false,
}: {
  uri: string;
  height?: number;
  showToggle?: boolean;
}) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const create = (api: IframeApi) => {
      cachedApi = api;
      if (cancelled || !embedRef.current || controllerRef.current) return;
      api.createController(
        embedRef.current,
        { uri, width: "100%", height },
        (controller) => {
          if (cancelled) return;
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            setIsPaused(e.data.isPaused);
          });
          setReady(true);
        },
      );
    };

    if (cachedApi) {
      create(cachedApi);
    } else {
      window.onSpotifyIframeApiReady = create;
      if (!document.querySelector(`script[src="${API_SRC}"]`)) {
        const script = document.createElement("script");
        script.src = API_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [uri, height]);

  const toggle = useCallback(() => {
    controllerRef.current?.togglePlay();
  }, []);

  return (
    <>
      <div className={styles.embed}>
        <div ref={embedRef} />
      </div>

      {/* Site-wide play/pause, pinned top-left. Fixed positioning is relative to
          the viewport, so it floats over every section as you scroll. */}
      {showToggle && (
        <button
          type="button"
          className={styles.toggle}
          onClick={toggle}
          disabled={!ready}
          aria-label={isPaused ? "Play music" : "Pause music"}
          aria-pressed={!isPaused}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            {isPaused ? (
              // muted: single slash
              <line x1="16" y1="9" x2="22" y2="15" />
            ) : (
              // playing: sound waves
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 6a9 9 0 0 1 0 12" />
              </>
            )}
          </svg>
        </button>
      )}
    </>
  );
}
