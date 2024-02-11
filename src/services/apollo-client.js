/*
 * Copyright 2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author Jared Hatfield (UnitVectorY Labs)
 */
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
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
