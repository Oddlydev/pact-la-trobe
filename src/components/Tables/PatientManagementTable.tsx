import React from "react";
import ActionButton from "@/src/components/Buttons/ActionButtons";
import FormButton from "@/src/components/Buttons/FormButtons";

// Patient type
type Patient = {
  id: string;
  name: string;
  address: string;
  phone: string;
  gender: "M" | "F";
};

type Props = {
  patients: Patient[];
  onEdit: (p: Patient) => void;
  onDelete: (p: Patient) => void;
  onGenderFilterClick?: () => void;
  genderMenuOpen?: boolean;
  genderFilters?: { M: boolean; F: boolean; NA: boolean };
  onGenderFilterChange?: (key: "M" | "F" | "NA", checked: boolean) => void;
  onGenderFilterClear?: () => void;
  onGenderFilterClose?: () => void;
};

// Small header icon
const HeaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <g clip-path="url(#clip0_356_4995)">
      <path
        d="M6.00003 1.5C7.37738 1.5 8.72762 1.61602 10.0415 1.83883C10.308 1.88401 10.5 2.11677 10.5 2.38701V2.90901C10.5 3.20738 10.3815 3.49353 10.1705 3.7045L7.4545 6.4205C7.24353 6.63147 7.125 6.91762 7.125 7.21599V8.67971C7.125 9.10583 6.88425 9.49538 6.50312 9.68594L4.875 10.5V7.21599C4.875 6.91762 4.75647 6.63147 4.5455 6.4205L1.8295 3.7045C1.61853 3.49353 1.5 3.20738 1.5 2.90901V2.38702C1.5 2.11679 1.69204 1.88403 1.95847 1.83884C3.2724 1.61603 4.62266 1.5 6.00003 1.5Z"
        stroke="#0F172A"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_356_4995">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// Delete icon
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
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

export default function PatientManagementTable({
  patients,
  onEdit,
  onDelete,
  onGenderFilterClick,
  genderMenuOpen,
  genderFilters,
  onGenderFilterChange,
  onGenderFilterClear,
  onGenderFilterClose,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200">
          <tr>
            <th className="pr-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Patient ID
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Patient Name
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Address
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans">
              Contact No.
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-center relative" data-gender-filter>
              <button
                type="button"
                onClick={onGenderFilterClick}
                className="flex items-center justify-center gap-1 w-full hover:text-gray-700"
                aria-label="Open gender filter"
                data-gender-filter
              >
                Gender <HeaderIcon />
              </button>
              {genderMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-3 z-20" data-gender-filter>
                  <p className="px-1 pb-2 text-xs font-medium text-gray-500 text-left">Filter by gender</p>
                  {([
                    { key: "M", label: "Men" },
                    { key: "F", label: "Women" },
                    { key: "NA", label: "Not Prefer" },
                  ] as const).map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 py-1 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={Boolean(genderFilters && (genderFilters as any)[opt.key])}
                        onChange={(e) => onGenderFilterChange?.(opt.key, e.target.checked)}
                        data-gender-filter
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                  <div className="mt-3 flex gap-2 justify-end">
                    <FormButton
                      variant="light"
                      label="Clear"
                      onClick={onGenderFilterClear}
                      className="!px-3 !py-1.5 !text-xs"
                    />
                    <FormButton
                      variant="dark"
                      label="Close"
                      onClick={onGenderFilterClose}
                      className="!px-3 !py-1.5 !text-xs"
                    />
                  </div>
                </div>
              )}
            </th>
            <th className="px-4 py-3.5 text-base font-semibold text-black leading-6 font-dmsans text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {patients.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="pr-4 py-3.5 text-sm text-gray-600">{p.id}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600">{p.name}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600">{p.address}</td>
              <td className="px-4 py-3.5 text-sm text-gray-600">{p.phone}</td>
              <td className="px-4 py-3.5 text-center text-sm text-gray-600">
                {p.gender}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap text-right">
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
                  >
                    <DeleteIcon />
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
