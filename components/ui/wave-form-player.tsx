"use client";

import { Music as MusicIcon, Pause, Play } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "./button";
import { Music } from "@/types";
import Link from "next/link";

type Props = {
  data: Music;
  selectSong?: boolean;
  onSelectSong?: (id: string) => void;
  loading?: boolean;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function WaveformPlayer({
  data,
  selectSong,
  onSelectSong,
  loading,
}: Props) {
  const { id, name, src, origin } = data;
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(true);

  const emitPlayEvent = useCallback(() => {
    window.dispatchEvent(new CustomEvent("waveform-play", { detail: { id } }));
  }, [id]);

  const onExternalPlay = useCallback(
    (e: CustomEvent) => {
      const playingId = e.detail.id;
      if (
        playingId !== id &&
        wavesurfer.current &&
        wavesurfer.current.isPlaying()
      ) {
        wavesurfer.current.pause();
        setIsPlaying(false);
      }
    },
    [id]
  );

  const togglePlay = useCallback(() => {
    const current = wavesurfer.current;
    if (!current) return;

    if (current.isPlaying()) {
      current.pause();
      setIsPlaying(false);
    } else {
      current.play();
      setIsPlaying(true);
      emitPlayEvent();
    }
  }, [emitPlayEvent]);

  useEffect(() => {
    if (!waveformRef.current) return;

    if (wavesurfer.current) {
      wavesurfer.current.destroy();
      wavesurfer.current = null;
    }

    waveformRef.current.innerHTML = "";

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#E5E7EB",
      progressColor: "#008080",
      cursorColor: "#006666",
      barWidth: 2,
      height: 30,
      normalize: true,
    });

    wavesurfer.current = ws;

    let isReady = false;
    let isUnmounted = false;

    ws.load(src);

    ws.on("ready", () => {
      isReady = true;
      if (!isUnmounted) {
        setIsPlaying(false);
        setDuration(ws.getDuration());
        setIsLoadingWaveform(false);
        try {
          ws.zoom(0);
        } catch (err) {
          console.warn("Zoom failed:", err);
        }
      }
    });

    ws.on("finish", () => {
      if (!isUnmounted) setIsPlaying(false);
    });

    ws.on("audioprocess", () => {
      if (isReady && wavesurfer.current) {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      }
    });

    const container = waveformRef.current;
    const onClick = (e: MouseEvent) => {
      const current = wavesurfer.current;
      if (!current || !isReady || !container) return;

      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const relativePos = clickX / rect.width;

      const duration = current.getDuration();
      if (!duration) return;

      current.seekTo(relativePos);

      if (!current.isPlaying()) {
        current.play();
        setIsPlaying(true);
        emitPlayEvent();
      }
    };

    container.addEventListener("click", onClick);

    const observer = new ResizeObserver(() => {
      const current = wavesurfer.current;
      if (current && isReady && current.getDuration() > 0) {
        try {
          current.zoom(0);
        } catch (err) {
          console.warn("Zoom error on resize:", err);
        }
      }
    });

    observer.observe(container);

    window.addEventListener("waveform-play", onExternalPlay as EventListener);

    return () => {
      isUnmounted = true;
      observer.disconnect();
      container.removeEventListener("click", onClick);
      window.removeEventListener(
        "waveform-play",
        onExternalPlay as EventListener
      );
      if (isReady && ws) {
        try {
          ws.destroy();
        } catch (err) {
          console.warn("WaveSurfer destroy error:", err);
        }
      }
      wavesurfer.current = null;
    };
  }, [src, emitPlayEvent, onExternalPlay]);

  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const containerWidth = titleContainerRef.current?.offsetWidth ?? 0;
    const textWidth = titleTextRef.current?.scrollWidth ?? 0;

    setIsOverflow(textWidth > containerWidth);
  }, [name]);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="p-2 rounded text-green-app-primary bg-slate-200 hover:bg-slate-300 transition"
        >
          {isPlaying ? (
            <Pause className="text-slate-500" strokeWidth={2} />
          ) : (
            <Play strokeWidth={2} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div
            ref={titleContainerRef}
            className="overflow-hidden whitespace-nowrap"
          >
            <div
              ref={titleTextRef}
              className={`inline-block font-medium text-base ${
                isOverflow ? "marquee" : ""
              }`}
              style={{ paddingLeft: isOverflow ? "1rem" : undefined }}
            >
              {name}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="text-xs text-gray-400 italic">
              <Link
                href={origin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 mt-1 transition"
              >
                <MusicIcon size={12} className="rotate-12" />
                YouTube
              </Link>
            </div>
          </div>
        </div>
        {onSelectSong && selectSong ? (
          <Button
            variant="primary"
            onClick={() => onSelectSong(data.id)}
            size="sm"
            isLoading={loading}
          >
            Pilih
          </Button>
        ) : null}
      </div>

      <div className="w-full h-[40px] mt-2 cursor-pointer relative">
        <div
          ref={waveformRef}
          className="w-full h-full"
          style={{ opacity: isLoadingWaveform ? 0 : 1 }}
        />
        {isLoadingWaveform && (
          <div className="absolute inset-0 rounded bg-skeleton animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
}
