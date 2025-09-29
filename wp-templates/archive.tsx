import { gql, useQuery } from "@apollo/client";
import { FaustPage } from "@faustwp/core";
import { useState } from "react";
import Layout from "../src/components/Layout";
import EntryHeader from "../components/EntryHeader";
import { POST_LIST_FRAGMENT } from "../fragments/PostListFragment";
import PostListItem from "../components/PostListItem";

interface ArchivePageProps {
  __SEED_NODE__?: {
    uri?: string;
  };
  loading?: boolean;
}

interface Post {
  // Define Post interface based on PostListFragment
  id: string;
  title?: string;
  uri?: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  author?: {
    node?: {
      name?: string;
      avatar?: {
        url?: string;
      };
    };
  };
}

interface ArchiveQueryData {
  nodeByUri?: {
    archiveType?: string;
    name?: string;
    posts?: {
      pageInfo?: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes?: Post[];
    };
  };
}

// Change to how many posts you want to load at once
const BATCH_SIZE = 5;

const ARCHIVE_QUERY = gql`
  ${POST_LIST_FRAGMENT}
  query GetArchive($uri: String!, $first: Int!, $after: String) {
    nodeByUri(uri: $uri) {
      archiveType: __typename
      ... on Category {
        name
        posts(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...PostListFragment
          }
        }
      }
      ... on Tag {
        name
        posts(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ...PostListFragment
          }
        }
      }
    }
  }
`;

const ArchivePage: FaustPage<ArchiveQueryData, ArchivePageProps> = (props) => {
  const currentUri = props.__SEED_NODE__?.uri;
  const {
    data,
    loading = true,
    error,
    fetchMore,
  } = useQuery<ArchiveQueryData>(ARCHIVE_QUERY, {
    variables: { first: BATCH_SIZE, after: null, uri: currentUri },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  if (loading && !data)
    return (
      <div className="max-w-6xl mx-auto px-4 flex justify-center py-20">
        Loading...
      </div>
    );

  if (error) return <p>Error! {error.message}</p>;

  if (!(data?.nodeByUri?.posts?.nodes?.length)) {
    return <p>No posts have been published</p>;
  }

  const { archiveType, name, posts } = data?.nodeByUri || {};

  const loadMorePosts = async () => {
    const endCursor = posts?.pageInfo?.endCursor;
    if (!endCursor) return;

    await fetchMore({
      variables: {
        first: BATCH_SIZE,
        after: endCursor,
        uri: currentUri,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const nextNode = fetchMoreResult?.nodeByUri;
        const nextPosts = nextNode?.posts;
        if (!nextPosts) {
          return prevResult;
        }

        const prevNode = prevResult?.nodeByUri ?? {};
        const prevPosts = prevNode.posts;

        return {
          nodeByUri: {
            ...prevNode,
            ...nextNode,
            posts: {
              ...prevPosts,
              ...nextPosts,
              nodes: [
                ...(prevPosts?.nodes ?? []),
                ...(nextPosts.nodes ?? []),
              ],
            },
          },
        };
      },
    });
  };

  return (
    <Layout title={`${archiveType}: ${name}`}>
      <main className="max-w-6xl mx-auto px-4">
        <EntryHeader title={`Archive for ${archiveType}: ${name}`} />

        <div className="space-y-12">
          {posts && posts.nodes && posts.nodes.length > 0 ? (
            posts.nodes.map((post: Post) => (
              <PostListItem key={post.id} post={post} />
            ))
          ) : (
            <p>No posts found.</p>
          )}
          {posts?.pageInfo?.hasNextPage && (
            <div className="flex justify-center mt-8">
              <LoadMoreButton onClick={loadMorePosts} />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

ArchivePage.query = ARCHIVE_QUERY;
const buildArchiveUri = (value?: string | string[] | null) => {
  if (Array.isArray(value)) {
    return `/${value.join("/")}`;
  }

  if (typeof value === "string" && value.length > 0) {
    return value.startsWith("/") ? value : `/${value}`;
  }

  return "/";
};

ArchivePage.variables = ((context: { params?: { wordpressNode?: string | string[] } } | { uri?: string | null }) => {
  if ("params" in context) {
    const wordPressNode = context.params?.wordpressNode;
    return {
      uri: buildArchiveUri(wordPressNode),
      first: BATCH_SIZE,
      after: null,
    };
  }

  return {
    uri: buildArchiveUri((context as { uri?: string | null })?.uri ?? null),
    first: BATCH_SIZE,
    after: null,
  };
}) as typeof ArchivePage.variables;

export default ArchivePage;

const LoadMoreButton = ({ onClick }: { onClick: () => void }) => {
  // Add type for onClick
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLoadMore}
      disabled={loading}
    >
      {loading ? <>Loading...</> : <>Load more</>}
    </button>
  );
};
