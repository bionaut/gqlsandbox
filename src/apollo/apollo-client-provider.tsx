import React, { FC } from 'react'
import { ApolloProvider } from '@apollo/client'
import { client } from './client'

export const StudioClientProvider: FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
