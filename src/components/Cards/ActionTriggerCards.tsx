import React from "react";

type RiskLevel = "low" | "moderate" | "high";

type ActionTriggerCardProps = {
  date: string;
  action: string;
  risk: RiskLevel;
};

const riskConfig: Record<RiskLevel, { leftBorder: string; shadow: string }> = {
  low: {
    leftBorder: "border-l-green-600",
    shadow:
      "shadow-[inset_0_0_50px_-2px_rgba(187,247,208,0.14),0_0_6px_-1px_rgba(0,0,0,0.25)]",
  },
  moderate: {
    leftBorder: "border-l-amber-400",
    shadow:
      "shadow-[inset_0_0_50px_-2px_rgba(253,230,138,0.14),0_0_6px_-1px_rgba(0,0,0,0.25)]",
  },
  high: {
    leftBorder: "border-l-red-600",
    shadow:
      "shadow-[inset_0_0_50px_-2px_rgba(254,202,202,0.14),0_0_6px_-1px_rgba(0,0,0,0.25)]",
  },
};

export default function ActionTriggerCard({
  date,
  action,
  risk,
}: ActionTriggerCardProps) {
  const cfg = riskConfig[risk];

  return (
    <div
      className={[
        "group rounded-lg p-4 bg-[rgba(0,0,0,0.00)]",
        "bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-md",
        "border border-white/10", // faint border
        "border-l-3",
        cfg.leftBorder,
        "transition-all duration-300",
        cfg.shadow, // risk-based shadow
        "hover:shadow-[0_0_6px_-1px_rgba(0,0,0,0.25)]", // hover effect
      ].join(" ")}
    >
      <p className="text-sm font-medium text-gray-500">{date}</p>
      <p className="mt-1 text-base font-normal text-brand-3">{action}</p>
    </div>
  );
}
