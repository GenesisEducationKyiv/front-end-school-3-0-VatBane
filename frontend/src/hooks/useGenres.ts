import { useEffect, useState } from "react";
import { fetchGenres } from "../api/apiGenres";

const useGenres = () => {
    const [genres, setGenres] = useState<string[]>();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGenres();
            if (data.isOk()) {
                setGenres(data.value);
            } else {
                alert(data.error);
                setGenres([]);
            }
        };
        fetchData();
    }, []);

    return genres;
};

export default useGenres;
