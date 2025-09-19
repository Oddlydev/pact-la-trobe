import React from "react";

type Variant = "dark" | "light";
type State = "default" | "hover" | "focus" | "active";

type Props = {
  variant: Variant;
  label?: string;
  state?: State;
  className?: string;
  disabled?: boolean;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

export default function FormButton({
  variant,
  label = "Form Button",
  state,
  className = "",
  disabled = false,
  onClick,
}: Props) {
  const forced = state !== undefined;
  const isHover = state === "hover";
  const isFocus = state === "focus";
  const isActive = state === "active";

  const base = [
    "inline-flex items-center justify-center rounded-md px-6 py-3",
    "transition-colors duration-150 select-none text-sm leading-5 font-dmsans font-medium",
    "border",
    disabled ? "cursor-not-allowed opacity-70" : "",
  ];

  let look = "";

  if (variant === "dark") {
    if (disabled) {
      look = "bg-gray-500 border-transparent text-white shadow-md";
    } else if (forced) {
      if (isHover) look = "bg-gray-900 border-transparent text-white shadow-md";
      else if (isFocus)
        look = "bg-gray-800 border-2 border-gray-900 text-white shadow-md";
      else if (isActive)
        look =
          "bg-gray-800 border-[0.5px] border-gray-900 text-white shadow-md";
      else look = "bg-gray-800 border-transparent text-white shadow-md";
    } else {
      look = [
        "bg-gray-800 border-transparent text-white shadow-md",
        "hover:bg-gray-900",
        "focus:border-2 focus:border-gray-900 focus:bg-gray-800",
        "active:border-[0.5px] active:border-gray-900 active:bg-gray-800",
      ].join(" ");
    }
  }

  if (variant === "light") {
    if (disabled) {
      look =
        "bg-white border border-gray-300 text-gray-400 shadow-sm cursor-not-allowed opacity-70";
    } else if (forced) {
      if (isHover)
        look = "bg-gray-50 border border-gray-300 text-gray-700 shadow-sm";
      else if (isFocus)
        look = "bg-white border-2 border-gray-400 text-gray-700 shadow-sm";
      else if (isActive)
        look = "bg-white border border-gray-400 text-gray-700 shadow-sm";
      else look = "bg-white border border-gray-300 text-gray-700 shadow-sm";
    } else {
      look = [
        "bg-white border border-gray-300 text-gray-700 shadow-sm",
        "hover:bg-gray-50",
        "focus:border-2 focus:border-gray-400 focus:bg-white",
        "active:border active:border-gray-400 active:bg-white",
      ].join(" ");
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[...base, look, className].join(" ")}
    >
      {label}
    </button>
  );
}
