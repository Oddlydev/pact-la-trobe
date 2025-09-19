import React from "react";
import Layout from "@/src/components/Layout";
import PrimaryButton from "@/src/components/Buttons/PrimaryButtons";
import PatientCard from "@/src/components/Cards/PatientCard";
import OverallSeverityCards from "@/src/components/Cards/OverallSeverityCards";
import SummaryCards from "@/src/components/Cards/SummaryCards";

/* ------------------------
   Helpers
-------------------------*/
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 pb-6 pt-3">{children}</div>
    </section>
  );
}

function SectionHeading({ index }: { index: number }) {
  return (
    <div className="mb-2 text-sm font-medium text-gray-600">
      Section {index}
    </div>
  );
}

function SectionReadOnly({
  index,
  title,
  items,
}: {
  index: number;
  title: string;
  items: { id: string; label: string; value: string }[];
}) {
  return (
    <div>
      <SectionHeading index={index} />
      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <ol className="divide-y divide-gray-200 mt-4">
          {items.map((q, i) => (
            <li key={q.id} className="flex justify-between py-2 text-sm">
              <span className="text-gray-800">
                {i + 1}. {q.label}
              </span>
              <span className="font-medium text-emerald-700">{q.value}</span>
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}

/* ------------------------
   Main Page
-------------------------*/
export default function AssessmentReportPage() {
  // Example static answers
  const s1Items = [
    {
      id: "q1",
      label:
        "Would you be surprised if this patient were to die within the next 6 months?",
      value: "Yes",
    },
    {
      id: "q2",
      label: "≥1 recent unplanned hospital admission",
      value: "Unclear",
    },
    {
      id: "q3",
      label:
        "Deteriorating performance status (bed/chair-bound most of the day)",
      value: "Yes",
    },
    { id: "q4", label: "Increased dependence in ADLs", value: "Yes" },
    {
      id: "q5",
      label: "Cognitive or physical decline despite treatment",
      value: "Yes",
    },
    { id: "q6", label: "Karnofsky Performance Status (≤50)", value: "80" },
  ];

  const s2Items = [
    { id: "s1", label: "Persistent pain", value: "Yes" },
    { id: "s2", label: "Weight loss >10% or BMI <18", value: "Unclear" },
    {
      id: "s3",
      label: "Swallowing difficulties or reduced oral intake",
      value: "No",
    },
    { id: "s4", label: "Increasing fatigue or social withdrawal", value: "No" },
    {
      id: "s5",
      label: "Frequent infections (UTI, pneumonia, etc.)",
      value: "No",
    },
    {
      id: "s6",
      label: "Recurrent falls or pressure injury risk",
      value: "Yes",
    },
    { id: "s7", label: "Emotional/spiritual distress", value: "No" },
  ];

  const s3Items = [
    { id: "c1", label: "Cancer: Palliative-only treatment", value: "Yes" },
    { id: "c2", label: "Cancer: Functional decline", value: "No" },
    {
      id: "d1",
      label: "Dementia/Frailty: Non-verbal or no social interaction",
      value: "Yes",
    },
    { id: "d2", label: "Dementia/Frailty: Double incontinence", value: "No" },
    { id: "n1", label: "Neurological: Progressive deterioration", value: "No" },
    {
      id: "h1",
      label: "Heart: NYHA Class IV / chest pain at rest",
      value: "No",
    },
  ];

  const s4Items = [
    {
      id: "p1",
      label: "Patient/family preference for comfort care",
      value: "Yes",
    },
    { id: "p2", label: "No ACP or unclear goals of care", value: "Yes" },
    {
      id: "p3",
      label: "Family conflict / no substitute decision-maker",
      value: "No",
    },
    { id: "p4", label: "Admitted for end-of-life care", value: "No" },
  ];

  const s5Items = [
    {
      id: "hs1",
      label: "Cultural or spiritual needs identified",
      value: "Yes",
    },
    { id: "hs2", label: "Cultural identity documented", value: "No" },
    { id: "hs3", label: "Informal caregiver involved", value: "Yes" },
    { id: "hs4", label: "Caregiver distress or needs", value: "Yes" },
    { id: "hs5", label: "Social isolation present", value: "No" },
  ];

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 flex gap-6">
        {/* Left column */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Patient Assessment Report
              </h1>
              <p className="text-sm text-gray-600">
                Review detailed insights from the latest evaluation
              </p>
            </div>
            <div className="flex gap-3">
              <PrimaryButton variant="dark" label="Edit Report" />
              <PrimaryButton variant="light" label="Export Report" />
            </div>
          </header>

          {/* Patient Banner */}
          <PatientCard
            name="Christopher Jonathan Edward Patrick Harrison"
            age={62}
            gender="Male"
            risks={[
              "High concern in functional decline",
              "Moderate symptom burden needs monitoring",
            ]}
            score={18}
            riskLevel="moderate"
          />

          {/* Sections */}
          <SectionReadOnly
            index={1}
            title="Patient Identification & Functional Decline"
            items={s1Items}
          />
          <SectionReadOnly
            index={2}
            title="Symptom Burden & Unmet Needs"
            items={s2Items}
          />
          <SectionReadOnly
            index={3}
            title="Condition-Specific Indicators"
            items={s3Items}
          />
          <SectionReadOnly
            index={4}
            title="Psychosocial & Advance Care Planning"
            items={s4Items}
          />
          <SectionReadOnly
            index={5}
            title="Holistic, Social and Cultural Needs"
            items={s5Items}
          />
        </div>

        {/* Right column */}
        <aside className="w-80 space-y-6">
          <OverallSeverityCards />
          <SummaryCards />
        </aside>
      </main>
    </Layout>
  );
}
