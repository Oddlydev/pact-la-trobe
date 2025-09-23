import React from "react";
import DotTableRiskIndicator from "@/src/components/Indicators/DotTableRiskIndicator";
import ActionButton from "@/src/components/Buttons/ActionButtons";

export type RiskLevel = "critical" | "high" | "moderate" | "low";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  status: RiskLevel;
  lastUpdated: string; // "03-MAY-2025 16:33"
};

type Props = {
  patients: Patient[];
};

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
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3334 1.33325H5.66675C5.66675 2.27606 5.66675 2.74747 5.95964 3.04036C6.25253 3.33325 6.72395 3.33325 7.66675 3.33325H8.33341C9.27621 3.33325 9.74761 3.33325 10.0405 3.04036C10.3334 2.74747 10.3334 2.27606 10.3334 1.33325Z"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 7.33325L5.66667 7.99992L7 6.33325"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.66675 11.3333H10.6667M8.66675 7.33325H10.6667"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.66016 11.2449H5.66682"
      stroke="black"
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
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.66667 1.33325H5C5 2.27606 5 2.74747 5.29289 3.04036C5.58579 3.33325 6.05719 3.33325 7 3.33325H7.66667C8.60947 3.33325 9.08087 3.33325 9.3738 3.04036C9.66667 2.74747 9.66667 2.27606 9.66667 1.33325Z"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66675 9.99992H7.33341M4.66675 7.33325H10.0001"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 12.6667H12M12 12.6667H10M12 12.6667V14.6667M12 12.6667V10.6667"
      stroke="black"
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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed text-left text-sm">
        <thead className="border-b border-slate-200">
          <tr>
            <th className="w-32 px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Patient ID
            </th>
            <th className="w-64 px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Patient Name
            </th>
            <th className="w-16 px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center">
              Age
            </th>
            <th className="w-24 px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center">
              <div className="flex items-center justify-center gap-1">
                Gender <HeaderIcon />
              </div>
            </th>
            <th className="w-32 px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center">
              <div className="flex items-center justify-center gap-1.5">
                Patient Status <HeaderIcon />
              </div>
            </th>
            <th className="w-48 px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              <div className="flex items-center gap-1.5">
                Last Updated Date <HeaderIcon />
              </div>
            </th>
            <th className="w-56 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {patients.map((p, idx) => (
            <tr key={p.id || idx}>
              <td className="px-4 py-3.5 font-dmsans text-sm text-gray-600">
                {p.id}
              </td>
              <td className="px-4 py-3.5 font-dmsans text-sm text-gray-600">
                {p.name}
              </td>
              <td className="px-4 py-3.5 text-center font-dmsans text-sm text-gray-600">
                {p.age}
              </td>
              <td className="px-4 py-3.5 text-center font-dmsans text-sm text-gray-600">
                {p.gender}
              </td>
              <td className="px-4 py-3.5 text-center">
                <DotTableRiskIndicator variant={p.status} />
              </td>
              <td className="px-4 py-3.5 font-dmsans text-sm text-gray-600">
                <div className="flex flex-col">
                  <span>{p.lastUpdated.split(" ")[0]}</span>
                  <span className="text-xs text-gray-500">
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
                  />
                  <button className="flex items-center justify-center rounded-full border border-black p-2.5 hover:bg-gray-100">
                    <ReportIcon />
                  </button>
                  <button className="flex items-center justify-center rounded-full border border-black p-2.5 hover:bg-gray-100">
                    <NotesIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
