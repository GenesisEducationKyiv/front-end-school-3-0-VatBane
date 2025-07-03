import { create } from "zustand/react";

interface ContextMenuStore {
    currentTrackId: string;
    selectedTracks: string[];

    setCurrentTrackId: (trackId: string) => void;

    addTrack: (track: string) => void;
    removeTrack: (trackId: string) => void;
    setSelectedTracks(selectedTracks: string[]): void;
}

const useContextMenuStore = create<ContextMenuStore>((set) => ({
    currentTrackId: "",
    selectedTracks: [],

    setCurrentTrackId: (trackId: string) => set((state) => ({currentTrackId: trackId})),
    addTrack: (track: string) => set((state) => ({selectedTracks: [...state.selectedTracks, track]})),
    removeTrack: (trackId: string) => set((state) => ({
        selectedTracks: [...state.selectedTracks.filter(track => track !== trackId)]
    })),
    setSelectedTracks: (selectedTracks: string[]) => set((state) => ({ selectedTracks: selectedTracks }))
}));

export default useContextMenuStore;