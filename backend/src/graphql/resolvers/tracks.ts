import { get_list_tracks } from "../../services/tracks.ts";
import type { QueryParams } from "../../types/index.ts";

export const tracksResolvers = {
    Query: {
        async tracks(parent, args, context, info) {
            console.log(args.filter);
            const result = await get_list_tracks(args.filter)
            console.log(result);
            return result
        }
    }
}