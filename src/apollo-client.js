import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import store from '@/store'; // Import the Vuex store

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_SAC_MANAGE_URI,
});

const authLink = setContext((_, { headers }) => {
  // Retrieve the token from Vuex store
  const token = store.state.token; // Make sure this path matches your store's state structure

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
