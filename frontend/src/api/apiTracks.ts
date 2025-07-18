import { err, ok } from "neverthrow";
import { TrackResponseSchema } from "../schemas/track.ts";
import { Filters } from "../types/Filters.ts";
import { TrackMeta } from "../types/Track.ts";
import { API_BASE_URL } from "./constant.ts";
import { O, pipe, S } from "@mobily/ts-belt";

export class TracksApiClient {
    static async fetchTracks(page: number, filters: Filters) {
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

        return response.ok ? ok(TrackResponseSchema.parse(await response.json())) : err("Failed to load tracks!");
    }

    static async saveTrack(track: TrackMeta) {
        const response = await fetch(`${API_BASE_URL}/tracks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...track })
        });

        return response.ok ? ok(await response.json()) : err("Failed to save track!");
    }

    static async updateTrack(trackId: string, track: TrackMeta) {
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...track }),
        });

        return response.ok ? ok(await response.json()) : err("Failed to update track!");
    }

    static async deleteTrack(trackId: string) {
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
            method: "DELETE",
        });

        return response.ok ? ok() : err("Failed to delete track!");
    }

    static async bulkDeleteTracks(ids: string[]) {
        const response = await fetch(`${API_BASE_URL}/tracks/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
        });

        return response.ok ? ok() : err("Failed to delete tracks!");
    }
}
