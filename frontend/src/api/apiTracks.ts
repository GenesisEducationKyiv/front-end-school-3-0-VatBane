import {TrackResponseSchema, TrackResponse, Track, TrackSchema} from "../schemas/track.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { Filters } from "../types/Filters.ts";
import { TrackMeta } from "../types/Track.ts";
import { Result, ok, err} from "neverthrow"


export const fetchTracks = async (page: number, filters: Filters): Promise<Result<TrackResponse, Error>> => {

    // define params;
    const {searchValue, artist, genre, sortBy, sortOrder, limit} = filters;

    const params = new URLSearchParams({
        ...(limit && {limit: limit.toString()}),
        ...(page && {page: page.toString()}),
        ...(searchValue && {search: searchValue}),
        ...(artist && {artist: artist.toString()}),
        ...(genre && {genre: genre.toString()}),
        ...(sortBy && {sort: sortBy.toString()}),
        ...(sortOrder && {order: sortOrder.toString()}),
    });

    // process request
    const response = await fetch(`${API_BASE_URL}/tracks?` + params.toString())
    if (!response.ok) {
        return err(new Error(`Failed to load tracks`));
    }
    try {
        const data = TrackResponseSchema.parse(await response.json());
        return ok(data);
    } catch (error) {
        console.log(error);
        return err(new Error(`Failed to load tracks`));
    }
}

export const bulkDeleteTracks = async (ids: string[]) => {
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

export const saveTrack = async (track: TrackMeta): Promise<Result<Track, Error>> => {
    const response = await fetch(`${API_BASE_URL}/tracks`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...track})
    })
    if (response.status !== 201) {
        alert("Error occurred while saving track!");
        return err(new Error(`Failed to save track!`));
    }
    return ok(TrackSchema.parse(await response.json()));
}

export const updateTrack = async (trackId: string, track: TrackMeta): Promise<Result<Track, Error>> => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...track}),
    })
    if (response.status !== 200) {
        alert("Error occurred while saving track!");
        return err(new Error(`Failed to update track!`));
    }
    return ok(TrackSchema.parse(await response.json()));
}

export const deleteTrack = async (trackId: string) => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`, {
        method: "DELETE",
    })
    if (response.status < 200 || response.status > 299) {
        alert("Error deleting track!");
        return false;
    }

    return true;
}
