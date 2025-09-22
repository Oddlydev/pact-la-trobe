import React from "react";
import Layout from "@/src/components/Layout";
import PrimaryButton from "@/src/components/Buttons/PrimaryButtons";
import OverallSeverityCards from "@/src/components/Cards/OverallSeverityCards";
import SummaryCards from "@/src/components/Cards/SummaryCards";
import PatientBanner from "@/src/components/Banner/PatientBanner";

/* ------------------------
   Helpers
-------------------------*/
function SectionCard({
  children,
  borderColor,
}: {
  children: React.ReactNode;
  borderColor: string;
}) {
  return (
    <section
      className={[
        "relative mt-4 font-dmsans rounded-2xl border border-gray-200 bg-white shadow-sm",
        "border-l-4",
        borderColor,
      ].join(" ")}
    >
      <div className="px-6 pb-6 pt-3">{children}</div>
    </section>
  );
}

type Answer = "yes" | "no" | "unclear" | undefined;

/* ------------------------
   Question Types
-------------------------*/
function ReportAnswer({ value }: { value: Answer }) {
  const label =
    value === "yes" ? "Yes" : value === "unclear" ? "Unclear" : "No";
  return (
    <span className="inline-block text-right text-[var(--color-accent)] font-medium text-base font-dmsans leading-6">
      {label}
    </span>
  );
}

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
    <div className="flex items-start justify-between gap-6 w-full">
      <p className="flex-1 text-base text-gray-600 font-medium leading-6">
        {label}
      </p>
      <div className="shrink-0 w-28 text-right">
        <ReportAnswer value={value ?? "no"} />
      </div>
    </div>
  );
}

// Section 6 read-only renderer for status choice
type S6Choice = "immediate" | "1week" | "monitoring";
function Section6Answer({ value }: { value: S6Choice }) {
  const text =
    value === "immediate"
      ? "Immediate"
      : value === "1week"
        ? "Within 1 Week"
        : "Ongoing Monitoring";
  return (
    <span className="inline-block text-right text-[var(--color-accent)] font-medium text-base font-dmsans leading-6">
      {text}
    </span>
  );
}

