import { create } from "zustand/react";
import { Track } from "../schemas/track.ts";

interface AudioStore {
    currentTrack: Track | null;
    isPlayerVisible: boolean;

    setCurrentTrack: (track: Track) => void;
    setIsPlayerVisible: (isPlayerVisible: boolean) => void;
}

const useAudioStore = create<AudioStore>((set) => ({
    currentTrack: null,
    isPlayerVisible: false,

    setCurrentTrack: (track: Track) => set((state) => ({ currentTrack: track })),
    setIsPlayerVisible: (isPlayerVisible: boolean) => set((state) => ({ isPlayerVisible: isPlayerVisible }))
}));

export default useAudioStore;