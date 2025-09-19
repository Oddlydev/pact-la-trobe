import React from "react";

type Variant = "critical" | "high" | "moderate" | "low";

type Props = {
  variant: Variant;
  label?: string;
  className?: string;
};

const styles: Record<
  Variant,
  { bg: string; text: string; defaultLabel: string }
> = {
  critical: {
    bg: "bg-red-600",
    text: "text-white",
    defaultLabel: "CRITICAL/PRIORITY",
  },
  high: {
    bg: "bg-orange-500",
    text: "text-gray-900",
    defaultLabel: "HIGH RISK",
  },
  moderate: {
    bg: "bg-amber-400",
    text: "text-gray-900",
    defaultLabel: "MODERATE RISK",
  },
  low: {
    bg: "bg-green-600",
    text: "text-gray-900",
    defaultLabel: "LOW RISK",
  },
};

export default function OverallSeverityIndicator({
  variant,
  label,
  className = "",
}: Props) {
  const cfg = styles[variant];

  return (
    <div
      className={[
        "w-full rounded-sm px-2 py-2.5 text-xs text-center font-semibold uppercase tracking-normal font-dmsans",
        cfg.bg,
        cfg.text,
        className,
      ].join(" ")}
    >
      {label || cfg.defaultLabel}
    </div>
  );
}
