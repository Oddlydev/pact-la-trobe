import React from "react";
import OverallSeverityIndicator from "../Indicators/OverallSeverityIndicator";

type SeverityLevel = "critical" | "high" | "moderate" | "low";

const severityConfig: Record<
  SeverityLevel,
  { border: string; description: string }
> = {
  critical: {
    border: "border-red-600",
    description:
      "Urgent response required: Initiate palliative care referral, family discussion, and MDT",
  },
  high: {
    border: "border-orange-500",
    description:
      "Multidisciplinary case review. Engage palliative care team. Review documentation and Section 6.",
  },
  moderate: {
    border: "border-amber-400",
    description:
      "Begin proactive planning: review symptoms, involve ACP team if applicable.",
  },
  low: {
    border: "border-green-600",
    description:
      "Continue current care. Monitor and reassess in 1–2 weeks. Document clearly in Section 7.",
  },
};

type Props = {
  score: number;
  total: number;
  limit?: number;
};

function getSeverity(score: number, total: number): SeverityLevel {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.8) return "critical";
  if (ratio >= 0.6) return "high";
  if (ratio >= 0.3) return "moderate";
  return "low";
}

export default function OverallSeverityCards({ score, total, limit }: Props) {
  const level = getSeverity(score, total);
  const cfg = severityConfig[level];
  const progress = total > 0 ? Math.round((score / total) * 100) : 0;

  const cards: { level: SeverityLevel; score: number; total: number }[] = [
    { level, score, total },
  ];

  const visibleCards =
    typeof limit === "number" ? cards.slice(0, limit) : cards;

  return (
    <div className="space-y-3">
      {visibleCards.map(({ level, score, total }) => {
        const cfg = severityConfig[level];
        return (
          <div
            key={level}
            className="bg-white rounded-xl box-shadow-[inset_0_0_20px_rgba(171,190,194,0.40)] p-3 flex flex-col gap-3.5"
          >
            {/* Title */}
            <h3 className="text-gray-800 font-dm text-base font-semibold leading-6 tracking-normal">
              Overall Risk Stratification
            </h3>

            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-600 font-dm text-sm font-medium leading-5 tracking-normal">
                  Progress
                </p>
                <p className="text-gray-600 font-dm text-sm font-semibold leading-5 tracking-normal">
                  {progress}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Risk Indicator */}
            <OverallSeverityIndicator variant={level} />

            {/* Description & Score */}
            <div className="flex items-center gap-3 self-stretch">
              <p className="flex-1 text-gray-600 font-dm text-sm font-normal leading-5 tracking-normal">
                {cfg.description}
              </p>

              {/* Fraction Score Circle */}
              <div
                className={`flex flex-col justify-center items-center w-[55px] h-[55px] rounded-full border-4 ${cfg.border}`}
              >
                <span className="font-lexend text-xl font-medium leading-[20px] underline text-center text-black">
                  {score}
                </span>
                <span className="font-lexend text-xs font-normal leading-[120%] text-black">
                  {total}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
