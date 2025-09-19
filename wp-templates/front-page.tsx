import { gql, useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";
import { GetStaticPropsContext } from "next";
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

interface FrontPageProps {
  __SEED_NODE__?: {
    databaseId?: string;
    asPreview?: boolean;
  };
  loading?: boolean;
}

export default function FrontPage(props: FrontPageProps) {
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
    fetchPolicy: "cache-and-network",
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
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </Layout>
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  return getNextStaticProps(ctx, {
    Page: FrontPage,
    revalidate: 60,
  });
}

FrontPage.queries = [
  {
    query: PAGE_QUERY,
    variables: (ctx: GetStaticPropsContext) => ({
      databaseId: 1, // Assuming the front page has an ID of 1
      asPreview: ctx?.preview,
    }),
  },
];
