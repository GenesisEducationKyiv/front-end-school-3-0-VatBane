import {Filters} from "../types/Filters.ts";
import {TrackMeta} from "../types/Track.ts";
import {API_BASE_URL} from "./constant.ts";
import {O, pipe, S} from "@mobily/ts-belt";

export class TracksApiClient {
    static async fetchTracks(page: number, filters: Filters) {
        const params = new URLSearchParams()

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

        const response = await fetch(`${API_BASE_URL}/tracks?` + params.toString())
        if (!response.ok) {
            alert("Failed to load tracks!");
            return
        }
        return await response.json();
    }

    static async saveTrack(track: TrackMeta) {
        const response = await fetch(`${API_BASE_URL}/tracks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...track})
        })
        if (response.status < 200 || response.status > 299) {
            alert("Error occurred while saving track!");
            return null;
        }

        return await response.json()
    }

    static async updateTrack(trackId: string, track: TrackMeta) {
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...track}),
        })
        if (response.status < 200 || response.status > 299) {
            alert("Error occurred while saving track!");
            return null;
        }
        return await response.json()
    }

    static async deleteTrack(trackId: string) {
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
            method: "DELETE",
        })
        if (response.status < 200 || response.status > 299) {
            alert("Error deleting track!");
            return;
        }

        return true;
    }

    static async bulkDeleteTracks(ids: string[]) {
        const response = await fetch(`${API_BASE_URL}/tracks/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ids}),
        });
        if (response.status < 200 || response.status > 299) {
            alert("Error occured while deleting tracks! Try again!");
        }
        return;
    }
}









