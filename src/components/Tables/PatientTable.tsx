import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import DotTableRiskIndicator from "@/src/components/Indicators/DotTableRiskIndicator";
import ActionButton from "@/src/components/Buttons/ActionButtons";
import FilterDropdown from "@/src/components/Filters/FilterDropdown";

export type RiskLevel = "critical" | "high" | "moderate" | "low";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "NA";
  status: RiskLevel;
  lastUpdated: string; // "03-MAY-2025 16:33"
};

type Props = { patients: Patient[] };

// ===============================
//   Extra Action Icons
// ===============================
const ReportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M13.3334 10.6666V5.33325C13.3334 3.44763 13.3334 2.50483 12.7476 1.91904C12.1618 1.33325 11.219 1.33325 9.33341 1.33325H6.66675C4.78113 1.33325 3.83832 1.33325 3.25253 1.91904C2.66675 2.50483 2.66675 3.44763 2.66675 5.33325V10.6666C2.66675 12.5522 2.66675 13.495 3.25253 14.0808C3.83832 14.6666 4.78113 14.6666 6.66675 14.6666H9.33341C11.219 14.6666 12.1618 14.6666 12.7476 14.0808C13.3334 13.495 13.3334 12.5522 13.3334 10.6666Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3334 1.33325H5.66675C5.66675 2.27606 5.66675 2.74747 5.95964 3.04036C6.25253 3.33325 6.72395 3.33325 7.66675 3.33325H8.33341C9.27621 3.33325 9.74761 3.33325 10.0405 3.04036C10.3334 2.74747 10.3334 2.27606 10.3334 1.33325Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 7.33325L5.66667 7.99992L7 6.33325"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.66675 11.3333H10.6667M8.66675 7.33325H10.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.66016 11.2449H5.66682"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NotesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M12.6667 8.66658V5.33325C12.6667 3.44763 12.6667 2.50483 12.0809 1.91904C11.4951 1.33325 10.5523 1.33325 8.66667 1.33325H6C4.11438 1.33325 3.17157 1.33325 2.58579 1.91904C2 2.50483 2 3.44763 2 5.33325V10.6666C2 12.5522 2 13.495 2.58579 14.0808C3.17157 14.6666 4.11438 14.6666 6 14.6666H9.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.66667 1.33325H5C5 2.27606 5 2.74747 5.29289 3.04036C5.58579 3.33325 6.05719 3.33325 7 3.33325H7.66667C8.60947 3.33325 9.08087 3.33325 9.3738 3.04036C9.66667 2.74747 9.66667 2.27606 9.66667 1.33325Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66675 9.99992H7.33341M4.66675 7.33325H10.0001"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 12.6667H12M12 12.6667H10M12 12.6667V14.6667M12 12.6667V10.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
  >
    <path
      d="M6.50003 1.5C7.87738 1.5 9.22762 1.61602 10.5415 1.83883C10.808 1.88401 11 2.11677 11 2.38701V2.90901C11 3.20738 10.8815 3.49353 10.6705 3.7045L7.9545 6.4205C7.74353 6.63147 7.625 6.91762 7.625 7.21599V8.67971C7.625 9.10583 7.38425 9.49538 7.00312 9.68594L5.375 10.5V7.21599C5.375 6.91762 5.25647 6.63147 5.0455 6.4205L2.3295 3.7045C2.11853 3.49353 2 3.20738 2 2.90901V2.38702C2 2.11679 2.19204 1.88403 2.45847 1.83884C3.7724 1.61603 5.12266 1.5 6.50003 1.5Z"
      stroke="#0F172A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ===============================
