import React from "react";
import BannerRiskIndicator from "../Indicators/BannerRiskIndicator";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type PatientCardProps = {
  name: string;
  age: number;
  gender: string;
  risks: string[];
  score: number;
  riskLevel: RiskLevel;
  className?: string;
};

const riskStyles: Record<
  RiskLevel,
  {
    border: string;
    badge: string;
    score: string;
    scoreLabel: string;
    label: string;
  }
> = {
  low: {
    border: "border-l-green-600",
    badge: "bg-green-600 text-gray-900",
    score: "text-green-600",
    scoreLabel: "text-green-600",
    label: "LOW RISK",
  },
  moderate: {
    border: "border-l-amber-400",
    badge: "bg-amber-400 text-gray-900",
    score: "text-amber-400",
    scoreLabel: "text-amber-400",
    label: "MODERATE RISK",
  },
  high: {
    border: "border-l-orange-500",
    badge: "bg-orange-500 text-gray-900",
    score: "text-orange-500",
    scoreLabel: "text-orange-500",
    label: "HIGH RISK",
  },
  critical: {
    border: "border-l-red-600",
    badge: "bg-red-600 text-white",
    score: "text-red-600",
    scoreLabel: "text-red-600",
    label: "CRITICAL/PRIORITY",
  },
};

// Inline SVGs
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M4.89741 1.48862C5.75777 0.955544 6.5087 1.17037 6.95979 1.51256C7.14476 1.65286 7.23722 1.72302 7.29165 1.72302C7.34607 1.72302 7.43853 1.65286 7.62351 1.51256C8.0746 1.17037 8.82552 0.955544 9.68588 1.48862C10.815 2.18823 11.0705 4.49626 8.46607 6.44348C7.97001 6.81436 7.72197 6.99975 7.29165 6.99975C6.86132 6.99975 6.61329 6.81436 6.11722 6.44348C3.51278 4.49626 3.76828 2.18823 4.89741 1.48862Z"
      stroke="#4B5563"
      strokeWidth="0.875"
      strokeLinecap="round"
    />
    <path
      d="M2.33331 8.16669H3.73029C3.90188 8.16669 4.07111 8.20536 4.22458 8.27962L5.41573 8.85595C5.5692 8.93021 5.73843 8.96883 5.91002 8.96883H6.5182C7.10644 8.96883 7.58331 9.4303 7.58331 9.99952C7.58331 10.0225 7.56756 10.0427 7.5447 10.049L6.0625 10.4589C5.7966 10.5324 5.5119 10.5068 5.26456 10.3871L3.99121 9.77103"
      stroke="#4B5563"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.58331 9.62502L10.2624 8.80187C10.7374 8.65388 11.2508 8.82935 11.5483 9.24136C11.7634 9.53921 11.6758 9.9658 11.3624 10.1466L6.97834 12.6761C6.6995 12.837 6.3705 12.8763 6.06385 12.7853L2.33331 11.6783"
      stroke="#4B5563"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RiskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M8.12282 12.25H5.87722C3.17613 12.25 1.82559 12.25 1.3279 11.3714C0.830205 10.4929 1.52098 9.32832 2.90254 6.99912L4.02536 5.10611C5.35245 2.86871 6.016 1.75 7.00002 1.75C7.98405 1.75 8.64759 2.8687 9.97467 5.1061L11.0975 6.99912C12.479 9.32832 13.1698 10.4929 12.6721 11.3714C12.1744 12.25 10.8239 12.25 8.12282 12.25Z"
      stroke="#4B5563"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 5.25V7.875"
      stroke="#4B5563"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 9.91211V9.91711"
      stroke="#4B5563"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PatientCard({
  name,
  age,
  gender,
  risks,
  score,
  riskLevel,
  className = "",
}: PatientCardProps) {
  const styles = riskStyles[riskLevel];

  return (
    <div
      className={[
        "w-full rounded-lg p-4 text-white transition-all duration-300",
        "border-l-[3px] bg-[rgba(0,0,0,0.00)] font-dmsans",
        styles.border,
        "shadow-[inset_0_0_50px_-2px_rgba(254,215,170,0.14),0_0_6px_-1px_rgba(0,0,0,0.25)]",
        "hover:shadow-[0_0_6px_-1px_rgba(0,0,0,0.25)]",
        className,
      ].join(" ")}
    >
      {/* Badge + Score */}
      <div className="flex items-start justify-between">
        {/* Indicator + Name (stacked vertically with 20px gap) */}
        <div className="flex flex-col gap-5">
          <span
            className={[
              "px-2 py-1.5 text-xs font-semibold rounded-md uppercase w-fit",
              styles.badge,
            ].join(" ")}
          >
            {styles.label}
          </span>
          <h3 className="text-base font-semibold text-black">{name}</h3>
        </div>
        {/* Score */}
        <div className="flex flex-col items-end gap-1">
          {/* Main score */}
          <span
            className={["text-2xl font-bold leading-none", styles.score].join(
              " "
            )}
          >
            {score}
          </span>
          {/* Out of total */}
          <span className="text-xs text-gray-400">/53</span>
          {/* Label */}
          <p
            className={["text-[8px] font-normal", styles.scoreLabel].join(" ")}
          >
            PCAT Score
          </p>
        </div>
      </div>

      {/* Age / Gender */}
      <p className="text-sm text-gray-500 font-normal">
        Age: {age} • {gender}
      </p>

      {/* Risk list */}
      <ul className="mt-3 space-y-1 text-sm font-normal text-gray-500">
        {risks.map((r, i) => (
          <li key={i} className="flex items-center gap-2">
            {i % 2 === 0 ? <HeartIcon /> : <RiskIcon />}
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
