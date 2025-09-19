import React, { useState } from "react";
import Layout from "@/src/components/Layout";
import PatientBanner from "@/src/components/PatientBanner/PatientBanner";
import ActionTriggerCard from "@/src/components/Cards/ActionTriggerCards";
import Pagination from "@/src/components/Pagination/Pagination";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import ReportsTable from "@/src/components/Tables/ReportsTable";

export default function PatientProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Structured table data (like screenshot)
  const reports = [
    {
      id: 1,
      date: "03-MAY-2025 16:33",
      score: 24,
      risk: "critical",
      provider: "Alexander William James Christopher Thompson–Broderick",
      notes: "Integer fringilla urna ut purus elementum, vitae aliquam quam",
    },
    {
      id: 2,
      date: "03-MAY-2025 16:33",
      score: 53,
      risk: "low",
      provider: "Pathirannehelage Don Nimal Sirisena Bandara Pathirannehelage",
      notes:
        "Suspendisse laoreet justo a ligula ornare, in pulvinar nibh placerat.",
    },
    {
      id: 3,
      date: "03-MAY-2025 16:33",
      score: 32,
      risk: "moderate",
      provider: "Annabelle Sophia Catherine Alexandra Whitmore–Sutherland",
      notes: "Phasellus tempus ligula eu magna lobortis, eget aliquam enim",
    },
    {
      id: 4,
      date: "03-MAY-2025 16:33",
      score: 16,
      risk: "critical",
      provider: "Sandra Bullock",
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 5,
      date: "03-MAY-2025 16:33",
      score: 7,
      risk: "low",
      provider: "Ranasinghe Arachchige Don Sanath Teran Jayasuriya",
      notes: "Aliquam efficitur mi quis metus dictum blandit.",
    },
    {
      id: 6,
      date: "03-MAY-2025 16:33",
      score: 41,
      risk: "low",
      provider: "Olivia Amelia Charlotte Victoria Grace Whitmore",
      notes: "Nullam eu tortor hendrerit, bibendum purus ac, iaculis massa.",
    },
    {
      id: 7,
      date: "03-MAY-2025 16:33",
      score: 50,
      risk: "moderate",
      provider: "Liam Noah Oliver James Benjamin Smith",
      notes:
        "Vestibulum viverra, justo vel interdum gravida, purus magna sollicitudin nisi.",
    },
    {
      id: 8,
      date: "03-MAY-2025 16:33",
      score: 33,
      risk: "critical",
      provider: "Sophia Isabella Mia Amelia Harper Johnson",
      notes:
        "Aliquam erat volutpat, neque eget consequat interdum, libero nunc.",
    },
    {
      id: 9,
      date: "03-MAY-2025 16:33",
      score: 26,
      risk: "low",
      provider: "Ethan Lucas Mason Logan Alexander Brown",
      notes: "Praesent non magna nec libero consectetur accumsan et non augue.",
    },
    {
      id: 10,
      date: "03-MAY-2025 16:33",
      score: 38,
      risk: "moderate",
      provider: "Samantha Isabella Grace Victoria Harrington–Blythe",
      notes:
        "Suspendisse laoreet justo a ligula ornare, in pulvinar nibh placerat.",
    },
  ];

  const totalItems = reports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div>
        <div className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black leading-9 text-black">
              Profile Overview
            </h1>
            <p className="text-gray-500 text-sm font-normal leading-6">
              Access personal information, history, and care status
            </p>
          </div>

          {/* Patient Banner */}
          <PatientBanner
            patientId="PT789021"
            name="Elizabeth Victoria Catherine Amelia Grace Harrington"
            age="72"
            dob="1953 AUG 30"
            gender="Woman"
            location="Residential Aged Care Facility"
            risk="LOW RISK"
            latestReportAt="2024 NOV 17 | 21:07"
            latestReportBy="Dr. Smith"
          />

          {/* Action Triggers */}
          <h2 className="mt-6 text-2xl font-bold text-gray-800 leading-8">
            Action Triggers
          </h2>
          <p className="text-gray-500 text-base font-normal leading-6">
            Automate alerts for timely care
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <ActionTriggerCard
              date="2023-08-21 14:37"
              action="Align with resident’s right shoulder for timely action"
              risk="high"
            />
            <ActionTriggerCard
              date="2023-08-22 09:12"
              action="Resident memory suffers other risk indicator event"
              risk="moderate"
            />
            <ActionTriggerCard
              date="2023-08-23 10:25"
              action="Continue monitoring categories where risk indicators exist"
              risk="low"
            />
            <ActionTriggerCard
              date="2023-08-21 14:37"
              action="Align with resident’s right shoulder for timely action"
              risk="low"
            />
            <ActionTriggerCard
              date="2023-08-22 09:12"
              action="Resident memory suffers other risk indicator event"
              risk="high"
            />
            <ActionTriggerCard
              date="2023-08-23 10:25"
              action="Continue monitoring categories where risk indicators exist"
              risk="moderate"
            />
            <div className="mt-2">
              <h2 className="text-2xl text-gray-800 font-bold leading-8">
                Trajectory
              </h2>
              <p className="text-sm text-gray-500 leading-5">
                Monitor changes and anticipate risks across all assessment
                domains
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4 mt-6">
          {/* PCAT Report History */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-gray-800 font-bold leading-8">
                PCAT Report History
              </h2>
              <p className="text-sm text-gray-500 leading-5">
                Access all past assessments instantly
              </p>
            </div>
            <div className="w-lg">
              <SearchBar />
            </div>
          </div>

          {/* Reports Table */}
          <div className="mt-3 rounded-lg">
            <ReportsTable reports={paginatedReports} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
