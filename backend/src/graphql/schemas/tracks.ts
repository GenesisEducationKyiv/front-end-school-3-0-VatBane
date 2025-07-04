export const tracksSchema = `
    enum SortField {
        title
        artist
        album
        createdAt
    }
    
    enum SortDirection {
        asc
        desc
    }

    input QueryFilter {
        page: Int
        limit: Int
        sort: SortField!
        order: SortDirection!
        search: String
        artist: String
        genre: String
    }
       
    type ListMeta {
        total: Int!
        page: Int!
        limit: Int!
        totalPages: Int!
    }
    
    type TrackList {
        data: [Track!]!
        meta: ListMeta!
    }
    
    type Track {
        id: String!
        title: String!
        artist: String!
        album: String
        genres: [String!]!
        coverImage: String
        audioFile: String
        createdAt: String!
        updatedAt: String!
    }
    
    type Query {
        tracks(filter: QueryFilter): TrackList!
    }
`;