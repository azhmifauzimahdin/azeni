"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  id: string;
  src: string;
}

export default function MusicPlayer({ id, src }: MusicPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const togglePlay = useCallback(() => {
    const ws = wavesurfer.current;
    if (!ws || !isReady) return;

    if (ws.isPlaying()) {
      ws.pause();
      setIsPlaying(false);
    } else {
      window.dispatchEvent(new CustomEvent("music-played", { detail: { id } }));

      ws.play();
      setIsPlaying(true);
    }
  }, [isReady, id]);

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: waveformRef.current!,
      waveColor: "#CBD5E1",
      progressColor: "#0F766E",
      cursorColor: "#0F766E",
      barWidth: 2,
      height: 40,
      normalize: true,
    });

    wavesurfer.current = ws;

    let isUnmounted = false;
    const controller = new AbortController();

    fetch(src, { signal: controller.signal })
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (!isUnmounted) ws.loadBlob(new Blob([buffer]));
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Audio load error:", err);
      });

    ws.on("ready", () => {
      if (!isUnmounted) {
        setIsReady(true);
        setIsPlaying(false);
      }
    });

    ws.on("finish", () => {
      if (!isUnmounted) setIsPlaying(false);
    });

    const handleGlobalPlay = (e: Event) => {
      const event = e as CustomEvent<{ id: string }>;
      if (event.detail.id !== id && wavesurfer.current?.isPlaying()) {
        wavesurfer.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("music-played", handleGlobalPlay);

    return () => {
      isUnmounted = true;
      controller.abort();
      try {
        ws.destroy();
      } catch (err) {
        console.error("Destroy error:", err);
      }
      wavesurfer.current = null;
      window.removeEventListener("music-played", handleGlobalPlay);
    };
  }, [src, id]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={togglePlay}
        disabled={!isReady}
        className="w-9 h-9 hover:text-green-app-primary"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <div ref={waveformRef} className="flex-1 min-w-0" />
    </div>
  );
}
