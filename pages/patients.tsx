import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import Layout from "@/src/components/Layout";
import PatientBanner from "@/src/components/Banner/PatientBanner";
import ActionTriggerCard from "@/src/components/Cards/ActionTriggerCards";
import DotTableRiskIndicator from "@/src/components/Indicators/DotTableRiskIndicator";
import ActionButton from "@/src/components/Buttons/ActionButtons";
import Pagination from "@/src/components/Pagination/Pagination";
import SearchBar from "@/src/components/Forms/SearchBar";

export default function PatientProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 37;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Use deterministic values to avoid SSR/CSR hydration mismatches
  const reports = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
    date: `03-MAY-2025 16:3${i % 10}`,
    // Deterministic pseudo-score in range 0..52
    score: (i * 17 + 11) % 53,
    risk: i % 3 === 0 ? "critical" : i % 3 === 1 ? "low" : "moderate",
    provider: `Provider ${i + 1}`,
    speciality: "Geriatrics",
    notes: "Sample notes text for patient history...",
  }));

  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="px-6 pb-6 pt-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Profile Overview
        </h1>

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
        <h2 className="mt-8 mb-3 text-lg font-semibold">Action Triggers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </div>

        {/* Trajectory */}
        <div className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Trajectory</h2>
            <p className="text-sm text-gray-500">
              Monitor changes and anticipate risks across all assessment domains
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border px-3 py-1 text-sm">
              {"<"}
            </button>
            <span className="text-sm font-medium">Aug 15 – Aug 29</span>
            <button className="rounded-md border px-3 py-1 text-sm">
              {">"}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <img
            src="/trajectory-placeholder.png"
            alt="Trajectory Chart"
            className="w-full rounded-md"
          />
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            <DotTableRiskIndicator variant="critical" />
            <DotTableRiskIndicator variant="high" />
            <DotTableRiskIndicator variant="moderate" />
            <DotTableRiskIndicator variant="low" />
          </div>
        </div>

        {/* PCAT Report History */}
        <div className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">PCAT Report History</h2>
            <p className="text-sm text-gray-500">
              Access all past assessments instantly
            </p>
          </div>
          <div className="w-80">
            <SearchBar />
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Report Date</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Patient Status</th>
                <th className="px-4 py-2">Created By</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.date}</td>

                  {/* Score column fixed to one line */}
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-gray-800">
                        {r.score}
                      </span>
                      <span className="text-gray-400 text-xs">/53</span>
                      <span className="text-[10px] text-gray-500">
                        PCAT Score
                      </span>
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <DotTableRiskIndicator variant={r.risk as any} />
                  </td>
                  <td className="px-4 py-2">{r.provider}</td>
                  <td className="px-4 py-2">{r.notes}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        variant="dark"
                        type="text"
                        label="View Report"
                      />
                      <ActionButton
                        variant="light"
                        type="icon"
                        ariaLabel="Download"
                      />
                      <ActionButton
                        variant="light"
                        type="icon"
                        ariaLabel="Share"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { requireAuth } = await import("@/lib/requireAuth");
  const authRedirect = await requireAuth(ctx);
  if (authRedirect) return authRedirect;
  return { props: {} };
};
