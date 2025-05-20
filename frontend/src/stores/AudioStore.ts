import {create} from "zustand/react";
import {Track} from "../types/Track.ts";

interface AudioStore {
    track: Track | null;
    audioTrack: string | null;

    setAudioTrack: (track: Track, audioTrack: string) => void;
}

const useAudioStore = create<AudioStore>((set) => ({
    track: null,
    audioTrack: null,

    setAudioTrack: (track: Track, audioTrack: string) => set(() => ({
        track, audioTrack,
    }))
}));

export default useAudioStore;