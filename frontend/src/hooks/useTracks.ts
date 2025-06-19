import { useEffect, useState } from "react";
import { Filters } from "../types/Filters.ts";
import { fetchTracks } from "../api/apiTracks.ts";
import { Track } from "../schemas/track.ts";

const useTracks = (page: number, filters: Filters) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setIsLoading(true);

        const data = await fetchTracks(page, filters);
        if (data.isOk()) {
            setTracks(data.value.data.map((track) => track));
            setTotalPages(data.value.meta.totalPages);
        } else {
            setTracks([]);
            alert(data.error.message);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, filters]);

    return { tracks, totalPages, isLoading, refetch: fetchData };
};

export default useTracks;
