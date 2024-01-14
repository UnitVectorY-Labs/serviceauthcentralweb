import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// HTTP connection to the API
const httpLink = createHttpLink({
  // TODO: Change to real URL, leaving this now for development
  uri: 'http://localhost:8081/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const client = new ApolloClient({
  link: httpLink,
  cache,
})


export default client;