import { ApolloClient, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
    uri: 'http://localhost:8000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:8000/graphql',
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const graphQLClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});