import { gql, useQuery } from "@apollo/client";
import { FaustPage } from "@faustwp/core";
import type { GetStaticPropsContext } from "next";
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

interface PageQueryData {
  page?: {
    title?: string;
    content?: string;
  };
}

const FrontPage: FaustPage<PageQueryData, FrontPageProps> = (props) => {
  if (props.loading) {
    return <>Loading...</>;
  }

  const databaseId = props.__SEED_NODE__?.databaseId;
  const asPreview = props.__SEED_NODE__?.asPreview;

  const {
    data,
    loading = true,
    error,
  } = useQuery<PageQueryData>(PAGE_QUERY, {
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
        <div dangerouslySetInnerHTML={{ __html: content ?? "" }} />
      </main>
    </Layout>
  );
};

FrontPage.query = PAGE_QUERY;
FrontPage.variables = ((
  arg: GetStaticPropsContext | null,
  ctx?: { asPreview?: boolean }
) => ({
  databaseId: 1,
  asPreview:
    ctx?.asPreview ?? Boolean(arg && "preview" in arg ? arg.preview : false),
})) as typeof FrontPage.variables;

export default FrontPage;
