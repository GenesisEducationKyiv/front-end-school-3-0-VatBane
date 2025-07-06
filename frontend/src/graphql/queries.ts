import { gql } from "@apollo/client";

export const getTracks = gql`
    subscription GetTracks($filter: QueryFilter) {
        tracks(filter: $filter) {
            data {
                id
                title
                artist
                album
                genres
                coverImage
                audioFile
                createdAt
                updatedAt
            }
            meta {
                total
                page
                limit
                totalPages
            }
        }
    }
`;