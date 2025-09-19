import Head from "next/head";

type Props = { title?: string; description?: string; canonical?: string };

export default function SEO({ title, description, canonical }: Props) {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}
