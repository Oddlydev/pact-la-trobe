import React, { useMemo, useState, useRef } from "react";
import ActionButton from "@/src/components/Buttons/ActionButtons";
import FilterDropdown from "@/src/components/Filters/FilterDropdown";

// ----------------- Types -----------------
export type Patient = {
  id: string;
  name: string;
  address: string;
  phone: string;
  gender: "M" | "F" | "NA";
};

type Props = {
  patients: Patient[];
  onEdit: (p: Patient) => void;
  onDelete: (p: Patient) => void;
};

// ----------------- Icons -----------------
const HeaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden
  >
    <g clipPath="url(#clip0)">
      <path
        d="M6.00003 1.5C7.37738 1.5 8.72762 1.61602 10.0415 1.83883C10.308 1.88401 10.5 2.11677 10.5 2.38701V2.90901C10.5 3.20738 10.3815 3.49353 10.1705 3.7045L7.4545 6.4205C7.24353 6.63147 7.125 6.91762 7.125 7.21599V8.67971C7.125 9.10583 6.88425 9.49538 6.50312 9.68594L4.875 10.5V7.21599C4.875 6.91762 4.75647 6.63147 4.5455 6.4205L1.8295 3.7045C1.61853 3.49353 1.5 3.20738 1.5 2.90901V2.38702C1.5 2.11679 1.69204 1.88403 1.95847 1.83884C3.2724 1.61603 4.62266 1.5 6.00003 1.5Z"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden
  >
    <path
      d="M22.75 6.417 22.027 18.113c-.185 2.988-.277 4.482-1.026 5.556-.37.531-.847.98-1.4 1.317-1.118.681-2.615.681-5.609.681s-4.497 0-5.616-.683a4.3 4.3 0 0 1-1.4-1.318c-.749-1.076-.84-2.572-1.021-5.564L5.25 6.417"
      stroke="#E2231B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3.5 6.417h21M18.732 6.417l-.797-1.643c-.529-1.092-.793-1.638-1.25-1.979-.101-.076-.208-.144-.32-.202-.505-.262-1.111-.262-2.324-.262-1.243 0-1.865 0-2.378.273a2.1 2.1 0 0 0-.325.209c-.462.354-.72.92-1.236 2.051l-.707 1.55"
      stroke="#E2231B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M11.083 19.25v-7M16.917 19.25v-7"
      stroke="#E2231B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ----------------- Table -----------------
export default function PatientManagementTable({
  patients,
  onEdit,
  onDelete,
}: Props) {
  // Which dropdown is open
  const [activeFilter, setActiveFilter] = useState<"gender" | "region" | null>(
    null
  );

  // APPLIED gender filters (used by the table). These change ONLY when clicking "Filter".
  const [appliedGender, setAppliedGender] = useState<
    Record<"M" | "F" | "NA", boolean>
  >({ M: false, F: false, NA: false });

  // Provide the applied values to the dropdown so it can seed its temp state
  const genderBtnRef = useRef<HTMLButtonElement>(null);

  // --- Filtering logic using APPLIED filters ---
  const filteredPatients = useMemo(() => {
    const activeKeys = (
      Object.keys(appliedGender) as Array<"M" | "F" | "NA">
    ).filter((k) => appliedGender[k]);

    return patients.filter((p) => {
      if (activeKeys.length === 0) return true; // no filters selected
      return activeKeys.includes(p.gender);
    });
  }, [patients, appliedGender]);

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-slate-200">
          <tr>
            <th className="w-28 pr-4 py-3.5 text-base font-semibold text-black font-dmsans">
              Patient ID
            </th>
            <th className="w-64 px-4 py-3.5 text-base font-semibold text-black font-dmsans">
              Patient Name
            </th>
            <th className="w-64 px-4 py-3.5 text-base font-semibold text-black font-dmsans">
              Address
            </th>
            <th className="w-36 px-4 py-3.5 text-base font-semibold text-black font-dmsans">
              Contact No.
            </th>

            {/* Gender column header with dropdown */}
            <th className="w-24 px-4 py-3.5 text-base font-semibold text-black font-dmsans text-center">
              <button
                ref={genderBtnRef}
                type="button"
                onClick={() =>
                  setActiveFilter(activeFilter === "gender" ? null : "gender")
                }
                className="flex items-center justify-center gap-1 w-full hover:text-gray-700"
                aria-label="Open gender filter"
              >
                Gender <HeaderIcon />
              </button>

              <FilterDropdown
                title="Gender"
                open={activeFilter === "gender"}
                options={[
                  { key: "M", label: "Men" },
                  { key: "F", label: "Women" },
                  { key: "NA", label: "Not Prefer" },
                ]}
                selected={appliedGender} // seed temp with applied
                onApply={(sel) => {
                  // apply only when clicking Filter
                  // coerce keys to our exact union
                  const next: Record<"M" | "F" | "NA", boolean> = {
                    M: !!(sel as any).M,
                    F: !!(sel as any).F,
                    NA: !!(sel as any).NA,
                  };
                  setAppliedGender(next);
                }}
                onClear={() =>
                  setAppliedGender({ M: false, F: false, NA: false })
                }
                onClose={() => setActiveFilter(null)}
                anchorRef={genderBtnRef}
              />
            </th>

            <th className="w-20 py-3.5 pr-0 pl-0 text-base font-semibold text-black font-dmsans">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredPatients.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 align-top">
              <td className="pr-4 py-3.5 text-sm font-normal leading-5 text-gray-600 whitespace-nowrap">
                {p.id}
              </td>
              <td className="px-4 py-3.5 text-sm font-normal leading-5 text-gray-600 break-words">
                {p.name}
              </td>
              <td className="px-4 py-3.5 text-sm font-normal leading-5 text-gray-600 break-words">
                {p.address}
              </td>
              <td className="px-4 py-3.5 text-sm font-normal leading-5 text-gray-600 break-words">
                {p.phone}
              </td>
              <td className="pr-2 pl-2 py-3.5 text-center text-sm text-gray-600 whitespace-nowrap">
                {p.gender}
              </td>
              <td className="w-20 py-3.5 pr-0 pl-0 whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <ActionButton
                    variant="dark"
                    type="text"
                    label="Edit"
                    ariaLabel="Edit Patient"
                    onClick={() => onEdit(p)}
                  />
                  <button
                    onClick={() => onDelete(p)}
                    className="flex items-center justify-center"
                    aria-label="Delete Patient"
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {filteredPatients.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                No patients match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
