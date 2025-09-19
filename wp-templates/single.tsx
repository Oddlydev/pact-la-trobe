import { gql } from "@apollo/client";
import { useFaustQuery } from "@faustwp/core";
import { GetStaticPropsContext } from "next"; // Import GetStaticPropsContext
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

export default function Component(props: SinglePageProps) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const contentQuery: PostData = useFaustQuery(POST_QUERY, { fetchPolicy: "cache-first" }) || {}; // Explicitly type

  const { title, content, date, author } = contentQuery?.post || {};

  return (
    <Layout title={title}>
      <main className="max-w-6xl mx-auto px-4">
        <EntryHeader title={title} date={date} author={author?.node?.name} />
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || '' }} />
      </main>
    </Layout>
  );
}

Component.queries = [
  {
    query: POST_QUERY,
    variables: ({ databaseId }: { databaseId: string }, ctx: GetStaticPropsContext) => ({ // Add types for databaseId and ctx
      databaseId,
      asPreview: ctx?.preview,
    }),
  },
];