import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_WORDPRESS_URL + "/index.php?graphql",
        fetch,
    }),
    cache: new InMemoryCache(),
});

export default client;
