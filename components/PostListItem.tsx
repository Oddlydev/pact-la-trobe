import Link from "next/link";
import { FeaturedImage } from "./FeaturedImage";


interface PostListItemProps {
  post: {
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
  };
}

export default function PostListItem({ post }: PostListItemProps) {
  const { title, excerpt, uri, date } = post;

  return (
    <article className="mb-8 p-4 border border-gray-200 rounded-lg">
      <time className="text-sm text-gray-500" dateTime={post.date || ''}>
        {new Date(post.date || '').toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      <h2 className="text-xl font-semibold mt-2">
        <Link href={uri || ''} title={title} className="text-blue-600 hover:underline">
          {title}
        </Link>
      </h2>

      {post.author && post.author.node && (
        <div className="text-sm text-gray-600 mt-1">
          <span>by {post.author.node.name}</span>
        </div>
      )}

      <FeaturedImage
        post={post}
        uri={uri}
        title={title}
        classNames="h-48 my-9 relative"
      />

      <div
        className="mt-4 text-gray-700"
        dangerouslySetInnerHTML={{ __html: excerpt || '' }}
      />

      <Link href={uri || ''} title="Read more" className="inline-block mt-4 text-blue-600 hover:underline">
        Read more
      </Link>
    </article>
  );
}
