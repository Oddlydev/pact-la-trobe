import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Layout from "@/src/components/Layout";
import ResourcesCard from "@/src/components/Cards/ResourcesCards";
import Pagination from "@/src/components/Pagination/Pagination";

const RESOURCES_QUERY = gql`
  query GetResources {
    resources(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        excerpt
        slug
        uri
        externalWebisteLink {
          externalLink
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export default function ResourcesPage({ resources }: { resources: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalItems = resources.length;
  const paginated = resources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      <Head>
        <title>Resources – Dashboard</title>
      </Head>

      <Layout>
        <div className="pb-6 pt-4">
          <h1 className="text-3xl font-black leading-9 text-black tracking-tighter">
            Resources
          </h1>
          <p className="text-gray-500 text-base leading-6 tracking-normal mt-1">
            Stay updated with expert views and industry best practices
          </p>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {paginated.map((res) => (
              <ResourcesCard key={res.id} {...res} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={pageSize}
                totalItems={totalItems}
                label="resources"
              />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { requireAuth } = await import("@/lib/requireAuth");
  const authRedirect = await requireAuth(ctx);
  if (authRedirect) return authRedirect;
  const client = new ApolloClient({
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
        "https://pactlatrobedev.wpenginepowered.com/graphql",
    }),
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({ query: RESOURCES_QUERY });

  const resources =
    data?.resources?.nodes.map((res: any) => {
      const external = res?.externalWebisteLink?.externalLink || "";
      const isExternal = Boolean(external);
      return {
        id: res.id,
        title: res.title || "Untitled",
        image:
          res.featuredImage?.node?.sourceUrl ||
          "/assets/images/card-imgs/resources-card-img.png",
        // If no category selected, keep blank instead of defaulting to 'General'
        category: res.categories?.nodes?.[0]?.name ?? "",
        description: res.excerpt || "",
        link: isExternal ? external : `/resources/${res.slug}`,
        linkType: isExternal ? "external" : "internal",
      };
    }) || [];

  return {
    props: { resources },
  };
};
