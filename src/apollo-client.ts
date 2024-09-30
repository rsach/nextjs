// apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client setup to connect to the Rick and Morty GraphQL API
const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql', 
  cache: new InMemoryCache(),
});

export default client;
