import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "@/src/components/Layout";
import PrimaryButton from "@/src/components/Buttons/PrimaryButtons";
import OverallSeverityCards from "@/src/components/Cards/OverallSeverityCards";
import SummaryCards from "@/src/components/Cards/SummaryCards";
import PatientBanner from "@/src/components/Banner/PatientBanner";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";

import {
  s1Items,
  s2Items,
  s3Groups,
  s4Items,
  s5Items,
  s6Items,
  s6Options,
  s7Items,
  type Question,
} from "@/src/data/assessmentQuestions";

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
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}

type Answer = "yes" | "no" | "unclear" | undefined;

/* ------------------------
   Question Types
-------------------------*/
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
      <RadioButtonInline
        name={id}
        options={[
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unclear", label: "Unclear" },
        ]}
        defaultValue={value ?? "no"}
        className="shrink-0"
        onChange={(val) => onChange(val as Answer)}
      />
    </div>
  );
}

function DropdownQuestion({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
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
    <div className="q-item flex items-center justify-between gap-6 py-2 w-full">
      <p className="flex-1 text-base text-gray-600 font-medium leading-6">
        {label}
      </p>
      <div className="relative inline-block w-72" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex w-full justify-between items-center rounded-md bg-white pl-4 pr-2.5 py-2.5 text-sm font-medium leading-5 text-gray-600 shadow-sm border border-gray-300"
        >
          <span className={value ? "text-gray-800" : "text-gray-400"}>
            {value ?? "Select Option"}
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
                      onChange(o);
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
type SectionStatus = "empty" | "inProgress" | "complete";

function SectionBlock({
  sectionNumber,
  title,
  children,
  borderColor,
  noCard = false,
  status = "empty",
}: {
  sectionNumber: number;
  title: string;
  children: React.ReactNode;
  borderColor: string;
  noCard?: boolean;
  status?: SectionStatus;
}) {
  function renderIcon() {
    if (status === "empty") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <circle cx="15" cy="15" r="14" stroke="#4B5563" strokeWidth="2" />
        </svg>
      );
    }
    if (status === "inProgress") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <circle cx="15" cy="15" r="14" stroke="#4B5563" stroke-width="2" />
          <circle cx="15" cy="15" r="9.5" fill="#4B5563" stroke="#4B5563" />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
      >
        <circle cx="15" cy="15" r="14" stroke="#4B5563" strokeWidth="2" />
        <path
          d="M23 10.913L21.0129 9L12.5226 17.1708L8.9871 13.7702L7 15.6832L12.5226 21L23 10.913Z"
          fill="#4B5563"
        />
      </svg>
    );
  }

  return (
    <div className="relative flex gap-4">
      <div className="relative flex flex-col items-center">
        <div className="z-10">{renderIcon()}</div>
        <div className="absolute top-8 bottom-0 w-[2px] bg-gray-600"></div>
      </div>

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
  const [s5Answers, setS5Answers] = React.useState<Record<string, string>>({});
  const [s6Answers, setS6Answers] = React.useState<Record<string, string>>({});
  const [s7Answers, setS7Answers] = React.useState<Record<string, V>>({});

  function handleSubmit() {
    const payload = {
      patientId: "PT700012",
      answers: {
        ...s1Answers,
        ...s2Answers,
        ...s3Answers,
        ...s4Answers,
        ...s5Answers,
        ...s6Answers,
        ...s7Answers,
      },
      notes: (document.getElementById("comment") as HTMLTextAreaElement)?.value,
    };

    fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          alert("Assessment saved!");
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch((err) => {
        console.error("Submit error", err);
      });
  }

  function getSectionStatus<T extends string>(
    answers: Record<string, T | undefined>,
    totalQuestions: number
  ): SectionStatus {
    const answeredCount = Object.values(answers).filter(Boolean).length;
    if (answeredCount === 0) return "empty";
    if (answeredCount < totalQuestions) return "inProgress";
    return "complete";
  }
  // Helpers for scoring
  function scoreYesNo(answers: Record<string, string | undefined>) {
    return Object.values(answers).filter((v) => v === "yes").length;
  }

  function scoreDropdown(answers: Record<string, string | undefined>) {
    return Object.values(answers).filter((v) => v === "Yes").length;
  }

  function scoreReferrals(answers: Record<string, string | undefined>) {
    return Object.values(answers).filter((v) => v === "immediate").length;
  }
  const sectionScores = {
    s1: scoreYesNo(s1Answers),
    s2: scoreYesNo(s2Answers),
    s3: scoreYesNo(s3Answers),
    s4: scoreYesNo(s4Answers),
    s5: scoreDropdown(s5Answers),
    s6: scoreReferrals(s6Answers),
    s7: scoreYesNo(s7Answers),
  };
  const totals = {
    s1: s1Items.length,
    s2: s2Items.length,
    s3: s3Groups.reduce((sum, g) => sum + g.items.length, 0),
    s4: s4Items.length,
    s5: s5Items.length,
    s6: s6Items.length,
    s7: s7Items.length,
  };

  const overallScore = Object.values(sectionScores).reduce((a, b) => a + b, 0);
  const overallTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <Layout>
      <main className="mx-auto space-y-6 px-4 pb-4 pt-5 w-full rounded-xl border border-white bg-[rgba(0,0,0,0.00)]">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              New Assessment Form
            </h1>
            <p className="text-sm text-gray-600">
              Start a fresh evaluation to record patient needs and status
            </p>
          </div>
          <div className="flex gap-3">
            <PrimaryButton
              variant="dark"
              iconType="submit"
              label="Submit Form"
              onClick={handleSubmit}
            />
            <PrimaryButton variant="light" iconType="cancel" label="Cancel" />
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
          risk="CRITICAL"
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
              status={getSectionStatus(s1Answers, s1Items.length)}
            >
              <ol>
                {s1Items.map((q, idx) => (
                  <li key={q.id} className="py-2">
                    <S2Question
                      id={q.id}
                      label={`${idx + 1}. ${q.label}`}
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
              status={getSectionStatus(s2Answers, s2Items.length)}
            >
              <ol>
                {s2Items.map((q, idx) => (
                  <li key={q.id} className="py-2">
                    <S2Question
                      id={q.id}
                      label={`${idx + 1}. ${q.label}`}
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
              status={getSectionStatus(s3Answers, s3Groups.length)}
            >
              <div className="space-y-3">
                {s3Groups.map((g) => (
                  <div key={g.title}>
                    <div className="text-gray-700 font-semibold">{g.title}</div>
                    <ol>
                      {g.items.map((q, idx) => (
                        <li key={q.id} className="py-2">
                          <S2Question
                            id={q.id}
                            label={`${idx + 1}. ${q.label}`}
                            value={s3Answers[q.id]}
                            onChange={(v) =>
                              setS3Answers((p) => ({ ...p, [q.id]: v }))
                            }
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* Section 4 */}
            <SectionBlock
              sectionNumber={4}
              title="Psychosocial & Advance Care Planning"
              borderColor="border-l-orange-500"
              status={getSectionStatus(s4Answers, s4Items.length)}
            >
              <ol>
                {s4Items.map((q, idx) => (
                  <li key={q.id} className="py-2">
                    <S2Question
                      id={q.id}
                      label={`${idx + 1}. ${q.label}`}
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
              status={getSectionStatus(s5Answers, s5Items.length)}
            >
              <div className="q-list">
                {s5Items.map((q) => (
                  <DropdownQuestion
                    key={q.id}
                    id={q.id}
                    label={q.label}
                    options={[
                      "Yes",
                      "No",
                      "Unclear",
                      "Sometimes",
                      "None",
                      "Mild concerns",
                      "Significant strain",
                    ]}
                    value={s5Answers[q.id]}
                    onChange={(v) => setS5Answers((p) => ({ ...p, [q.id]: v }))}
                  />
                ))}
              </div>
            </SectionBlock>

            {/* Section 6 */}
            <SectionBlock
              sectionNumber={6}
              title="Clinical Action & Referrals"
              borderColor="border-l-gray-500"
              status={getSectionStatus(s6Answers, s6Items.length)}
            >
              <ol>
                {s6Items.map((q, idx) => (
                  <li key={q.id} className="py-2 flex items-start gap-2">
                    <p className="flex-1 text-base text-gray-700">
                      {idx + 1}. {q.label}
                    </p>
                    <RadioButtonInline
                      name={q.id}
                      options={s6Options}
                      defaultValue="monitoring"
                      onChange={(val) =>
                        setS6Answers((p) => ({
                          ...p,
                          [q.id]: val,
                        }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 7 */}
            <SectionBlock
              sectionNumber={7}
              title="Documentation & Communication"
              borderColor="border-l-gray-500"
              status={getSectionStatus(s7Answers, s7Items.length)}
            >
              <ol>
                {s7Items.map((q, idx) => (
                  <li key={q.id} className="py-2">
                    <S2Question
                      id={q.id}
                      label={`${idx + 1}. ${q.label}`}
                      value={s7Answers[q.id]}
                      onChange={(v) =>
                        setS7Answers((p) => ({ ...p, [q.id]: v }))
                      }
                    />
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* Section 8 */}
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
          <aside className="w-80 space-y-2 p-2 bg-gray-200 rounded-2xl h-full">
            <div className="only-first-cards">
              <OverallSeverityCards
                score={overallScore}
                total={overallTotal}
                limit={1}
              />
            </div>
            <SummaryCards sectionScores={sectionScores} totals={totals} />
          </aside>
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { requireAuth } = await import("@/lib/requireAuth");
  const authRedirect = await requireAuth(ctx);
  if (authRedirect) return authRedirect;
  return { props: {} };
};
