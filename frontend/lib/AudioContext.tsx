"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false); // Muted by default
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/game-music.mpeg"); // Corrected file extension
    audio.loop = true;
    audio.volume = 0.5; // Set volume to 50%
    audioRef.current = audio;

    // Start playing (muted)
    audio.muted = true;
    console.log("[Audio] Attempting to play (muted)...");
    audio.play().catch((err) => {
      console.error("[Audio] Autoplay prevented:", err);
    });

    // Cleanup on unmount
    return () => {
      console.log("[Audio] Cleaning up audio");
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMute = () => {
    console.log("[Audio] Toggle mute clicked. Current state:", isMuted);
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      console.log("[Audio] New muted state:", newMutedState);

      // If unmuting, ensure audio is playing
      if (!newMutedState) {
        console.log("[Audio] Unmuting - attempting to play...");
        audioRef.current.play().catch((err) => {
          console.error("[Audio] Play error:", err);
        });
      }
    } else {
      console.error("[Audio] audioRef.current is null!");
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
