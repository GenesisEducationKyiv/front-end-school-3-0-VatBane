const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchGenres = async () => {
    console.log(`${API_BASE_URL}/genres`)
    const response = await fetch(`${API_BASE_URL}/genres`);
    if (!response.ok) {
        alert("Failed to load genres.");
        console.log(await response.text());
        return
    }
    return await response.json();
}