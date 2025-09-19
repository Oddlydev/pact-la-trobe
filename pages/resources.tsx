import Head from "next/head";
import { useState } from "react";
import Layout from "@/src/components/Layout";
import ResourcesCard from "@/src/components/Cards/ResourcesCards";
import { ResourcesCardProps } from "@/src/components/Cards/ResourcesCards";
import Pagination from "@/src/components/Pagination/Pagination";

export default function ResourcesPage() {
  const resources: ResourcesCardProps[] = [
    {
      image: "/assets/images/card-imgs/resources-card-img.png",
      category: "Guidelines",
      description:
        "Latest clinical guidelines and care protocols to support medical staff with updated practices.",
      link: "/resources/guidelines",
      linkType: "internal",
    },
    {
      image: "/assets/images/card-imgs/resources-card-img.png",
      category: "Training",
      description:
        "Access training materials, tutorials, and skill development sessions for healthcare staff.",
      link: "/resources/training",
      linkType: "internal",
    },
    {
      image: "/assets/images/card-imgs/resources-card-img.png",
      category: "External Research",
      description:
        "Stay up-to-date with the latest external publications, peer-reviewed journals, and case studies.",
      link: "https://www.ncbi.nlm.nih.gov/",
      linkType: "external",
    },
    {
      image: "/assets/images/card-imgs/resources-card-img.png",
      category: "Patient Resources",
      description:
        "Downloadable patient information sheets and self-care management materials.",
      link: "/resources/patient-info",
      linkType: "internal",
    },
    {
      image: "/assets/images/card-imgs/resources-card-img.png",
      category: "External Research",
      description:
        "Stay up-to-date with the latest external publications, peer-reviewed journals, and case studies.",
      link: "https://www.ncbi.nlm.nih.gov/",
      linkType: "external",
    },
    {
      image: "/assets/images/card-imgs/resources-card-img.png",
      category: "Patient Resources",
      description:
        "Downloadable patient information sheets and self-care management materials.",
      link: "/resources/patient-info",
      linkType: "internal",
    },
  ];

  // 👉 Pagination only for UI
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // 👈 hardcoded or dynamic, but not linked to cards

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
            {resources.map((res, idx) => (
              <ResourcesCard key={idx} {...res} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
