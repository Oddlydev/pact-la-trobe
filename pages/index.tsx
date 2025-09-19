import Head from "next/head";
import { useState } from "react";
import Sidebar from "@/src/components/Navigation/Sidebar";
import StatisticsCard from "@/src/components/Cards/StatisticsCard";
import Chip from "@/src/components/Chips/Chips";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Pagination from "@/src/components/Pagination/Pagination";
import Topbar from "@/src/components/Navigation/Topbar";
import PatientGrid from "@/src/components/Tables/PatientGrid";
import PatientTable from "@/src/components/Tables/PatientTable";
import SegmentedControls from "@/src/components/SegmentedControls/SegmentedControls";
import { RiskLevel } from "@/src/components/Cards/PatientCard";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // 🔹 Track selected chip
  const [selectedChip, setSelectedChip] = useState("All Patients");

  // 🔹 Unique patient dataset
  const patients = [
    {
      name: "Olivia Whitmore",
      age: 75,
      gender: "F",
      risks: ["Caregiver is unable to continue care"],
      score: 18,
      riskLevel: "moderate" as RiskLevel,
    },
    {
      name: "Annabelle Sophia Catherine Alexandra Whitmore-Sutherland",
      age: 68,
      gender: "M",
      risks: ["Has risk for recurrent falls"],
      score: 10,
      riskLevel: "low" as RiskLevel,
    },
    {
      name: "Charlotte Wentworth",
      age: 91,
      gender: "F",
      risks: ["Mobility challenges"],
      score: 41,
      riskLevel: "critical" as RiskLevel,
    },
    {
      name: "Lakshitha Karunathilaka",
      age: 81,
      gender: "M",
      risks: ["Medication non-adherence"],
      score: 23,
      riskLevel: "high" as RiskLevel,
    },
    {
      name: "Sophia Johnson",
      age: 59,
      gender: "F",
      risks: ["Chronic illness management"],
      score: 15,
      riskLevel: "low" as RiskLevel,
    },
    {
      name: "Ethan Rodriguez",
      age: 72,
      gender: "M",
      risks: ["Cognitive decline"],
      score: 34,
      riskLevel: "high" as RiskLevel,
    },
    {
      name: "Amelia Chen",
      age: 64,
      gender: "F",
      risks: ["Social isolation"],
      score: 22,
      riskLevel: "moderate" as RiskLevel,
    },
    {
      name: "James Thompson",
      age: 88,
      gender: "M",
      risks: ["Frequent hospital admissions"],
      score: 45,
      riskLevel: "critical" as RiskLevel,
    },
    {
      name: "Isabella Garcia",
      age: 70,
      gender: "F",
      risks: ["Post-surgery recovery"],
      score: 28,
      riskLevel: "moderate" as RiskLevel,
    },
    {
      name: "Noah Patel",
      age: 66,
      gender: "M",
      risks: ["High fall risk"],
      score: 19,
      riskLevel: "low" as RiskLevel,
    },
  ];

  const patientsPerPage = 6;
  const totalPages = Math.ceil(patients.length / patientsPerPage);
  const displayedPatients = patients.slice(
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
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-200 p-1.5">
        {items.map((item, idx) => (
          <Chip
            key={item.label}
            label={item.label}
            count={item.count}
            selected={idx === selectedIndex}
            onSelectedChange={() => setSelectedIndex(idx)}
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
              <section className="flex justify-end pb-4">
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
                    <h2 className="text-lg font-semibold">Patient Overview</h2>
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
                  <SearchBar />
                </div>

                {/* Switch Views */}
                {viewMode === "card" && (
                  <PatientGrid patients={displayedPatients} />
                )}

                {viewMode === "table" && (
                  <PatientTable
                    patients={patients.map((p, i) => ({
                      id: `PT1344${i + 1}`,
                      name: p.name,
                      age: p.age,
                      gender: p.gender as "M" | "F",
                      status: p.riskLevel,
                      lastUpdated: "03-MAY-2025 16:33",
                    }))}
                  />
                )}

                {/* Pagination always visible */}
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={patients.length}
                    itemsPerPage={patientsPerPage}
                    onPageChange={setCurrentPage}
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
