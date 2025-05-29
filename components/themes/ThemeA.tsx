"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import InvitationModal from "../modals/invitation-modal";

export default function ThemeA({ data }: { data: any }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <div>
      <audio ref={audioRef} src="/sounds/backsound-themeA.mp3" loop />
      <InvitationModal
        isOpen={isModalOpen}
        onClose={() => {
          handleStartAudio();
          setIsModalOpen(false);
        }}
      />
      <h1>Undangan Tema A</h1>
    </div>
  );
}
