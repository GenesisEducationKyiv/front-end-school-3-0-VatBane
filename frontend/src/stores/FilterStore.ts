import { create } from "zustand/react";
import { Filters } from "../types/Filters.ts";

interface FilterStore {
    filters: Filters;
    setSearchValue: (searchValue: string) => void;
    setArtist: (artist: string) => void;
    setGenre: (genre: string) => void;
    setSortBy: (sortBy: "title" | "artist" | "album" | "createdAt") => void;
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    setLimit: (limit: number) => void;

    setFilters: (filters: Filters) => void;
    resetFilters: () => void;
}

const defaultFilters: Filters = {
    searchValue: "",
    artist: "",
    genre: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 10,
};

const useFilterStore = create<FilterStore>((set) => ({
    filters: { ...defaultFilters },

    setSearchValue: (searchValue: string) =>
        set((state) => ({
            filters: { ...state.filters, searchValue },
        })),
    setSortBy: (sortBy: "title" | "artist" | "album" | "createdAt") =>
        set((state) => ({
            filters: { ...state.filters, sortBy },
        })),
    setSortOrder: (sortOrder: "desc" | "asc") =>
        set((state) => ({
            filters: { ...state.filters, sortOrder },
        })),
    setArtist: (artist: string) =>
        set((state) => ({
            filters: { ...state.filters, artist },
        })),
    setGenre: (genre: string) =>
        set((state) => ({
            filters: { ...state.filters, genre },
        })),
    setLimit: (limit: number) =>
        set((state) => ({
            filters: { ...state.filters, limit },
        })),

    setFilters: (filters: Filters) =>
        set((state) => ({
            filters: filters,
        })),

    resetFilters: () => set({ filters: { ...defaultFilters } }),
}));

export default useFilterStore;
