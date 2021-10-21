import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from '@apollo/client/core'

import { print, GraphQLError } from 'graphql'
import { createClient, ClientOptions, Client } from 'graphql-ws'

export class WebSocketLink extends ApolloLink {
  private client: Client

  constructor(options: ClientOptions) {
    super()
    this.client = createClient(options)
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: observer.next.bind(observer),
          complete: observer.complete.bind(observer),
          error: (err) => {
            if (err instanceof Error) {
              return observer.error(err)
            }

            if (err instanceof CloseEvent) {
              return observer.error(
                // reason will be available on clean closes
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ''}`,
                ),
              )
            }

            return observer.error(
              new Error(
                (err as GraphQLError[])
                  .map(({ message }) => message)
                  .join(', '),
              ),
            )
          },
        },
      )
    })
  }
}
