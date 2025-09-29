import { gql } from "@apollo/client";
import { FaustPage, useFaustQuery } from "@faustwp/core";
import Layout from "../src/components/Layout";
import EntryHeader from "../components/EntryHeader";

const POST_QUERY = gql`
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      author {
        node {
          name
        }
      }
    }
  }
`;

interface PostData {
  post?: {
    title?: string;
    content?: string;
    date?: string;
    author?: {
      node?: {
        name?: string;
      };
    };
  };
}

interface SinglePageProps {
  loading?: boolean;
  __SEED_NODE__?: {
    databaseId?: string;
    asPreview?: boolean;
  };
}

const Component: FaustPage<PostData, SinglePageProps> = (props) => {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const contentQuery: PostData = useFaustQuery<PostData>(POST_QUERY) || {}; // Explicitly type

  const { title, content, date, author } = contentQuery?.post || {};

  return (
    <Layout title={title}>
      <main className="max-w-6xl mx-auto px-4">
        <EntryHeader title={title} date={date} author={author?.node?.name} />
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </main>
    </Layout>
  );
};

Component.query = POST_QUERY;
Component.variables = ((seedNode: { databaseId?: number | string } | null, ctx?: { asPreview?: boolean }) => ({
  databaseId: seedNode?.databaseId,
  asPreview: ctx?.asPreview ?? false,
})) as typeof Component.variables;

export default Component;
