import { gql, useQuery } from "@apollo/client";
import { FaustPage } from "@faustwp/core";
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

interface PageQueryData {
  page?: {
    title?: string;
    content?: string;
  };
}

const SinglePage: FaustPage<PageQueryData, SinglePageProps> = (props) => {
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
      databaseId,
      asPreview,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  if (loading && !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 flex justify-center py-20">
        Loading...
      </div>
    );
  }

  if (error) return <p>Error! {error.message}</p>;

  if (!data?.page) {
    return <p>No pages have been published</p>;
  }

  const { title, content } = data.page;

  return (
    <Layout title={title}>
      <main className="max-w-6xl mx-auto px-4">
        <EntryHeader title={title} />
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content ?? "" }}
        />
      </main>
    </Layout>
  );
};

SinglePage.query = PAGE_QUERY;
SinglePage.variables = ((seedNode: { databaseId?: number | string } | null, ctx?: { asPreview?: boolean }) => ({
  databaseId: seedNode?.databaseId,
  asPreview: ctx?.asPreview ?? false,
})) as typeof SinglePage.variables;

export default SinglePage;
