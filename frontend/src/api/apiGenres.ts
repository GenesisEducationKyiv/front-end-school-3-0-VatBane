import {API_BASE_URL} from "./constant.ts";

export const fetchGenres = async () => {
    const response = await fetch(`${API_BASE_URL}/genres`);

    if (!response.ok) {
        alert("Failed to load genres.");
        console.log(await response.text());
        return
    }

    return await response.json();
}