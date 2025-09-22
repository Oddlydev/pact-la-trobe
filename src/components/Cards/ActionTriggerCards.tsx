import React from "react";

type RiskLevel = "low" | "moderate" | "high";

type ActionTriggerCardProps = {
  date: string;
  action: string;
  risk: RiskLevel;
};

const riskConfig: Record<RiskLevel, { leftBorder: string; glow: string }> = {
  low: {
    leftBorder: "border-l-green-600",
    glow: "group-hover:shadow-green-600/40",
  },
  moderate: {
    leftBorder: "border-l-amber-400",
    glow: "group-hover:shadow-amber-400/40",
  },
  high: {
    leftBorder: "border-l-red-600",
    glow: "group-hover:shadow-red-600/40",
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
        "border border-white/10", // full faint border
        "border-l-3",
        cfg.leftBorder, // apply severity color to left
        "transition-all duration-300",
        "shadow-[inset_0_0_50px_-2px_rgba(253,230,138,0.14),0_0_6px_-1px_rgba(0,0,0,0.25)]", // default shadow
        "hover:rounded-lg hover:bg-[rgba(0, 0, 0, 0.00);] hover:shadow-[0_0_6px_-1px_rgba(0,0,0,0.25)]", // hover shadow
      ].join(" ")}
    >
      <p className="text-sm font-medium text-gray-500">{date}</p>
      <p className="mt-1 text-base font-normal text-brand-3">{action}</p>
    </div>
  );
}
