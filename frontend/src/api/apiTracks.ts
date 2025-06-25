import {
    TrackResponseSchema,
    TrackResponse,
    Track,
    TrackSchema,
} from "../schemas/track.ts";

import { Filters } from "../types/Filters.ts";
import { TrackMeta } from "../types/Track.ts";
import { Result, ok, err } from "neverthrow";
import { API_BASE_URL } from "./constant.ts";

export const fetchTracks = async (
    page: number,
    filters: Filters,
) => {
    const { searchValue, artist, genre, sortBy, sortOrder, limit } = filters;

    const params = new URLSearchParams({
        ...(limit && { limit: limit.toString() }),
        ...(page && { page: page.toString() }),
        ...(searchValue && { search: searchValue }),
        ...(artist && { artist: artist.toString() }),
        ...(genre && { genre: genre.toString() }),
        ...(sortBy && { sort: sortBy.toString() }),
        ...(sortOrder && { order: sortOrder.toString() }),
    });

    const response = await fetch(`${API_BASE_URL}/tracks?` + params.toString());
    if (!response.ok) {
        return err("Failed to load tracks!");
    }
    try {
        const data = TrackResponseSchema.parse(await response.json());
        return ok(data);
    } catch (error) {
        console.log(error);
        return err("Failed to load tracks!");
    }
};

export const bulkDeleteTracks = async (ids: string[]) => {
    const response = await fetch(`${API_BASE_URL}/tracks/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });

    return response.ok ? ok() : err("Failed to delete tracks!")
};

export const saveTrack = async (
    track: TrackMeta,
) => {
    const response = await fetch(`${API_BASE_URL}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...track }),
    });
    return response.ok ? ok(TrackSchema.parse(await response.json())) : err("Failed to save track!");
};

export const updateTrack = async (
    trackId: string,
    track: TrackMeta,
) => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...track }),
    });

    return response.ok ? ok(TrackSchema.parse(await response.json())) : err("Failed to update track!");
};

export const deleteTrack = async (trackId: string) => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
        method: "DELETE",
    });

    return response.ok ? ok() : err("Failed to delete track!");
};