function DropdownQuestion({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-6 py-3 w-full">
      <p className="flex-1 text-base text-gray-600 font-medium leading-6">
        {label}
      </p>
      <div className="relative inline-block w-72" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-600 shadow-sm border border-gray-300"
        >
          <span className={selected ? "text-gray-800" : "text-gray-400"}>
            {selected ?? "Select Option"}
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5 text-gray-400"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 z-10 mt-1 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
            <ul className="py-1 max-h-60 overflow-auto">
              {options.map((o) => (
                <li key={o}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(o);
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {o}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------
   SectionBlock reusable
-------------------------*/
function SectionBlock({
  sectionNumber,
  title,
  children,
  borderColor,
  noCard = false,
}: {
  sectionNumber: number;
  title: string;
  children: React.ReactNode;
  borderColor: string;
  noCard?: boolean;
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex-1 pb-4">
        <div>
          <span className="text-base font-medium text-gray-500">
            Section {sectionNumber}
          </span>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>

        {noCard ? (
          children
        ) : (
          <SectionCard borderColor={borderColor}>{children}</SectionCard>
        )}
      </div>
    </div>
  );
}

/* ------------------------
   Main Page
-------------------------*/
export default function AssessmentFormPage() {
  type V = Answer;
  const [s1Answers, setS1Answers] = React.useState<Record<string, V>>({});
  const [s2Answers, setS2Answers] = React.useState<Record<string, V>>({});
  const [s3Answers, setS3Answers] = React.useState<Record<string, V>>({});
  const [s4Answers, setS4Answers] = React.useState<Record<string, V>>({});
  const [s7Answers, setS7Answers] = React.useState<Record<string, V>>({});

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

  const s7Items = [
    { id: "d1", label: "Document findings in EHR" },
    { id: "d2", label: "Update ACP/goals of care" },
    { id: "d3", label: "Family informed and involved" },
    { id: "d4", label: "Assign nurse/clinician for follow-up" },
  ];

  const s5ReportGroups = [
    {
      heading: "Spiritual or cultural needs impacting care",
      label:
        "Are there identified cultural, religious or spiritual needs influencing care delivery?",
      answer: "Significant distress or requests affecting care",
    },
    {
      heading: "Cultural identity documented",
      label: "Is the person’s cultural background recorded and informing care?",
      answer: "Documented, but no impact",
    },
    {
      heading: "Informal care involvement",
      label:
        "Is an informal caregiver (e.g. family, friend) involved in day-to-day or emotional support?",
      answer: "No or unknown",
    },
    {
      heading: "Care distress or needs",
      label:
        "Has the carer expressed difficulty, fatigue, or emotional strain related to caregiving?",
      answer: "No",
    },
    {
      heading: "Advance care planning (ACP) status",
      label: "Is there a current ACP or documented goals of care?",
      answer: "Outdated or unclear",
    },
    {
      heading: "Care aligned with person’s wishes",
      label:
        "Is current care consistent with documented or verbalised preferences?",
      answer: "Partially aligned",
    },
    {
      heading: "Social isolation",
      label: "Does the person have limited or no social contact?",
      answer: "No",
    },
    {
      heading: "Barriers to accessing care",
      label:
        "Are there any social or financial barriers affecting care access?",
      answer: "Minor barriers",
    },
  ];

  return (
    <Layout>
      <main className="mx-aut0 px-4 pb-4 pt-5 w-full rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4 space-y-6">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Patient Assessment Report
            </h1>
            <p className="text-sm text-gray-600">
              Review detailed insights from the latest evaluation
            </p>
          </div>
          <div className="flex gap-3">
            <PrimaryButton
              variant="dark"
              iconType="editReport"
              label="Edit Report"
            />
            <PrimaryButton
              variant="light"
              iconType="exportReport"
              label="Export Report"
            />
          </div>
        </header>

        {/* Patient Banner */}
        <PatientBanner
          patientId="PT700012"
          name="Benjamin Oliver George Henry Nicholas Kensington"
          age="89"
          dob="1936 FEB 21"
          gender="Man"
          location="Western General Hospital"
          risk="CRITICAL/PRIORITY"
          latestReportAt="2025 MAY 8 | 10:19"
          latestReportBy="Louisa Durrell"
        />

        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex-1">
            {/* Section 1 */}
            <SectionBlock
              sectionNumber={1}
              title="Patient Identification & Functional Decline"
              borderColor="border-l-green-600"
            >
              <ol className="">
                {s1Items.map((q, idx) => (
                  <li key={q.id} className="flex items-start gap-1 py-3 ">
                    <span className="text-base text-gray-600 font-medium leading-6">
                      {idx + 1}.
                    </span>
                    <S2Question
                      id={q.id}
                      label={q.label}
                      value={s1Answers[q.id]}
                      onChange={(v) =>
                        setS1Answers((p) => ({ ...p, [q.id]: v }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 2 */}
            <SectionBlock
              sectionNumber={2}
              title="Symptom Burden & Unmet Needs"
              borderColor="border-l-amber-400"
            >
              <ol className="">
                {s2Items.map((q, idx) => (
                  <li key={q.id} className="flex items-start gap-1 py-3 ">
                    <span className="text-base text-gray-600 font-medium leading-6">
                      {idx + 1}.
                    </span>
                    <S2Question
                      id={q.id}
                      label={q.label}
                      value={s2Answers[q.id]}
                      onChange={(v) =>
                        setS2Answers((p) => ({ ...p, [q.id]: v }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 3 */}
            <SectionBlock
              sectionNumber={3}
              title="Condition-Specific Indicators"
              borderColor="border-l-red-600"
            >
              <ol className="">
                {s3Items.map((q, idx) => (
                  <li key={q.id} className="flex items-start gap-1 py-3 ">
                    <span className="text-base text-gray-600 font-medium leading-6">
                      {idx + 1}.
                    </span>
                    <S2Question
                      id={q.id}
                      label={q.label}
                      value={s3Answers[q.id]}
                      onChange={(v) =>
                        setS3Answers((p) => ({ ...p, [q.id]: v }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 4 */}
            <SectionBlock
              sectionNumber={4}
              title="Psychosocial & Advance Care Planning"
              borderColor="border-l-orange-500"
            >
              <ol className="">
                {s4Items.map((q, idx) => (
                  <li key={q.id} className="flex items-start gap-1 py-3 ">
                    <span className="text-base text-gray-600 font-medium leading-6">
                      {idx + 1}.
                    </span>
                    <S2Question
                      id={q.id}
                      label={q.label}
                      value={s4Answers[q.id]}
                      onChange={(v) =>
                        setS4Answers((p) => ({ ...p, [q.id]: v }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 5 */}
            <SectionBlock
              sectionNumber={5}
              title="Holistic, Social and Cultural Needs"
              borderColor="border-l-gray-500"
            >
              <div className="space-y-2">
                {s5ReportGroups.map((g, idx) => (
                  <div key={idx}>
                    <div className="text-gray-700 font-semibold">
                      {g.heading}
                    </div>
                    <ol className="">
                      <li className="flex items-start gap-1 py-3 ">
                        <span>1.</span>
                        <p className="flex-1 text-base text-gray-600 font-medium leading-6">
                          {g.label}
                        </p>
                        <div className="shrink-0 w-80 text-right">
                          <span className="text-[var(--color-accent)] font-medium text-base font-dmsans leading-6">
                            {g.answer}
                          </span>
                        </div>
                      </li>
                    </ol>
                  </div>
                ))}
              </div>
              <div className="hidden">
                <DropdownQuestion
                  label="Are there identified cultural, religious or spiritual needs influencing care delivery?"
                  options={[
                    "No concerns",
                    "Mild concerns",
                    "Significant distress or requests affecting care",
                  ]}
                />
                <DropdownQuestion
                  label="Is the person’s cultural background recorded and informing care?"
                  options={["Yes", "No", "Unclear"]}
                />
                <DropdownQuestion
                  label="Is an informal caregiver (e.g. family, friend) involved in day-to-day or emotional support?"
                  options={["Yes", "No", "Sometimes"]}
                />
                <DropdownQuestion
                  label="Has the carer expressed difficulty, fatigue, or emotional strain related to caregiving?"
                  options={["No", "Some fatigue", "Significant strain"]}
                />
                <DropdownQuestion
                  label="Is there a current ACP or documented goals of care?"
                  options={["Yes", "No", "Unclear"]}
                />
                <DropdownQuestion
                  label="Is current care consistent with documented or verbalised preferences?"
                  options={["Yes", "No", "Unclear"]}
                />
                <DropdownQuestion
                  label="Does the person have limited or no social contact?"
                  options={["Yes", "No"]}
                />
                <DropdownQuestion
                  label="Are there any social or financial barriers affecting care access?"
                  options={["None", "Some barriers", "Significant barriers"]}
                />
              </div>
            </SectionBlock>

            {/* Section 6 */}
            <SectionBlock
              sectionNumber={6}
              title="Clinical Action & Referrals"
              borderColor="border-l-gray-500"
            >
              <ol className="">
                {[
                  "Medication review",
                  "Anticipatory prescribing",
                  "Mobility/oral care/pain relief support",
                  "Multidisciplinary case conference",
                  "Referral to Palliative Care team",
                  "Allied health referrals",
                ].map((label, idx) => (
                  <li key={idx} className="flex items-center gap-6 py-3">
                    <span>{idx + 1}.</span>
                    <p className="flex-1 text-base text-gray-700">{label}</p>
                    <div className="shrink-0 w-40 text-right">
                      <Section6Answer value="monitoring" />
                    </div>
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 7 */}
            <SectionBlock
              sectionNumber={7}
              title="Documentation & Communication"
              borderColor="border-l-gray-500"
            >
              <ol className="">
                {s7Items.map((q, idx) => (
                  <li key={q.id} className="flex items-start gap-1 py-3 ">
                    <span>{idx + 1}.</span>
                    <S2Question
                      id={q.id}
                      label={q.label}
                      value={s7Answers[q.id]}
                      onChange={(v) =>
                        setS7Answers((p) => ({ ...p, [q.id]: v }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 8 - timeline continues, no card */}
            <SectionBlock
              sectionNumber={8}
              title="Comments or Notes"
              borderColor="border-l-gray-500"
              noCard
            >
              <div className="mt-4">
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  placeholder="Add your comment or note here..."
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300"
                />

                <hr className="mt-6 border-t border-gray-200" />

                <div className="mt-3 flex justify-end text-sm text-gray-500">
                  <span>Created By: Thompson Robert</span>
                  <span className="ml-4">2025 DEC 23 14:57</span>
                </div>
              </div>
            </SectionBlock>
          </div>

          {/* Right column */}
          <aside className="w-80 space-y-6">
            <OverallSeverityCards />
            <SummaryCards />
          </aside>
        </div>
      </main>
    </Layout>
  );
}
