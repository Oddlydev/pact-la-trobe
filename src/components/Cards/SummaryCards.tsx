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

export default function SummaryCards() {
  const cards: SummaryCard[] = [
    // Keep original 1–3
    {
      step: 1,
      title: "Patient Identification & Functional Decline",
      score: 1,
      total: 8,
      severity: "low",
      kps: 80,
      description: "Monitor. Reassess periodically as condition changes.",
      recommendation: "Suitable for routine care and ongoing monitoring.",
      action: "Continue monitoring unless other risk indicators exist",
    },
    {
      step: 2,
      title: "Patient Identification & Functional Decline",
      score: 3,
      total: 8,
      severity: "moderate",
      kps: 80,
      description:
        "Begin care planning. Discuss goals of care with patient/family.",
      recommendation:
        "Action required within 1 week. Monitor closely and prioritise timely care.",
      action: "Align with moderate–to–high stratification for timely action",
    },
    {
      step: 3,
      title: "Patient Identification & Functional Decline",
      score: 6,
      total: 8,
      severity: "high",
      kps: 80,
      description: "Trigger for Specialist Palliative Care referral",
      recommendation:
        "Action required immediately (e.g., medication review, referral, MDT case meeting).",
      action: "Escalate care immediately, regardless of stratification score",
    },
    // Added 4–7
    {
      step: 4,
      title: "Psychosocial & Advance Care Planning",
      score: 5,
      total: 6,
      severity: "high",
      severityText: "Psychological Risk",
      description:
        "Discuss concerns with patient/family. Engage social work, psychology, or ACP team as appropriate.",
    },
    {
      step: 5,
      title: "Holistic, Social and Cultural Needs",
      score: 8,
      total: 16,
      severity: "moderate",
      severityText: "Moderate Concern",
      description:
        "Review support needs. Consider involving social work, pastoral care, or Aboriginal liaison officer.",
    },
    {
      step: 6,
      title: "Clinical Action & Referrals",
      score: 12,
      total: 18,
      severity: "moderate",
      severityText: "Low Urgency",
      recommendation:
        "Action required within 1 week. Monitor closely and prioritise timely care.",
      action: "Align with moderate–to–high stratification for timely action",
    },
    {
      step: 7,
      title: "Documentation & Communication",
      score: 4,
      total: 4,
      severity: "low",
      severityText: "Optimal",
      recommendation:
        "Documentation and communication complete. No further action required.",
      action: "Safe to proceed with planned care",
    },
  ];

  const renderCard = (c: SummaryCard, i: number) => {
    const cfg = severityCfg[c.severity];
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
              <span className="flex items-center justify-center w-5 h-5 aspect-square rounded-full bg-black text-white text-[11px]">
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
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {cards.slice(0, 5).map((c, i) => renderCard(c, i))}
      <div className="rounded-lg text-gray-700 font-semibold text-sm px-3 py-2">
        Decision Support Modifiers
      </div>
      {cards.slice(5).map((c, i) => renderCard(c, i + 5))}
    </div>
  );
}
