import { WordPressTemplate } from "@faustwp/core";

interface WordPressTemplateProps {
  __TEMPLATE_SLUG__?: string;
  __SEED_NODE__?: any; // This can be more specific if needed
  loading?: boolean;
}

export default function Preview(props: WordPressTemplateProps) {
  return <WordPressTemplate {...props} />;
}
