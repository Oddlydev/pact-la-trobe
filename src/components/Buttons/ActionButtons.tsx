import React from "react";

type Variant = "dark" | "light";
type ButtonType = "icon" | "text";
type State = "default" | "hover" | "focus" | "active";

type Props = {
  variant: Variant;
  type: ButtonType;
  label?: string;
  ariaLabel?: string;
  state?: State;
  className?: string;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

// Person icon (inherits text color via currentColor)
const PersonIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M13.3333 14.6666V12.6666C13.3333 10.781 13.3333 9.83811 12.7475 9.25238C12.1617 8.66658 11.2189 8.66658 9.33332 8.66658H6.66666C4.78104 8.66658 3.83823 8.66658 3.25244 9.25238C2.66666 9.83811 2.66666 10.781 2.66666 12.6666C2.66666 13.2878 2.66666 13.5984 2.76815 13.8434C2.90348 14.1702 3.16304 14.4297 3.48974 14.565C3.73478 14.6666 4.0454 14.6666 4.66666 14.6666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.33332 8.66658L8.33332 14.6666M4.66666 8.99991V14.6666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12.6666H9.66667C10.2189 12.6666 10.6667 13.1143 10.6667 13.6666C10.6667 14.2188 10.2189 14.6666 9.66667 14.6666H8.33333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3333 4.33336V3.66669C10.3333 2.37803 9.28866 1.33336 7.99999 1.33336C6.71132 1.33336 5.66666 2.37803 5.66666 3.66669V4.33336C5.66666 5.62203 6.71132 6.66669 7.99999 6.66669C9.28866 6.66669 10.3333 5.62203 10.3333 4.33336Z"
      stroke="currentColor"
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
          "inline-flex items-center gap-2 text-sm font-medium rounded-full p-2.5 border transition-all duration-150 select-none",
        ];

  let look = "";
  let textColor = "";

  if (variant === "dark") {
    // Default: bg-black, icon white
    textColor = "text-white";
    if (forced) {
      if (isHover) {
        look = "border border-black bg-[rgba(0, 0, 0, 0.00);] text-black";
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
        "hover:border-black hover:bg-[rgba(0, 0, 0, 0.00);] hover:text-black", // hover
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
      <PersonIcon className="h-5 w-5" />
      {type === "text" && <span className="font-semibold">{label}</span>}
    </button>
  );
}
