import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import Header from "../components/header";
import EntryHeader from "../components/EntryHeader";
import Footer from "../components/footer";
import { getNextStaticProps } from "@faustwp/core";

import { GetStaticPropsContext } from "next"; // Import GetStaticPropsContext

/**
 * Next.js file based page example with Faust helpers.
 */
export default function Page() {
  const { data } = useQuery(Page.query);

  const { title: siteTitle, description: siteDescription } =
    data.generalSettings;
  const menuItems = data.primaryMenuItems.nodes;

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Header
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        menuItems={menuItems}
      />

      <main className="max-w-6xl mx-auto px-4">
        <EntryHeader title="Next.js Page Example" />
        <p>Next.js pages are still supported!</p>
      </main>

      <Footer />
    </>
  );
}

Page.query = gql`
  ${Header.fragments.entry}
  query GetHomePage {
    ...HeaderFragment
  }
`;

export function getStaticProps(ctx: GetStaticPropsContext) { // Add type for ctx
  return getNextStaticProps(ctx, {
    Page,
  });
}
