import React from "react";

type Variant = "critical" | "high" | "moderate" | "low";

type Props = {
  variant: Variant;
  label?: string;
  className?: string;
};

const styles: Record<
  Variant,
  { border: string; text: string; dot: string; defaultLabel: string }
> = {
  critical: {
    border: "border-red-600",
    text: "text-gray-900",
    dot: "#B91C1C",
    defaultLabel: "CRITICAL",
  },
  high: {
    border: "border-orange-500",
    text: "text-gray-900",
    dot: "#F97316",
    defaultLabel: "HIGH RISK",
  },
  moderate: {
    border: "border-amber-400",
    text: "text-gray-900",
    dot: "#FBBF24",
    defaultLabel: "MOD. RISK",
  },
  low: {
    border: "border-green-600",
    text: "text-gray-900",
    dot: "#16A34A",
    defaultLabel: "LOW RISK",
  },
};

export default function DotTableRiskIndicator({
  variant,
  label,
  className = "",
}: Props) {
  const cfg = styles[variant];

  return (
    <div
      className={[
        "w-full rounded-sm px-2 py-2.5 gap-x-2.5 flex justify-center items-center border",
        cfg.border,
        cfg.text,
        className,
      ].join(" ")}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <circle cx="5" cy="5" r="5" fill={cfg.dot} />
        </svg>
      </div>
      <span className=" text-xs text-center font-semibold font-dmsans uppercase tracking-normal">
        {label || cfg.defaultLabel}
      </span>
    </div>
  );
}
