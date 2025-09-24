export type Question = {
    id: string;   // e.g. "s1q1"
    label: string;
};

// -------------------- Section 1 --------------------
export const s1Items: Question[] = [
    { id: "s1q1", label: "Would you be surprised if this patient were to die within the next 6 months?" },
    { id: "s1q2", label: "≥1 recent unplanned hospital admission" },
    { id: "s1q3", label: "Deteriorating performance status (bed/chair-bound most of the day)" },
    { id: "s1q4", label: "Increased dependence in ADLs" },
    { id: "s1q5", label: "Cognitive or physical decline despite treatment" },
    { id: "s1q6", label: "Karnofsky Performance Status (≤50)" },
];

// -------------------- Section 2 --------------------
export const s2Items: Question[] = [
    { id: "s2q1", label: "Persistent pain" },
    { id: "s2q2", label: "Weight loss >10% or BMI <18" },
    { id: "s2q3", label: "Swallowing difficulties or reduced oral intake" },
    { id: "s2q4", label: "Increasing fatigue or social withdrawal" },
    { id: "s2q5", label: "Frequent infections (UTI, pneumonia, etc.)" },
    { id: "s2q6", label: "Recurrent falls or pressure injury risk" },
    { id: "s2q7", label: "Emotional/spiritual distress" },
];

// -------------------- Section 3 --------------------
export const s3Items: Question[] = [
    { id: "s3c1", label: "Cancer: Palliative-only treatment" },
    { id: "s3c2", label: "Cancer: Functional decline" },

    { id: "s3d1", label: "Dementia/Frailty: Non-verbal or no social interaction" },
    { id: "s3d2", label: "Dementia/Frailty: Double incontinence" },
    { id: "s3d3", label: "Dementia/Frailty: Aspiration/febrile episodes" },
    { id: "s3d4", label: "Dementia/Frailty: Agitation/distress needing high care support" },

    { id: "s3n1", label: "Neurological: Progressive deterioration" },
    { id: "s3n2", label: "Neurological: Speech/swallowing decline" },
    { id: "s3n3", label: "Neurological: Respiratory complications" },

    { id: "s3h1", label: "Heart: NYHA Class IV / chest pain at rest" },
    { id: "s3h2", label: "Heart: Frequent HF admissions" },

    { id: "s3r1", label: "Respiratory: Breathlessness at rest" },
    { id: "s3r2", label: "Respiratory: Home oxygen use" },

    { id: "s3re1", label: "Renal: CKD stage 4–5" },
    { id: "s3re2", label: "Renal: Dialysis discontinued" },

    { id: "s3l1", label: "Liver: Decompensated cirrhosis" },
];

// Section 3 grouped
export const s3Groups = (() => {
    const strip = (q: Question) => ({
        ...q,
        label: q.label.includes(":") ? q.label.split(":")[1].trim() : q.label,
    });

    return [
        { title: "Cancer", items: s3Items.filter((q) => q.id.startsWith("s3c")).map(strip) },
        { title: "Dementia/Frailty", items: s3Items.filter((q) => q.id.startsWith("s3d")).map(strip) },
        { title: "Neurological (e.g., MND, MS)", items: s3Items.filter((q) => q.id.startsWith("s3n")).map(strip) },
        { title: "Heart/Vascular", items: s3Items.filter((q) => q.id.startsWith("s3h")).map(strip) },
        { title: "Respiratory", items: s3Items.filter((q) => q.id.startsWith("s3r")).map(strip) },
        { title: "Renal", items: s3Items.filter((q) => q.id.startsWith("s3re")).map(strip) },
        { title: "Liver", items: s3Items.filter((q) => q.id.startsWith("s3l")).map(strip) },
    ];
})();

// -------------------- Section 4 --------------------
export const s4Items: Question[] = [
    { id: "s4q1", label: "Patient/family preference for comfort care" },
    { id: "s4q2", label: "No ACP or unclear goals of care" },
    { id: "s4q3", label: "Family conflict / no substitute decision-maker" },
    { id: "s4q4", label: "Admitted for end-of-life care" },
    { id: "s4q5", label: "Spiritual, cultural and personal beliefs provided" },
    { id: "s4q6", label: "Adequate support from family" },
];

// -------------------- Section 5 (Dropdowns) --------------------
export const s5Items: Question[] = [
    { id: "s5q1", label: "Are there identified cultural, religious or spiritual needs influencing care delivery?" },
    { id: "s5q2", label: "Is the person’s cultural background recorded and informing care?" },
    { id: "s5q3", label: "Is an informal caregiver (e.g. family, friend) involved in day-to-day or emotional support?" },
    { id: "s5q4", label: "Has the carer expressed difficulty, fatigue, or emotional strain related to caregiving?" },
    { id: "s5q5", label: "Is there a current ACP or documented goals of care?" },
    { id: "s5q6", label: "Is current care consistent with documented or verbalised preferences?" },
    { id: "s5q7", label: "Does the person have limited or no social contact?" },
    { id: "s5q8", label: "Are there any social or financial barriers affecting care access?" },
];

// -------------------- Section 6 (Referrals) --------------------
export const s6Items: Question[] = [
    { id: "s6q1", label: "Medication review" },
    { id: "s6q2", label: "Anticipatory prescribing" },
    { id: "s6q3", label: "Mobility/oral care/pain relief support" },
    { id: "s6q4", label: "Multidisciplinary case conference" },
    { id: "s6q5", label: "Referral to Palliative Care team" },
    { id: "s6q6", label: "Allied health referrals" },
];

export const s6Options = [
    { id: "immediate", label: "Immediate" },
    { id: "1week", label: "Within 1 week" },
    { id: "monitoring", label: "Ongoing Monitoring" },
];

// -------------------- Section 7 --------------------
export const s7Items: Question[] = [
    { id: "s7q1", label: "Document findings in EHR" },
    { id: "s7q2", label: "Update ACP/goals of care" },
    { id: "s7q3", label: "Family informed and involved" },
    { id: "s7q4", label: "Assign nurse/clinician for follow-up" },
];
