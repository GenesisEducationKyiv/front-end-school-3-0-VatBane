import { useSubscription } from "@apollo/client";
import { getTracks } from "../graphql/queries";
import { Track } from "../types/Track.ts";
import { Filters } from "../types/Filters.ts";

interface UseTracksReturn {
    tracks: Track[];
    totalPages: number;
    total: number;
    currentPage: number;
    limit: number;
    isLoading: boolean;
    error: any;
    // Note: refetch is not available with subscriptions
    // Consider using a separate query/mutation for manual refetching if needed
}

interface UseTracksParams {
    page: number;
    limit?: number;
    filters: Filters;
}

const useTracks = ({ page, limit = 10, filters }: UseTracksParams): UseTracksReturn => {
    const { data, loading, error } = useSubscription(getTracks, {
        variables: {
            filter: {
                page,
                limit,
                sort: filters.sortBy || 'title',
                order: filters.sortOrder || 'asc',
                search: filters.searchValue || undefined,
                artist: filters.artist || undefined,
                genre: filters.genre || undefined,
            }
        },
        errorPolicy: 'all',
        // Subscription-specific options
        shouldResubscribe: true, // Resubscribe when variables change
        onData: (options) => {
            // Optional: Handle new data as it arrives
            console.log('New tracks data received:', options.data.data);
        },
        onComplete: () => {
            // Optional: Handle when subscription completes
            console.log('Tracks subscription completed');
        },
    });

    return {
        tracks: data?.tracks?.data || [],
        totalPages: data?.tracks?.meta?.totalPages || 0,
        total: data?.tracks?.meta?.total || 0,
        currentPage: data?.tracks?.meta?.page || page,
        limit: data?.tracks?.meta?.limit || limit,
        isLoading: loading,
        error,
    };
};

export default useTracks;