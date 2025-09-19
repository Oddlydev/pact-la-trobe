import React from "react";

type Variant = "dark" | "light";
type State = "default" | "hover" | "focus" | "active";
type IconType = "submit" | "cancel" | "addPatient" | undefined;

type Props = {
  variant: Variant;
  label: string;
  iconType?: IconType; // ✅ choose icon automatically
  state?: State;
  className?: string;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

/* ------------------------
   Icons
-------------------------*/
const SubmitIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    className={className}
  >
    <path
      d="M15.833 11.25V6.667c0-2.357 0-3.536-.732-4.268C14.368 1.667 13.19 1.667 10.833 1.667H7.5c-2.357 0-3.536 0-4.268.732C2.5 3.13 2.5 4.31 2.5 6.667v6.666c0 2.357 0 3.536.732 4.268.732.732 1.91.732 4.268.732H10"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.083 1.667H6.25c0 1.179 0 1.768.366 2.134.366.366.955.366 2.134.366h.833c1.179 0 1.768 0 2.134-.366.366-.366.366-.955.366-2.134Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.833 12.5h3.334M5.833 9.167h6.667"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.667 16.667s.834 0 1.667 1.667c0 0 1.814-4.167 4.167-5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CancelIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    className={className}
  >
    <path
      d="M16.042 11.667V6.667c0-2.357 0-3.536-.732-4.268-.732-.732-1.91-.732-4.268-.732H7.708c-2.357 0-3.536 0-4.268.732-.732.732-.732 1.91-.732 4.268v6.667c0 2.357 0 3.536.732 4.268.732.732 1.91.732 4.268.732h3.333"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.292 1.667H6.458c0 1.179 0 1.768.366 2.134.366.366.955.366 2.134.366h.834c1.178 0 1.767 0 2.133-.366.367-.366.367-.955.367-2.134Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.042 12.5h3.333M6.042 9.167h6.667"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m17.708 14.167-2.083 2.083m0 0-2.083 2.083m2.083-2.083 2.083 2.083m-2.083-2.083-2.083-2.083"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AddPatientIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M12.5 6.667C12.5 4.365 10.635 2.5 8.333 2.5 6.032 2.5 4.167 4.365 4.167 6.667c0 2.301 1.865 4.166 4.166 4.166 2.302 0 4.167-1.865 4.167-4.166Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.583 17.5v-5.833M11.667 14.583h5.833"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 16.667c0-3.222 2.612-5.834 5.833-5.834 1.24 0 2.389.387 3.334 1.046"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------
   Main Button
-------------------------*/
export default function PrimaryButton({
  variant,
  label,
  iconType,
  state,
  className = "",
  onClick,
}: Props) {
  const forced = state !== undefined;
  const isHover = state === "hover";
  const isFocus = state === "focus";
  const isActive = state === "active";

  const base = [
    "inline-flex items-center justify-center gap-2",
    "rounded-full px-4 py-2.5",
    "transition-colors duration-150 select-none",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  ];

  let look = "";
  let ring = "";

  if (variant === "dark") {
    ring = "focus-visible:ring-white/80 focus-visible:ring-offset-black";
    look = [
      "border border-gray-300 bg-black text-white",
      "hover:bg-white hover:text-black hover:border-black",
      "focus:border focus:border-gray-400",
      "active:bg-gray-800 active:text-white",
    ].join(" ");
  }

  if (variant === "light") {
    ring = "focus-visible:ring-black/30 focus-visible:ring-offset-white";
    look = [
      "border border-black bg-white text-black",
      "hover:bg-black hover:text-white hover:border-black",
      "focus:border focus:border-gray-400",
      "active:bg-gray-100 active:text-black",
    ].join(" ");
  }

  // ✅ choose icon
  let Icon: React.ReactNode = null;
  if (iconType === "submit") Icon = <SubmitIcon className="h-5 w-5" />;
  if (iconType === "cancel") Icon = <CancelIcon className="h-5 w-5" />;
  if (iconType === "addPatient") Icon = <AddPatientIcon className="h-5 w-5" />;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[...base, look, ring, className].join(" ")}
    >
      {Icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}
