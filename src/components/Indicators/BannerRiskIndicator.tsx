import React from "react";

type Variant = "critical" | "high" | "moderate" | "low";

type Props = {
  variant: Variant;
  label?: string;
  className?: string;
};

const styles: Record<
  Variant,
  { bg: string; text: string; defaultLabel: string; width: string }
> = {
  critical: {
    bg: "bg-red-600",
    text: "text-gray-50",
    defaultLabel: "CRITICAL/PRIORITY",
    width: "w-32",
  },
  high: {
    bg: "bg-orange-500",
    text: "text-gray-900",
    defaultLabel: "HIGH RISK",
    width: "w-20",
  },
  moderate: {
    bg: "bg-amber-400",
    text: "text-gray-900",
    defaultLabel: "MODERATE RISK",
    width: "w-28",
  },
  low: {
    bg: "bg-green-600",
    text: "text-gray-900",
    defaultLabel: "LOW RISK",
    width: "w-20",
  },
};

export default function BannerRiskIndicator({
  variant,
  label,
  className = "",
}: Props) {
  const cfg = styles[variant];

  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-sm px-2 py-2.5 text-xs font-semibold uppercase tracking-normal font-dmsans",
        cfg.bg,
        cfg.text,
        cfg.width,
        className,
      ].join(" ")}
    >
      {label || cfg.defaultLabel}
    </div>
  );
}
