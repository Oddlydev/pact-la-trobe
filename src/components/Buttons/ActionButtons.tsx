import React from "react";

type Variant = "dark" | "light";
type ButtonType = "icon" | "text";
type State = "default" | "hover" | "focus" | "active";

type Props = {
  variant: Variant;
  type: ButtonType;
  label?: string;
  ariaLabel?: string;
  iconType?: "edit" | "export" | "viewPatient" | "viewReport";
  state?: State;
  className?: string;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

// Person icon (fallback)
const PersonIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M12.5 6.66667C12.5 4.36548 10.6345 2.5 8.33329 2.5C6.03211 2.5 4.16663 4.36548 4.16663 6.66667C4.16663 8.96783 6.03211 10.8333 8.33329 10.8333C10.6345 10.8333 12.5 8.96783 12.5 6.66667Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14.5833 17.5V11.6666M11.6666 14.5833H17.5"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M2.5 16.6667C2.5 13.445 5.11168 10.8334 8.33333 10.8334C9.57267 10.8334 10.7218 11.2199 11.6667 11.879"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

// Edit Report icon
const EditIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    className={className}
  >
    <path
      d="M12.6667 8.08998V5.42334C12.6667 3.53772 12.6667 2.59491 12.0809 2.00913C11.4951 1.42334 10.5523 1.42334 8.66667 1.42334H6C4.11438 1.42334 3.17157 1.42334 2.58579 2.00913C2 2.59491 2 3.53772 2 5.42334V10.7566C2 12.6423 2 13.5851 2.58579 14.1709C3.17157 14.7566 4.11438 14.7566 6 14.7566H7.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.66667 1.42334H5C5 2.36615 5 2.83755 5.29289 3.13045C5.58579 3.42334 6.05719 3.42334 7 3.42334H7.66667C8.60947 3.42334 9.08087 3.42334 9.3738 3.13045C9.66667 2.83755 9.66667 2.36615 9.66667 1.42334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66663 10.0895H7.33329M4.66663 7.42285H9.99996"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4912 14.5249L9.33337 14.7565L9.56491 13.5987C9.61197 13.3635 9.72757 13.1476 9.89711 12.978L12.6074 10.2677C12.8446 10.0305 13.2292 10.0305 13.4664 10.2677L13.8222 10.6235C14.0593 10.8607 14.0593 11.2453 13.8222 11.4825L11.1118 14.1927C10.9423 14.3623 10.7263 14.4779 10.4912 14.5249Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Export/Share icon
const ExportIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    className={className}
  >
    <path
      d="M12.6667 7.42334C12.6667 6.87834 12.6667 6.37707 12.5652 6.13205C12.4637 5.88702 12.271 5.69433 11.8856 5.30896L8.72793 2.15126C8.39533 1.81867 8.22907 1.65237 8.023 1.55384C7.98013 1.53334 7.93627 1.51515 7.89147 1.49935C7.67607 1.42334 7.44093 1.42334 6.97053 1.42334C4.80721 1.42334 3.72554 1.42334 2.99289 2.01405C2.84487 2.13339 2.71005 2.26821 2.59071 2.41623C2 3.14888 2 4.23055 2 6.3939V9.42334C2 11.9375 2 13.1946 2.78105 13.9756C3.5621 14.7567 4.81917 14.7567 7.33333 14.7567H12.6667M8 1.75667V2.09001C8 3.97563 8 4.91843 8.5858 5.50422C9.1716 6.09001 10.1144 6.09001 12 6.09001H12.3333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 9.42334H12.6666C12.2984 9.42334 12 9.72181 12 10.09V11.09M12 11.09V12.7567M12 11.09H13.6666M4.66663 12.7567V11.4233M4.66663 11.4233V9.42334H5.66663C6.21891 9.42334 6.66663 9.87107 6.66663 10.4233C6.66663 10.9756 6.21891 11.4233 5.66663 11.4233H4.66663ZM8.33329 9.42334H9.19043C9.82163 9.42334 10.3333 9.92081 10.3333 10.5345V11.6455C10.3333 12.2592 9.82163 12.7567 9.19043 12.7567H8.33329V9.42334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// View Patient icon (provided)
const ViewPatientIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M13.3334 14.6665V12.6665C13.3334 10.7809 13.3334 9.83804 12.7476 9.2523C12.1618 8.6665 11.219 8.6665 9.33341 8.6665H6.66675C4.78113 8.6665 3.83832 8.6665 3.25253 9.2523C2.66675 9.83804 2.66675 10.7809 2.66675 12.6665C2.66675 13.2878 2.66675 13.5984 2.76824 13.8434C2.90357 14.1701 3.16313 14.4296 3.48983 14.565C3.73487 14.6665 4.04549 14.6665 4.66675 14.6665"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33341 8.6665L8.33341 14.6665M4.66675 8.99984V14.6665"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12.6665H9.66667C10.2189 12.6665 10.6667 13.1142 10.6667 13.6665C10.6667 14.2188 10.2189 14.6665 9.66667 14.6665H8.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3334 4.33325V3.66659C10.3334 2.37792 9.28875 1.33325 8.00008 1.33325C6.71141 1.33325 5.66675 2.37792 5.66675 3.66659V4.33325C5.66675 5.62192 6.71141 6.66658 8.00008 6.66658C9.28875 6.66658 10.3334 5.62192 10.3334 4.33325Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// View Report icon (provided)
const ViewReportIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    className={className}
  >
    <path
      d="M13.3333 10.7567V5.42334C13.3333 3.53772 13.3333 2.59491 12.7475 2.00913C12.1617 1.42334 11.2189 1.42334 9.33329 1.42334H6.66663C4.78101 1.42334 3.8382 1.42334 3.25241 2.00913C2.66663 2.59491 2.66663 3.53772 2.66663 5.42334V10.7567C2.66663 12.6423 2.66663 13.5851 3.25241 14.1709C3.8382 14.7567 4.78101 14.7567 6.66663 14.7567H9.33329C11.2189 14.7567 12.1617 14.7567 12.7475 14.1709C13.3333 13.5851 13.3333 12.6423 13.3333 10.7567Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3333 1.42334H5.66663C5.66663 2.36615 5.66663 2.83755 5.95952 3.13045C6.25241 3.42334 6.72383 3.42334 7.66663 3.42334H8.33329C9.27609 3.42334 9.74749 3.42334 10.0404 3.13045C10.3333 2.83755 10.3333 2.36615 10.3333 1.42334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 7.42334L5.66667 8.09001L7 6.42334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.66663 11.4233H10.6666M8.66663 7.42334H10.6666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.66016 11.3345H5.66682"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ActionButton({
  variant,
  type,
  label = "View Patient",
  ariaLabel = "Action",
  iconType,
  state,
  className = "",
  onClick,
}: Props) {
  const forced = !!state;
  const isHover = state === "hover";
  const isFocus = state === "focus";
  const isActive = state === "active";
  const isDefault = state === "default" || !state;

  const base =
    type === "icon"
      ? [
          "inline-flex items-center justify-center rounded-full h-10 w-10 border transition-all duration-150 select-none",
        ]
      : [
          "inline-flex items-center gap-1 text-sm font-medium rounded-full leading-none p-2.5 border transition-all duration-150 select-none",
        ];

  let look = "";
  let textColor = "";

  if (variant === "dark") {
    // Default: bg-black, icon white
    textColor = "text-white";
    if (forced) {
      if (isHover) {
        look = "border border-black bg-white text-black";
        textColor = "text-black";
      } else if (isFocus) {
        look = "border-2 border-gray-300 bg-black text-white";
      } else if (isActive) {
        look = "border border-gray-300 bg-black text-white";
      } else if (isDefault) {
        look = "border border-gray-300 bg-black text-white";
      }
    } else {
      look = [
        "border border-gray-300 bg-black text-white", // default
        "hover:border-black hover:bg-white hover:text-black", // hover
        "focus:border-2 focus:border-gray-300 focus:bg-black focus:text-white", // focus
        "active:border active:border-gray-300 active:bg-black active:text-white", // active
      ].join(" ");
    }
  }

  if (variant === "light") {
    // Default: black icon, on hover: white icon
    textColor = "text-black hover:text-white";
    if (forced) {
      if (isHover) {
        look = "border border-gray-300 bg-black text-white";
      } else if (isFocus) {
        look = "border-2 border-brand-3 text-black";
      } else if (isActive) {
        look = "border border-brand-3 text-black";
      } else if (isDefault) {
        look = "border border-brand-3 text-black";
      }
    } else {
      look = [
        "border border-brand-3 bg-[rgba(0, 0, 0, 0.00);] text-black", // default
        "hover:border-gray-300 hover:bg-black hover:text-white", // hover
        "focus:border-2 focus:border-brand-3", // focus
        "active:border active:border-brand-3", // active
      ].join(" ");
    }
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[...base, look, textColor, className].join(" ")}
    >
      {iconType === "edit" ? (
        <EditIcon className="h-5 w-5" />
      ) : iconType === "export" ? (
        <ExportIcon className="h-5 w-5" />
      ) : iconType === "viewPatient" ? (
        <ViewPatientIcon className="h-5 w-5" />
      ) : iconType === "viewReport" ? (
        <ViewReportIcon className="h-5 w-5" />
      ) : (
        <PersonIcon className="h-5 w-5" />
      )}
      {type === "text" && <span className="font-semibold">{label}</span>}
    </button>
  );
}
