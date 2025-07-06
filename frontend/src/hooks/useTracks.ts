import { ApolloError, useSubscription } from "@apollo/client";
import { getTracks } from "../graphql/queries";
import { Track } from "../types/Track.ts";
import { Filters } from "../types/Filters.ts";
import { ListMeta } from "../utils/commonTypes";

interface UseTracksReturn {
    tracks: Track[];
    listMeta: ListMeta;
    isLoading: boolean;
    error: ApolloError | undefined;
}

interface UseTracksParams {
    page: number;
    filters: Filters;
}

const useTracks = ({ page, filters }: UseTracksParams): UseTracksReturn => {
    const { data, loading, error } = useSubscription(getTracks, {
        variables: {
            filter: {
                page,
                limit: filters.limit,
                sort: filters.sortBy || 'title',
                order: filters.sortOrder || 'asc',
                search: filters.searchValue || undefined,
                artist: filters.artist || undefined,
                genre: filters.genre || undefined,
            }
        },
        errorPolicy: 'all',
        shouldResubscribe: true,
        onData: (options) => {
            console.log('New tracks data received:', options.data.data);
        },
        onComplete: () => {
            console.log('Tracks subscription completed');
        },
    });

    return {
        tracks: data?.tracks?.data || [],
        listMeta: data?.tracks?.meta || { page: 0, totalPages: 0, limit: filters.limit, total: 0},
        isLoading: loading,
        error,
    };
};

export default useTracks;