import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/src/components/Layout";
import PatientBanner from "@/src/components/Banner/PatientBanner";
import ActionTriggerCard from "@/src/components/Cards/ActionTriggerCards";
import Pagination from "@/src/components/Pagination/Pagination";
import SearchBar from "@/src/components/Forms/SearchBar";
import ReportsTable from "@/src/components/Tables/ReportsTable";
import PrimaryButton from "@/src/components/Buttons/PrimaryButtons";

type Report = {
  id: number;
  date: string;
  score: number;
  risk: "critical" | "low" | "moderate";
  provider: string;
  notes: string;
};

export default function PatientProfilePage() {
  const router = useRouter();
  const { id } = router.query; // <- URL param (PT200013)

  const [patient, setPatient] = useState<any>(null);

  // Dummy reports (replace with API later)
  const reports: Report[] = [
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
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = reports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch patient info from API
  useEffect(() => {
    if (id) {
      fetch(`/api/patient-profile/${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.ok) {
            setPatient(res.data);
          }
        })
        .catch(() => setPatient(null));
    }
  }, [id]);

  // Wait until patient is loaded
  if (!patient) return null;

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black leading-9 text-black">
                Profile Overview
              </h1>
              <p className="text-gray-500 text-sm font-normal leading-6">
                Access personal information, history, and care status
              </p>
            </div>
            {/* ✅ Button goes with patient.id (already PT200013) */}
            <Link
              href={`/assessment-form/${patient.id}`}
              className="shrink-0"
              aria-label="Create new assessment"
            >
              <PrimaryButton
                variant="dark"
                iconType="assessment"
                label="New Assessment"
              />
            </Link>
          </div>

          {/* Patient Banner */}
          <PatientBanner
            patientId={patient.id} // shows PT200013
            name={patient.name}
            age={patient.age || "N/A"}
            dob={patient.dob || "-"}
            gender={patient.gender}
            location="Residential Aged Care Facility"
            risk={patient.riskLevel?.toUpperCase()}
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
          </div>
        </div>

        {/* PCAT Report History */}
        <div className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4 mt-6">
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

          <div className="mt-3 rounded-lg">
            <ReportsTable reports={paginatedReports} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={0}
              totalItems={0}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