//   Patient Table
// ===============================
export default function PatientTable({ patients }: Props) {
  const router = useRouter();
  // Single active filter
  const [activeFilter, setActiveFilter] = useState<
    "gender" | "status" | "date" | null
  >(null);

  const [genderFilters, setGenderFilters] = useState({
    M: false,
    F: false,
    NA: false,
  });
  const [statusFilters, setStatusFilters] = useState({
    critical: false,
    high: false,
    moderate: false,
    low: false,
  });
  const [dateFilters, setDateFilters] = useState({
    today: false,
    week: false,
    month: false,
  });

  // Button refs
  const genderBtnRef = useRef<HTMLButtonElement>(null);
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const dateBtnRef = useRef<HTMLButtonElement>(null);

  // Parse helper for lastUpdated like "03-MAY-2025 16:33"
  const parseLastUpdated = (s: string): Date | null => {
    if (!s) return null;
    try {
      const [dmy, hm] = s.trim().split(/\s+/);
      if (!dmy) return null;
      const [d, mon, y] = dmy.split("-");
      const [h = "0", m = "0"] = (hm || "").split(":");
      const months: Record<string, number> = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
      };
      const mi = months[(mon || "").toUpperCase()];
      if (mi == null) return null;
      const dt = new Date(Number(y), mi, Number(d), Number(h), Number(m));
      return isNaN(dt.getTime()) ? null : dt;
    } catch {
      return null;
    }
  };

  // Filtering logic
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const activeGender = Object.keys(genderFilters).filter(
        (k) => (genderFilters as any)[k]
      );
      const activeStatus = Object.keys(statusFilters).filter(
        (k) => (statusFilters as any)[k]
      );
      const activeDate = Object.keys(dateFilters).filter(
        (k) => (dateFilters as any)[k]
      );

      const genderPass =
        activeGender.length === 0 || activeGender.includes(p.gender);
      const statusPass =
        activeStatus.length === 0 || activeStatus.includes(p.status);

      let datePass = true;
      if (activeDate.length > 0) {
        const updatedDate = parseLastUpdated(p.lastUpdated);
        if (!updatedDate) return false; // cannot evaluate -> exclude when a date filter is active
        const now = new Date();

        const checks: boolean[] = [];
        if (dateFilters.today) {
          checks.push(updatedDate.toDateString() === now.toDateString());
        }
        if (dateFilters.week) {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          checks.push(updatedDate >= sevenDaysAgo);
        }
        if (dateFilters.month) {
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(now.getDate() - 30);
          checks.push(updatedDate >= thirtyDaysAgo);
        }
        datePass = checks.some(Boolean);
      }

      return genderPass && statusPass && datePass;
    });
  }, [patients, genderFilters, statusFilters, dateFilters]);

  return (
    <div className="overflow-x-auto relative">
      <table className="min-w-full table-fixed text-left text-sm">
        <thead className="border-b border-slate-200">
          <tr>
            <th className="w-32 pr-4 py-3.5 text-base font-semibold text-black font-dmsans">
              Patient ID
            </th>
            <th className="w-64 px-4 py-3.5 text-base font-semibold text-black font-dmsans">
              Patient Name
            </th>
            <th className="w-16 px-4 py-3.5 text-base font-semibold text-black font-dmsans text-center">
              Age
            </th>

            {/* Gender Filter */}
            <th className="w-24 px-4 py-3.5 text-base font-semibold text-black font-dmsans text-center">
              <button
                ref={genderBtnRef}
                onClick={() =>
                  setActiveFilter(activeFilter === "gender" ? null : "gender")
                }
                className="flex items-center justify-center gap-1 w-full hover:text-gray-700"
              >
                Gender <HeaderIcon />
              </button>
              <FilterDropdown
                title="Gender"
                open={activeFilter === "gender"}
                options={[
                  { key: "M", label: "Male" },
                  { key: "F", label: "Female" },
                  { key: "NA", label: "Not Prefer" },
                ]}
                selected={genderFilters}
                onApply={(sel) => {
                  const next = {
                    M: !!(sel as any).M,
                    F: !!(sel as any).F,
                    NA: !!(sel as any).NA,
                  };
                  setGenderFilters(next);
                }}
                onClear={() =>
                  setGenderFilters({ M: false, F: false, NA: false })
                }
                onClose={() => setActiveFilter(null)}
                anchorRef={genderBtnRef}
              />
            </th>

            {/* Status Filter */}
            <th className="w-32 px-4 py-3.5 text-base font-semibold text-black font-dmsans text-center">
              <button
                ref={statusBtnRef}
                onClick={() =>
                  setActiveFilter(activeFilter === "status" ? null : "status")
                }
                className="flex items-center justify-center gap-1 w-full hover:text-gray-700"
              >
                Patient Status <HeaderIcon />
              </button>
              <FilterDropdown
                title="Status"
                open={activeFilter === "status"}
                options={[
                  { key: "critical", label: "Critical" },
                  { key: "high", label: "High Risk" },
                  { key: "moderate", label: "Moderate" },
                  { key: "low", label: "Low" },
                ]}
                selected={statusFilters}
                onApply={(sel) =>
                  setStatusFilters({
                    critical: !!(sel as any).critical,
                    high: !!(sel as any).high,
                    moderate: !!(sel as any).moderate,
                    low: !!(sel as any).low,
                  })
                }
                onClear={() =>
                  setStatusFilters({
                    critical: false,
                    high: false,
                    moderate: false,
                    low: false,
                  })
                }
                onClose={() => setActiveFilter(null)}
                anchorRef={statusBtnRef}
              />
            </th>

            {/* Date Filter */}
            <th className="w-48 px-4 py-3.5 text-base font-semibold text-black font-dmsans">
              <button
                ref={dateBtnRef}
                onClick={() =>
                  setActiveFilter(activeFilter === "date" ? null : "date")
                }
                className="flex items-center gap-1 w-full hover:text-gray-700"
              >
                Last Updated Date <HeaderIcon />
              </button>
              <FilterDropdown
                title="Date"
                open={activeFilter === "date"}
                options={[
                  { key: "today", label: "Today" },
                  { key: "week", label: "This Week" },
                  { key: "month", label: "This Month" },
                ]}
                selected={dateFilters}
                onApply={(sel) =>
                  setDateFilters({
                    today: !!(sel as any).today,
                    week: !!(sel as any).week,
                    month: !!(sel as any).month,
                  })
                }
                onClear={() =>
                  setDateFilters({ today: false, week: false, month: false })
                }
                onClose={() => setActiveFilter(null)}
                anchorRef={dateBtnRef}
              />
            </th>

            <th className="w-56 py-3.5 text-base font-semibold text-black font-dmsans">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredPatients.map((p, idx) => (
            <tr key={p.id || idx}>
              <td className="pr-4 py-3.5 text-sm text-gray-600">{p.id}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600">{p.name}</td>
              <td className="px-4 py-3.5 text-center text-sm text-gray-600">
                {p.age}
              </td>
              <td className="px-4 py-3.5 text-center text-sm text-gray-600">
                {p.gender}
              </td>
              <td className="px-4 py-3.5 text-center">
                <DotTableRiskIndicator variant={p.status} />
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-normal leading-5 uppercase">
                    {p.lastUpdated.split(" ")[0]}
                  </span>
                  <span className="text-sm text-gray-600 font-normal leading-5">
                    {p.lastUpdated.split(" ")[1]}
                  </span>
                </div>
              </td>
              <td className="py-3.5">
                <div className="inline-flex items-center gap-2">
                  <ActionButton
                    variant="dark"
                    type="text"
                    label="View Patient"
                    iconType="viewPatient"
                    onClick={() => router.push(`/patient-profile/${p.id}`)}
                  />
                  <button
                    className="flex items-center justify-center rounded-full border border-black bg-black text-white p-2.5 hover:bg-transparent hover:text-black cursor-pointer transition-colors"
                    onClick={() => router.push(`/assessment-report/`)}
                    aria-label="Open Assessment Report"
                    title="Open Assessment Report"
                  >
                    <ReportIcon />
                  </button>
                  <button
                    className="flex items-center justify-center rounded-full border border-black text-black p-2.5 hover:bg-black hover:text-white cursor-pointer transition-colors"
                    onClick={() => router.push(`/assessment-form/`)}
                    aria-label="Open Assessment Form"
                    title="Open Assessment Form"
                  >
                    <NotesIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">
                No patients match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
