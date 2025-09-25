import React, { useState, useMemo, useRef } from "react";
import DotTableRiskIndicator from "@/src/components/Indicators/DotTableRiskIndicator";
import ActionButton from "@/src/components/Buttons/ActionButtons";
import FilterDropdown from "@/src/components/Filters/FilterDropdown";

const HeaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
  >
    <g clipPath="url(#clip0_786_11950)">
      <path
        d="M6.00003 1.58984C7.37738 1.58984 8.72762 1.70587 10.0415 1.92868C10.308 1.97386 10.5 2.20662 10.5 2.47685V2.99885C10.5 3.29722 10.3815 3.58337 10.1705 3.79435L7.4545 6.51034C7.24353 6.72132 7.125 7.00747 7.125 7.30583V8.76956C7.125 9.19567 6.88425 9.58522 6.50312 9.77579L4.875 10.5898V7.30583C4.875 7.00747 4.75647 6.63147 4.5455 6.51034L1.8295 3.79435C1.61853 3.58337 1.5 3.29722 1.5 2.99885V2.47687C1.5 2.20663 1.69204 1.97387 1.95847 1.92869C3.2724 1.70587 4.62266 1.58984 6.00003 1.58984Z"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_786_11950">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="translate(0 0.0898438)"
        />
      </clipPath>
    </defs>
  </svg>
);

type Report = {
  id: number;
  date: string; // "03-MAY-2025 16:33"
  score: number;
  risk: "critical" | "low" | "moderate";
  provider: string;
  notes: string;
};

type Props = { reports: Report[] };

export default function ReportsTable({ reports }: Props) {
  // Only one filter open at a time
  const [activeFilter, setActiveFilter] = useState<"date" | "status" | null>(
    null
  );

  const [dateFilters, setDateFilters] = useState({
    today: false,
    week: false,
    month: false,
  });
  const [statusFilters, setStatusFilters] = useState({
    critical: false,
    low: false,
    moderate: false,
  });

  // Anchor buttons for positioning
  const dateBtnRef = useRef<HTMLButtonElement>(null);
  const statusBtnRef = useRef<HTMLButtonElement>(null);

  // Apply filters
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const actStatus = Object.keys(statusFilters).filter(
        (k) => (statusFilters as any)[k]
      );
      const actDate = Object.keys(dateFilters).filter(
        (k) => (dateFilters as any)[k]
      );

      const statusPass = actStatus.length === 0 || actStatus.includes(r.risk);

      let datePass = true;
      if (actDate.length > 0) {
        const d = new Date(r.date);
        const now = new Date();
        if (dateFilters.today)
          datePass = d.toDateString() === now.toDateString();
        if (dateFilters.week) {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          datePass = d >= weekAgo;
        }
        if (dateFilters.month) {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          datePass = d >= monthAgo;
        }
      }
      return statusPass && datePass;
    });
  }, [reports, dateFilters, statusFilters]);

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200">
          <tr>
            {/* Report Date (KEEPING ALL YOUR CLASSES) */}
            <th className="w-[160px] pr-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              <button
                ref={dateBtnRef}
                onClick={() =>
                  setActiveFilter(activeFilter === "date" ? null : "date")
                }
                className="flex items-center gap-1 justify-between hover:text-gray-700 w-full"
              >
                Report Date <HeaderIcon />
              </button>
              <FilterDropdown
                title="Report Date"
                open={activeFilter === "date"}
                options={[
                  { key: "today", label: "Today" },
                  { key: "week", label: "This Week" },
                  { key: "month", label: "This Month" },
                ]}
                selected={dateFilters}
                onChange={(k, v) => setDateFilters((p) => ({ ...p, [k]: v }))}
                onClear={() =>
                  setDateFilters({ today: false, week: false, month: false })
                }
                onClose={() => setActiveFilter(null)}
                anchorRef={dateBtnRef}
              />
            </th>

            <th className="w-[80px] px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center">
              Score
            </th>

            {/* Patient Status (KEEPING ALL YOUR CLASSES) */}
            <th className="w-[200px] px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              <button
                ref={statusBtnRef}
                onClick={() =>
                  setActiveFilter(activeFilter === "status" ? null : "status")
                }
                className="flex items-center gap-1 justify-between hover:text-gray-700 w-full"
              >
                Patient Status <HeaderIcon />
              </button>
              <FilterDropdown
                title="Patient Status"
                open={activeFilter === "status"}
                options={[
                  { key: "critical", label: "Critical" },
                  { key: "moderate", label: "Moderate" },
                  { key: "low", label: "Low Risk" },
                ]}
                selected={statusFilters}
                onChange={(k, v) => setStatusFilters((p) => ({ ...p, [k]: v }))}
                onClear={() =>
                  setStatusFilters({
                    critical: false,
                    low: false,
                    moderate: false,
                  })
                }
                onClose={() => setActiveFilter(null)}
                anchorRef={statusBtnRef}
              />
            </th>

            <th className="w-[300px] px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Created By
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Notes
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredReports.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="w-[160px] pr-4 py-3.5 text-sm text-gray-600">
                {r.date}
              </td>
              <td className="w-[80px] px-4 py-3.5 text-sm text-gray-600 text-center">
                {r.score}
              </td>
              <td className="w-[200px] px-4 py-3.5 text-sm text-gray-600">
                <DotTableRiskIndicator variant={r.risk} />
              </td>
              <td className="w-[300px] px-4 py-3.5 text-sm text-gray-600">
                {r.provider}
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-600">{r.notes}</td>
              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <ActionButton
                    variant="dark"
                    type="text"
                    label="View Report"
                    iconType="viewReport"
                  />
                  <ActionButton
                    variant="light"
                    type="icon"
                    iconType="edit"
                    ariaLabel="Edit Report"
                  />
                  <ActionButton
                    variant="light"
                    type="icon"
                    iconType="export"
                    ariaLabel="Export Report"
                  />
                </div>
              </td>
            </tr>
          ))}

          {filteredReports.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                No reports match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
