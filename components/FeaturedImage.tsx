import Link from "next/link";
import Image from "next/image";

interface FeaturedImageProps {
  post: {
    featuredImage?: {
      node?: {
        sourceUrl?: string;
        altText?: string;
      };
    };
    title?: string;
  };
  classNames?: string;
  uri?: string | boolean;
  title?: string; // This title is for the Link, not the post title
}

export function FeaturedImage({
  post,
  classNames = "h-48 my-9 relative",
  uri = false,
  title = "",
}: FeaturedImageProps) {
  if (!post.featuredImage?.node?.sourceUrl) {
    return "";
  }

  return (
    <div className={`relative ${classNames}`}>
      {typeof uri === "string" && uri.trim() !== "" ? (
        <Link href={uri} title={title} className="block w-full h-full">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title || ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </Link>
      ) : (
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.featuredImage.node.altText || post.title || ''}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      )}
    </div>
  );
}
