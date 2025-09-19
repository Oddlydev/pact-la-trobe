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

type Answer = "yes" | "no" | "unclear" | undefined;

function S2Question({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Answer;
  onChange: (v: Answer) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <p className="max-w-[60ch] text-sm text-gray-800">{label}</p>
      <fieldset className="shrink-0">
        <legend className="sr-only">{label}</legend>
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <label className="inline-flex items-center gap-2">
            <input
              name={id}
              type="radio"
              className="size-4 accent-emerald-600"
              checked={value === "yes"}
              onChange={() => onChange("yes")}
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              name={id}
              type="radio"
              className="size-4 accent-emerald-600"
              checked={value === "no"}
              onChange={() => onChange("no")}
            />
            <span>No</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              name={id}
              type="radio"
              className="size-4 accent-emerald-600"
              checked={value === "unclear"}
              onChange={() => onChange("unclear")}
            />
            <span>Unclear</span>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

/* ------------------------
   SectionBlock reusable
-------------------------*/
function SectionBlock({
  title,
  items,
  answers,
  setAnswers,
}: {
  title: string;
  items: { id: string; label: string }[];
  answers: Record<string, Answer>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, Answer>>>;
}) {
  return (
    <SectionCard>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <ol className="divide-y divide-gray-200 mt-4">
        {items.map((q) => (
          <li key={q.id}>
            <S2Question
              id={q.id}
              label={q.label}
              value={answers[q.id]}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            />
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

/* ------------------------
   Main Page
-------------------------*/
export default function AssessmentFormPage() {
  type V = Answer;

  // All section questions
  const s1Items = [
    {
      id: "q1",
      label:
        "Would you be surprised if this patient were to die within the next 6 months?",
    },
    { id: "q2", label: "≥1 recent unplanned hospital admission" },
    {
      id: "q3",
      label:
        "Deteriorating performance status (bed/chair-bound most of the day)",
    },
    { id: "q4", label: "Increased dependence in ADLs" },
    { id: "q5", label: "Cognitive or physical decline despite treatment" },
    { id: "q6", label: "Karnofsky Performance Status (≤50)" },
  ];

  const s2Items = [
    { id: "s1", label: "Persistent pain" },
    { id: "s2", label: "Weight loss >10% or BMI <18" },
    { id: "s3", label: "Swallowing difficulties or reduced oral intake" },
    { id: "s4", label: "Increasing fatigue or social withdrawal" },
    { id: "s5", label: "Frequent infections (UTI, pneumonia, etc.)" },
    { id: "s6", label: "Recurrent falls or pressure injury risk" },
    { id: "s7", label: "Emotional/spiritual distress" },
  ];

  const s3Items = [
    { id: "c1", label: "Cancer: Palliative-only treatment" },
    { id: "c2", label: "Cancer: Functional decline" },
    {
      id: "d1",
      label: "Dementia/Frailty: Non-verbal or no social interaction",
    },
    { id: "d2", label: "Dementia/Frailty: Double incontinence" },
    { id: "d3", label: "Dementia/Frailty: Aspiration/febrile episodes" },
    {
      id: "d4",
      label: "Dementia/Frailty: Agitation/distress needing high care support",
    },
    { id: "n1", label: "Neurological: Progressive deterioration" },
    { id: "n2", label: "Neurological: Speech/swallowing decline" },
    { id: "n3", label: "Neurological: Respiratory complications" },
    { id: "h1", label: "Heart: NYHA Class IV / chest pain at rest" },
    { id: "h2", label: "Heart: Frequent HF admissions" },
    { id: "r1", label: "Respiratory: Breathlessness at rest" },
    { id: "r2", label: "Respiratory: Home oxygen use" },
    { id: "re1", label: "Renal: CKD stage 4–5" },
    { id: "re2", label: "Renal: Dialysis discontinued" },
    { id: "l1", label: "Liver: Decompensated cirrhosis" },
  ];

  const s4Items = [
    { id: "p1", label: "Patient/family preference for comfort care" },
    { id: "p2", label: "No ACP or unclear goals of care" },
    { id: "p3", label: "Family conflict / no substitute decision-maker" },
    { id: "p4", label: "Admitted for end-of-life care" },
    { id: "p5", label: "Spiritual, cultural and personal beliefs provided" },
    { id: "p6", label: "Adequate support from family" },
  ];

  const s5Items = [
    { id: "hs1", label: "Cultural or spiritual needs identified" },
    { id: "hs2", label: "Cultural identity documented" },
    { id: "hs3", label: "Informal caregiver involved" },
    { id: "hs4", label: "Caregiver distress or needs" },
    { id: "hs5", label: "Current ACP documented" },
    { id: "hs6", label: "Care aligned with person’s wishes" },
    { id: "hs7", label: "Social isolation present" },
    { id: "hs8", label: "Barriers to accessing care" },
    { id: "hs9", label: "Financial or transport barriers" },
    { id: "hs10", label: "Communication or language needs" },
  ];

  // States
  const [s1Answers, setS1Answers] = React.useState<Record<string, V>>({});
  const [s2Answers, setS2Answers] = React.useState<Record<string, V>>({});
  const [s3Answers, setS3Answers] = React.useState<Record<string, V>>({});
  const [s4Answers, setS4Answers] = React.useState<Record<string, V>>({});
  const [s5Answers, setS5Answers] = React.useState<Record<string, V>>({});

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 flex gap-6">
        {/* Left column */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Patient Assessment Form
              </h1>
              <p className="text-sm text-gray-600">
                Record patient needs and functional decline
              </p>
            </div>
            <div className="flex gap-3">
              <PrimaryButton variant="dark" label="Save Draft" />
              <PrimaryButton variant="light" label="Submit Form" />
            </div>
          </header>

          {/* Patient Banner */}
          <PatientCard
            name="Christopher Jonathan Edward Patrick Harrison"
            age={62}
            gender="Male"
            risks={["High concern in functional decline"]}
            score={18}
            riskLevel="moderate"
          />

          {/* Sections */}
          <SectionBlock
            title="Patient Identification & Functional Decline"
            items={s1Items}
            answers={s1Answers}
            setAnswers={setS1Answers}
          />
          <SectionBlock
            title="Symptom Burden & Unmet Needs"
            items={s2Items}
            answers={s2Answers}
            setAnswers={setS2Answers}
          />
          <SectionBlock
            title="Condition-Specific Indicators"
            items={s3Items}
            answers={s3Answers}
            setAnswers={setS3Answers}
          />
          <SectionBlock
            title="Psychosocial & Advance Care Planning"
            items={s4Items}
            answers={s4Answers}
            setAnswers={setS4Answers}
          />
          <SectionBlock
            title="Holistic, Social and Cultural Needs"
            items={s5Items}
            answers={s5Answers}
            setAnswers={setS5Answers}
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
