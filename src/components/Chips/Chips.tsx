import React, { useState } from "react";

export type ChipProps = {
  label: string;
  count?: number | string;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
  badgeClassName?: string; // full "bg-red-600 text-white"
};

const colorMap: Record<string, string> = {
  "red-600": "text-red-600",
  "orange-500": "text-orange-500",
  "amber-500": "text-amber-500",
  "green-600": "text-green-600",
  "slate-900": "text-slate-900",
  "gray-800": "text-gray-800",
};

export default function Chip({
  label,
  count,
  selected,
  defaultSelected = false,
  onSelectedChange,
  className = "",
  badgeClassName,
}: ChipProps) {
  const [internal, setInternal] = useState(defaultSelected);
  const isSelected = selected ?? internal;

  const toggle = () => {
    const next = !isSelected;
    setInternal(next);
    onSelectedChange?.(next);
  };

  const base = [
    "inline-flex items-center gap-2 rounded-md",
    "px-3.5 py-2 text-sm",
    "font-semibold transition-colors ring-1",
    isSelected
      ? "bg-gray-800 text-white ring-gray-800"
      : "bg-white text-black ring-brand-8 hover:bg-[rgba(0,0,0,0.00)]",
    className,
  ].join(" ");

  // Extract the "bg-xxx" token
  const bgMatch = badgeClassName?.match(/bg-(\S+)/);
  const bgColor = bgMatch ? bgMatch[1] : "gray-800"; // fallback
  const activeTextColor = colorMap[bgColor] ?? "text-gray-800";

  const badge = [
    "inline-flex items-center justify-center rounded-full font-extrabold",
    "h-5 w-5 text-xs",
    isSelected
      ? `bg-white ${activeTextColor}`
      : (badgeClassName ?? "bg-gray-800 text-white"),
  ].join(" ");

  return (
    <button
      type="button"
      className={base}
      onClick={toggle}
      aria-pressed={isSelected}
    >
      <span>{label}</span>
      {typeof count !== "undefined" && <span className={badge}>{count}</span>}
    </button>
  );
}
