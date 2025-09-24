import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Layout from "@/src/components/Layout";

export default function ResourceSingle({ resource }: { resource: any }) {
  if (!resource) return <p>Resource not found</p>;

  return (
    <>
      <Head>
        <title>{resource.title} – Resources</title>
      </Head>

      <Layout>
        <div className="pb-6 pt-4 max-w-3xl mx-auto">
          <h1 className="text-3xl font-black leading-9 text-black tracking-tighter">
            {resource.title}
          </h1>

          {resource.featuredImage?.node?.sourceUrl && (
            <img
              src={resource.featuredImage.node.sourceUrl}
              alt={resource.title}
              className="w-full rounded-lg mt-4"
            />
          )}

          <div
            className="mt-6 text-gray-700 prose"
            dangerouslySetInnerHTML={{ __html: resource.content }}
          />
        </div>
      </Layout>
    </>
  );
}

const client = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      "https://pactlatrobedev.wpenginepowered.com/graphql",
  }),
  cache: new InMemoryCache(),
});

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query({
    query: gql`
      {
        resources(first: 50, where: { status: PUBLISH }) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  const paths =
    data?.resources?.nodes.map((res: any) => ({
      params: { slug: res.slug },
    })) || [];

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await client.query({
    query: gql`
      query GetResource($slug: ID!) {
        resource(id: $slug, idType: SLUG) {
          id
          title
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    `,
    variables: { slug: params?.slug },
  });

  return {
    props: {
      resource: data?.resource || null,
    },
    revalidate: 60,
  };
};
