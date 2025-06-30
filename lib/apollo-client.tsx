"use client"

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import type { ReactNode } from "react"

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllEmployees: {
            merge: false,
          },
          getEmployeesByDepartment: {
            merge: false,
          },
        },
      },
    },
  }),
})

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default client
