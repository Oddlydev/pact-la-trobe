import React from "react";
import DotTableRiskIndicator from "@/src/components/Indicators/DotTableRiskIndicator";
import ActionButton from "@/src/components/Buttons/ActionButtons";

// Small header filter/sort icon
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

// Report type
type Report = {
  id: number;
  date: string;
  score: number;
  risk: "critical" | "low" | "moderate";
  provider: string;
  notes: string;
};

type Props = {
  reports: Report[];
};

export default function ReportsTable({ reports }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        {/* Table Header */}
        <thead className="border-b border-slate-200">
          <tr>
            <th className="w-[160px] pr-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              <div className="flex items-center gap-1 justify-between">
                Report Date <HeaderIcon />
              </div>
            </th>
            <th className="w-[80px] px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center">
              Score
            </th>
            <th className="w-[200px] px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              <div className="flex items-center gap-1 justify-between">
                Patient Status <HeaderIcon />
              </div>
            </th>
            <th className="w-[300px] px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Created By
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Notes
            </th>
            {/* ✅ Keep header left-aligned, like PatientManagementTable */}
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-left">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">
          {reports.map((r) => (
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
              {/* ✅ Row actions aligned right */}
              <td className="px-4 py-3.5 whitespace-nowrap text-right">
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
                  <ActionButton variant="light" type="icon" ariaLabel="Share" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
