import {useEffect, useState} from "react";
import { Track } from "../schemas/track.ts";
import {Filters} from "../types/Filters.ts";
import {TracksApiClient} from "../api/apiTracks.ts";


const useTracks = (page: number, filters: Filters) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await TracksApiClient.fetchTracks(page, filters);
        if (data.isOk()) {
            setTracks(data.value.data.map((track: Track) => track));
            setTotalPages(data.value.meta.totalPages);
        } else {
            alert(data.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, filters]);

    return {tracks, totalPages, isLoading, refetch: fetchData};
};

export default useTracks;