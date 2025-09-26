import React from "react";

type Severity = "low" | "moderate" | "high";

type SummaryCard = {
  step: number;
  title: string;
  score: number;
  total: number;
  severity: Severity;
  kps?: number;
  severityText?: string;
  description?: string;
  recommendation?: string;
  action?: string;
};

const severityCfg: Record<
  Severity,
  { label: string; numColor: string; labelColor: string; borderColor: string }
> = {
  low: {
    label: "Low Concern",
    numColor: "text-green-700",
    labelColor: "text-green-700",
    borderColor: "border-l-4 border-green-600",
  },
  moderate: {
    label: "Moderate Concern",
    numColor: "text-amber-700",
    labelColor: "text-amber-700",
    borderColor: "border-l-4 border-amber-700",
  },
  high: {
    label: "High Concern",
    numColor: "text-red-600",
    labelColor: "text-red-600",
    borderColor: "border-l-4 border-red-600",
  },
};

type Props = {
  sectionScores: Record<string, number>;
  totals: Record<string, number>;
};

function getSeverity(score: number, total: number): Severity {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.66) return "high";
  if (ratio >= 0.33) return "moderate";
  return "low";
}

// 🔹 Helper to generate text dynamically based on severity
function generateTexts(
  section: string,
  severity: Severity,
  score: number,
  total: number
): Pick<SummaryCard, "description" | "recommendation" | "action"> {
  if (severity === "low") {
    return {
      description: `Low concern: minimal issues detected in ${section.toLowerCase()}.`,
      recommendation: "Continue routine monitoring and reassessment.",
      action: "No urgent action required.",
    };
  }
  if (severity === "moderate") {
    return {
      description: `Moderate concern: partial issues identified in ${section.toLowerCase()}.`,
      recommendation: "Begin care planning and involve relevant teams.",
      action: "Action required within 1 week.",
    };
  }
  return {
    description: `High concern: significant issues in ${section.toLowerCase()}.`,
    recommendation: "Escalate care immediately with specialist involvement.",
    action:
      "Urgent response required (referral, MDT meeting, medication review).",
  };
}

export default function SummaryCards({ sectionScores, totals }: Props) {
  const cards: SummaryCard[] = [
    {
      step: 1,
      title: "Patient Identification & Functional Decline",
      score: sectionScores.s1,
      total: totals.s1,
      severity: getSeverity(sectionScores.s1, totals.s1),
      kps: 80,
    },
    {
      step: 2,
      title: "Symptom Burden & Unmet Needs",
      score: sectionScores.s2,
      total: totals.s2,
      severity: getSeverity(sectionScores.s2, totals.s2),
    },
    {
      step: 3,
      title: "Condition-Specific Indicators",
      score: sectionScores.s3,
      total: totals.s3,
      severity: getSeverity(sectionScores.s3, totals.s3),
    },
    {
      step: 4,
      title: "Psychosocial & Advance Care Planning",
      score: sectionScores.s4,
      total: totals.s4,
      severity: getSeverity(sectionScores.s4, totals.s4),
      severityText: "Psychological Risk",
    },
    {
      step: 5,
      title: "Holistic, Social and Cultural Needs",
      score: sectionScores.s5,
      total: totals.s5,
      severity: getSeverity(sectionScores.s5, totals.s5),
      severityText: "Support Needs",
    },
    {
      step: 6,
      title: "Clinical Action & Referrals",
      score: sectionScores.s6,
      total: totals.s6,
      severity: getSeverity(sectionScores.s6, totals.s6),
      severityText: "Referral Urgency",
    },
    {
      step: 7,
      title: "Documentation & Communication",
      score: sectionScores.s7,
      total: totals.s7,
      severity: getSeverity(sectionScores.s7, totals.s7),
      severityText: "Documentation Quality",
    },
  ].map((c) => ({
    ...c,
    ...generateTexts(c.title, c.severity, c.score, c.total),
  }));

  const renderCard = (c: SummaryCard, i: number) => {
    const cfg = severityCfg[c.severity];
    const showExtras = c.step > 5; // ✅ only show recommendation/action for step 6 and 7

    return (
      <div
        key={i}
        className={`rounded-xl bg-white shadow p-3 ${cfg.borderColor}`}
      >
        {/* Wrapper */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between gap-1">
            {/* Left: Step + Title */}
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 aspect-square rounded-full bg-black text-white text-xs">
                {c.step}
              </span>
              <h3 className="text-sm leading-5 font-semibold text-black font-dmsans">
                {c.title}
              </h3>
            </div>

            {/* Right: Score */}
            <div className="ml-2 flex flex-col items-end leading-none">
              <span
                className={`overflow-hidden text-ellipsis ${cfg.numColor} text-2xl leading-6 font-semibold font-dmsans`}
              >
                {c.score}
              </span>
              <span className="text-gray-500 text-right text-xs font-light font-dmsans">
                /{c.total}
              </span>
            </div>
          </div>

          {/* Severity + optional KPS */}
          {(c.severityText || typeof c.kps !== "undefined") && (
            <div className="flex items-center gap-2 mt-2.5">
              {c.severityText && (
                <span
                  className={`${cfg.labelColor} font-semibold text-base leading-6 font-dmsans`}
                  style={{ fontFeatureSettings: "'dlig' on" }}
                >
                  {c.severityText}
                </span>
              )}
              {typeof c.kps !== "undefined" && (
                <span
                  className="text-gray-500 text-right font-normal text-sm leading-5 font-dmsans"
                  style={{ fontFeatureSettings: "'dlig' on" }}
                >
                  • KPS: {c.kps}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        {c.description && (
          <p className="mt-2.5 text-sm text-gray-500 leading-5">
            {c.description}
          </p>
        )}
        {showExtras && (
          <div className="mt-2.5 space-y-2 text-sm">
            {c.recommendation && (
              <div className="mt-2.5">
                <h6 className="font-medium block text-gray-700 leading-5">
                  Recommendation
                </h6>
                <span className="text-gray-500 text-right font-normal text-sm leading-5">
                  {c.recommendation}
                </span>
              </div>
            )}

            {c.action && (
              <div className="text-sm text-gray-500">
                <h6 className="font-medium block text-gray-700 leading-5">
                  Action
                </h6>
                <p className="font-normal text-sm block text-gray-500 leading-5">
                  {c.action}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {cards.slice(0, 5).map((c, i) => renderCard(c, i))}
      <div className="rounded-lg text-gray-700 font-semibold pb-3 text-sm px-3 py-2">
        Decision Support Modifiers
      </div>
      {cards.slice(5).map((c, i) => renderCard(c, i + 5))}
    </div>
  );
}
