import { get_list_tracks } from "../../services/tracks.ts";

export const tracksResolvers = {
    Subscription: {
        tracks: {
            subscribe: async function* (root, args, { pubsub }) {
                try {
                    while (true) {
                        const result = await get_list_tracks(args.filter);
                        if (result === null) console.error("NULL EXIST")
                        yield { tracks: result };
                        await new Promise(res => setTimeout(res, 500));
                    }
                } catch (error) {
                    console.error('❌ Subscription error:', error);
                    throw error;
                }
            }
        }
    }
}