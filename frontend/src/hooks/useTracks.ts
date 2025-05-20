import {useEffect, useState} from "react";
import {Track} from "../types/Track.ts";
import {Filters} from "../types/Filters.ts";
import {fetchTracks} from "../api/apiTracks.ts";


const useTracks = (page: number, filters: Filters) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await fetchTracks(page, filters);
        setTracks(data.data.map((track: Track) => track));
        setTotalPages(data.meta.totalPages);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, [page, filters])

    return {tracks, totalPages, isLoading, refetch: fetchData};
}

export default useTracks;