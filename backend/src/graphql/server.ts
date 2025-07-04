import { ApolloServer } from "@apollo/server";
import { tracksResolvers } from "./resolvers/tracks.ts";
import { tracksSchema } from "./schemas/tracks.ts";

export const graphQLServer = new ApolloServer({
    typeDefs: tracksSchema,
    resolvers: tracksResolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
