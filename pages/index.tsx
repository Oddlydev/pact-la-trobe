import Head from "next/head";
import { useState, useEffect } from "react";
import type { GetServerSideProps } from "next";
import Sidebar from "@/src/components/Navigation/Sidebar";
import StatisticsCard from "@/src/components/Cards/StatisticsCard";
import Chip from "@/src/components/Chips/Chips";
import SearchBar from "@/src/components/Forms/SearchBar";
import Pagination from "@/src/components/Pagination/Pagination";
import Topbar from "@/src/components/Navigation/Topbar";
import PatientGrid from "@/src/components/Tables/PatientGrid";
import PatientTable from "@/src/components/Tables/PatientTable";
import SegmentedControls from "@/src/components/SegmentedControls/SegmentedControls";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All Patients");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch patients from API
  useEffect(() => {
    fetch("/api/patient-overview")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setPatients(res.data);
      });
  }, []);

  // ==========================================================
  //  Filtering
  // ==========================================================
  // Apply risk-level filter first
  const riskFilteredPatients =
    selectedFilter === "All Patients"
      ? patients
      : patients.filter((p) => {
          if (selectedFilter === "Critical") return p.riskLevel === "critical";
          if (selectedFilter === "High Risk") return p.riskLevel === "high";
          if (selectedFilter === "Moderate Risk") return p.riskLevel === "moderate";
          if (selectedFilter === "Low Risk") return p.riskLevel === "low";
          return true;
        });

  // Then apply search across multiple fields (name, id, age, gender, score, riskLevel, risks)
  const normalize = (s: any) =>
    (s == null ? "" : String(s))
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const normalizedQuery = normalize(searchQuery);
  const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  const filteredPatients = tokens.length === 0
    ? riskFilteredPatients
    : riskFilteredPatients.filter((p) => {
        const searchable = [
          p.name,
          p.id,
          p.age,
          p.gender,
          p.score,
          p.riskLevel,
          ...(Array.isArray(p.risks) ? p.risks : []),
        ]
          .map(normalize)
          .join(" ");

        // Match ALL tokens somewhere within the concatenated string
        return tokens.every((t) => searchable.includes(t));
      });

  const patientsPerPage = 12;
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const displayedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  // ==========================================================
  //  ChipGroup
  // ==========================================================
  function ChipGroup() {
    const items = [
      { label: "All Patients", count: patients.length },
      {
        label: "Critical",
        count: patients.filter((p) => p.riskLevel === "critical").length,
        color: "bg-red-600 text-white",
      },
      {
        label: "High Risk",
        count: patients.filter((p) => p.riskLevel === "high").length,
        color: "bg-orange-500 text-black",
      },
      {
        label: "Moderate Risk",
        count: patients.filter((p) => p.riskLevel === "moderate").length,
        color: "bg-amber-500 text-black",
      },
      {
        label: "Low Risk",
        count: patients.filter((p) => p.riskLevel === "low").length,
        color: "bg-green-600 text-black",
      },
    ];

    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-200 p-1.5">
        {items.map((item) => (
          <Chip
            key={item.label}
            label={item.label}
            count={item.count}
            selected={selectedFilter === item.label}
            onSelectedChange={() => {
              setSelectedFilter(item.label);
              setCurrentPage(1);
            }}
            badgeClassName={item.color}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home – Dashboard</title>
      </Head>

      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto bg-white">
          <Topbar />
          <div className="px-4 pt-4 bg-[rgba(171,190,194,0.10)] shadow-[inset_0_0_50px_0_rgba(171,190,194,0.10)] pb-4">
            {/* Weekly Recommendations */}
            <section className="mb-6">
              <div className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
                <h2 className="mb-1 text-2xl font-bold text-gray-800 leading-8 tracking-tighter">
                  Weekly Recommendations
                </h2>
                <p className="text-gray-500 text-base font-normal leading-6 tracking-normal">
                  AI highlights the percentage of patients flagged for review
                  and provides personalized care guidance for the week.
                </p>
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2.5">
                    <StatisticsCard
                      title="Patient Risk"
                      subtitle="High-risk patients compared to last week"
                      value="50%"
                    />
                    <StatisticsCard
                      title="Follow-ups"
                      subtitle="Patients received scheduled follow-up visits"
                      value="68%"
                    />
                    <StatisticsCard
                      title="Care Coverage"
                      subtitle="More patients got home visits this month"
                      value="65%"
                    />
                    <StatisticsCard
                      title="Medication Compliance"
                      subtitle="Patient adherence rate"
                      value="82%"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Patient Overview */}
            <section className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
              {/* View toggle */}
              <section className="flex justify-end pb-8">
                <SegmentedControls
                  value={viewMode === "card" ? "grid" : "list"}
                  onChange={(val) =>
                    setViewMode(val === "grid" ? "card" : "table")
                  }
                />
              </section>

              {/* Patient Overview Section */}
              <section>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold leading-8 text-gray-800">
                      Patient Overview
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Select a patient to proceed
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <ChipGroup />
                  </div>
                </div>

                {/* Search */}
                <div className="pb-8 pt-3">
                  <SearchBar
                    value={searchQuery}
                    onChange={(val) => {
                      setSearchQuery(val);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* Switch Views */}
                {viewMode === "card" && (
                  <PatientGrid patients={displayedPatients} />
                )}

                {viewMode === "table" && (
                  <PatientTable
                    patients={displayedPatients.map((p) => ({
                      id: p.id,
                      name: p.name,
                      age: p.age,
                      gender: p.gender as "M" | "F" | "NA",
                      status: p.riskLevel,
                      lastUpdated: "03-MAY-2025 16:33",
                    }))}
                  />
                )}

                {/* Pagination */}
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredPatients.length}
                    itemsPerPage={patientsPerPage}
                    onPageChange={setCurrentPage}
                    label="patients"
                  />
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
  const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  const token = ctx.req.cookies?.[COOKIE_NAME];

  // If no token, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Optionally validate token against WP to avoid stale cookies
  if (NEXT_PUBLIC_WORDPRESS_URL) {
    try {
      const meRes = await fetch(
        `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/me&context=edit`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!meRes.ok) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    } catch {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }

  // Authenticated
  return { props: {} };
};
