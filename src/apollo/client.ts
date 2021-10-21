import 'cross-fetch/polyfill'

import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    ErrorPolicy,
    FetchPolicy,
    InMemoryCache,
    NormalizedCacheObject,
    Operation,
    split,
    WatchQueryFetchPolicy,
} from '@apollo/client'

import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from './sangria-ws-link'

const apolloClientOptions = {
    watchQuery: {
        fetchPolicy: 'cache-and-network' as WatchQueryFetchPolicy,
        errorPolicy: 'all' as ErrorPolicy,
    },
    query: {
        fetchPolicy: 'network-only' as FetchPolicy,
        errorPolicy: 'all' as ErrorPolicy,
    },
    mutate: {
        errorPolicy: 'all' as ErrorPolicy,
    },
}

const isSubscription = ({ query }: Operation): boolean => {
    const definition = getMainDefinition(query)
    return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
    )
}

const wsLink = new WebSocketLink({
    url: 'ws://localhost:3001/api/wsgraphql',
})

const httpLink = createHttpLink({ uri: 'http://localhost:3001/api/graphql', credentials: 'include' })
const splitLink = split(isSubscription, wsLink, httpLink)
const link = ApolloLink.from([splitLink])

export const client = new ApolloClient<NormalizedCacheObject>({
    cache: new InMemoryCache(),
    defaultOptions: apolloClientOptions,
    link,
    credentials: 'include',
})
