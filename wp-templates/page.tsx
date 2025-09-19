import { gql, useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";
import { GetStaticPropsContext } from "next"; // Import GetStaticPropsContext
import Layout from "../src/components/Layout";
import EntryHeader from "../components/EntryHeader";

const PAGE_QUERY = gql`
  query GetPage($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
    }
  }
`;

interface SinglePageProps {
  __SEED_NODE__?: {
    databaseId?: string;
    asPreview?: boolean;
  };
  loading?: boolean;
}

export default function SinglePage(props: SinglePageProps) {
  if (props.loading) {
    return <>Loading...</>;
  }

  const databaseId = props.__SEED_NODE__?.databaseId;
  const asPreview = props.__SEED_NODE__?.asPreview;

  const {
    data,
    loading = true,
    error,
  } = useQuery(PAGE_QUERY, {
    variables: {
      databaseId: databaseId,
      asPreview: asPreview,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  if (loading && !data)
    return (
      <div className="max-w-6xl mx-auto px-4 flex justify-center py-20">Loading...</div>
    );

  if (error) return <p>Error! {error.message}</p>;

  if (!data?.page) {
    return <p>No pages have been published</p>;
  }

  const { title, content } = data?.page || {};

  return (
    <Layout title={title}>
      <main className="max-w-6xl mx-auto px-4">
        <EntryHeader title={title} />
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </Layout>
  );
}


SinglePage.queries = [
  {
    query: PAGE_QUERY,
    variables: ({ databaseId }: { databaseId: string }, ctx: GetStaticPropsContext) => ({ // Add types for databaseId and ctx
      databaseId,
      asPreview: ctx?.preview,
    }),
  },
];