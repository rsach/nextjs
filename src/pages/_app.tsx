// pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client'

// Wrapping the app with ChakraProvider for Chakra UI and ApolloProvider for Apollo Client
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
