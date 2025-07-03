export type Filters = {
    searchValue: string;
    artist: string;
    genre: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    limit: number;
};
