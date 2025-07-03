import { z } from "zod/v4";

export const TrackSchema = z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional().default(""),
    genres: z.string().array(),
    coverImage: z.string().optional(),
    id: z.string(),
    slug: z.string(),
    audioFile: z.string().optional().default(""),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
});
export type Track = z.infer<typeof TrackSchema>;

export const TrackResponseSchema = z.object({
    data: z.array(TrackSchema),
    meta: z.object({
        total: z.number().nonnegative(),
        page: z.number().positive(),
        limit: z.number().positive(),
        totalPages: z.number().nonnegative(),
    }),
});
export type TrackResponse = z.infer<typeof TrackResponseSchema>;
