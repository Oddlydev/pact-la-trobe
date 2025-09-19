import React from "react";

type Variant = "dark" | "light";
type State = "default" | "hover" | "focus" | "active";

type Props = {
  variant: Variant;
  label?: string;
  state?: State;
  className?: string;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

const AddPatientIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      d="M12.5 6.66667C12.5 4.36548 10.6345 2.5 8.33333 2.5C6.03215 2.5 4.16667 4.36548 4.16667 6.66667C4.16667 8.96783 6.03215 10.8333 8.33333 10.8333C10.6345 10.8333 12.5 8.96783 12.5 6.66667Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5833 17.5V11.6667M11.6667 14.5833H17.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 16.6667C2.5 13.445 5.11168 10.8333 8.33333 10.8333C9.57267 10.8333 10.7218 11.2198 11.6667 11.8789"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PrimaryButton({
  variant,
  label = "Add Patient",
  state,
  className = "",
  onClick,
}: Props) {
  const forced = state !== undefined;
  const isHover = state === "hover";
  const isFocus = state === "focus";
  const isActive = state === "active";

  const base = [
    "inline-flex items-center justify-center gap-1",
    "rounded-full px-3 py-2.5",
    "transition-colors duration-150 select-none",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  ];

  let look = "";
  let ring = "";

  if (variant === "dark") {
    ring = "focus-visible:ring-white/80 focus-visible:ring-offset-black";

    if (forced) {
      if (isHover) {
        // Hover
        look =
          "rounded-full border-[0.5px] border-brand-3 bg-brand-2 text-black";
      } else if (isFocus) {
        // Focus
        look = "rounded-full border-2 border-gray-300 bg-brand-3 text-white";
      } else if (isActive) {
        // Active
        look = "rounded-full border border-gray-300 bg-brand-3 text-white";
      } else {
        // Default
        look =
          "rounded-full border-[0.5px] border-gray-300 bg-brand-3 text-white";
      }
    } else {
      look = [
        // Default
        "rounded-full border-[0.5px] border-gray-300 bg-brand-3 text-white",
        // Hover
        "hover:border-[0.5px] hover:border-brand-3 hover:bg-brand-2 hover:text-black",
        // Focus
        "focus:border-2 focus:border-gray-300 focus:bg-brand-3 focus:text-white",
        // Active
        "active:border active:border-gray-300 active:bg-brand-3 active:text-white",
      ].join(" ");
    }
  }

  if (variant === "light") {
    ring = "focus-visible:ring-brand-3/80 focus-visible:ring-offset-white";

    if (forced) {
      if (isHover) {
        look =
          "rounded-full border-[0.5px] border-brand-2 bg-brand-3 text-white";
      } else if (isFocus) {
        look = "rounded-full border-2 border-brand-3 bg-brand-2 text-black";
      } else if (isActive) {
        look = "rounded-full border border-brand-3 bg-brand-2 text-black";
      } else {
        // Default
        look =
          "rounded-full border-[0.5px] border-brand-3 bg-brand-2 text-black";
      }
    } else {
      look = [
        // Default
        "rounded-full border-[0.5px] border-brand-3 bg-brand-2 text-black",
        // Hover
        "hover:border-[0.5px] hover:border-brand-2 hover:bg-brand-3 hover:text-white",
        // Focus
        "focus:border-2 focus:border-brand-3 focus:bg-brand-2 focus:text-black",
        // Active
        "active:border active:border-brand-3 active:bg-brand-2 active:text-black",
      ].join(" ");
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={[...base, look, ring, className].join(" ")}
    >
      <AddPatientIcon
        className={
          forced && isHover ? "h-5 w-5 text-black" : "h-5 w-5 text-current"
        }
      />
      <span className="font-semibold">{label}</span>
    </button>
  );
}
