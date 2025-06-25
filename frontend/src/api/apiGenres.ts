import { err, ok } from "neverthrow";
import { API_BASE_URL } from "./constant.ts";


export const fetchGenres = async () => {
    const response = await fetch(`${API_BASE_URL}/genres`);

    return response.ok ? ok(await response.json()) : err("Failed to load genres!");
};
