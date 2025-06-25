import {
    TrackResponseSchema,
    TrackResponse,
    TrackSchema,
} from "../schemas/track.ts";
import {API_BASE_URL} from "./constant.ts";
import {O, pipe, S} from "@mobily/ts-belt";

import { Filters } from "../types/Filters.ts";
import { TrackMeta } from "../types/Track.ts";
import { Result, ok, err} from "neverthrow";


export const fetchTracks = async (page: number, filters: Filters): Promise<Result<TrackResponse, Error>> => {
    const params = new URLSearchParams();

    params.set("page", pipe(
        page,
        S.make
    ));
    params.set("limit", pipe(
        O.fromNullable(filters.limit),
        O.getWithDefault(Number(10)),
        S.make,
    ));
    params.set("searchValue", pipe(
        O.fromNullable(filters.searchValue),
        O.getWithDefault(String("")),
    ));
    params.set("artist", pipe(
        O.fromNullable(filters.artist),
        O.getWithDefault(String("")),
    ));
    params.set("genre", pipe(
        O.fromNullable(filters.genre),
        O.getWithDefault(String("")),
    ));
    params.set("sortBy", pipe(
        O.fromNullable(filters.sortBy),
        O.getWithDefault(String("createdAt")),
    ));
    params.set("sortOrder", pipe(
        O.fromNullable(filters.sortOrder),
        O.getWithDefault(String("desc")),
    ));

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

export const saveTrack = async (track: TrackMeta) => {
    const response = await fetch(`${API_BASE_URL}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...track }),
    });
    return response.ok ? ok(TrackSchema.parse(await response.json())) : err("Failed to save track!");
};

export const updateTrack = async (trackId: string, track: TrackMeta) => {
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
