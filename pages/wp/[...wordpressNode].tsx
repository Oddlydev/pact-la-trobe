import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import { GetStaticPropsContext } from "next"; // Import GetStaticPropsContext

interface WordPressTemplateProps {
  __TEMPLATE_SLUG__?: string;
  __SEED_NODE__?: any; // This can be more specific if needed
  loading?: boolean;
}

export default function Page(props: WordPressTemplateProps) {
  return <WordPressTemplate {...props} />;
}

export async function getStaticProps(ctx) {
  const props = await getWordPressProps({ ctx });
  return { ...props, revalidate: 120 };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
