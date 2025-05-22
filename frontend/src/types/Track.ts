export type TrackMetaCreate = {
    title?: string;
    artist?: string;
    album?: string;
    genres: string[];
    coverImage?: string;
}

export type TrackMeta = {
    title: string;
    artist: string;
    album: string;
    genres: string[];
    coverImage?: string;
}


export interface Track extends TrackMeta {
    id: string;
    slug: string;
    audioFile: string;
    createdAt: Date;
    updatedAt: Date;
}
