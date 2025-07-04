import type { PaginatedResponse, QueryParams, Track } from "../types/index.ts";
import { getTracks } from "../utils/db.ts";

export const get_list_tracks = async (query: QueryFilter) => {
    const { tracks, total } = await getTracks(query);

    const page = query.page || 1;
    const limit = query.limit || 10;

    const response: PaginatedResponse<Track> = {
        data: tracks,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };

    return response;
}