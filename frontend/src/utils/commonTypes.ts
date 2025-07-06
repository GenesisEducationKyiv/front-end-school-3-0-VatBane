export interface Point {
    x: number;
    y: number;
}

export type ListMeta = {
    page: number,
    totalPages: number,
    limit: number,
    total: number,
}