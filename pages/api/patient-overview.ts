// pages/api/patient-overview.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/mysql";

type ApiPatientOverview = {
  id: string;
  name: string;
  gender: "M" | "F" | "NA";
  age?: number | null;
  score: number;
  riskLevel: string;
  risks: string[];
};

function mapGender(g: string | null): "M" | "F" | "NA" {
  const gender = (g || "").toUpperCase();
  if (gender === "M" || gender === "MALE") return "M";
  if (gender === "F" || gender === "FEMALE") return "F";
  return "NA";
}

function calculateAge(dob?: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = getPool();

  try {
    if (req.method === "GET") {
      const [rows] = await pool.query<any[]>(
        `SELECT 
          p.patientId,
          p.firstName,
          p.lastName,
          p.dob,
          p.gender,
          o.pcfScore,
          o.riskLevel,
          o.caregiver_unable,
          o.recurrent_falls
        FROM patients p
        JOIN patient_overview o ON p.patientId = o.patientId
        WHERE (p.deleteReason IS NULL OR p.deleteReason = '')
        ORDER BY o.pcfScore DESC`
      );

      const data: ApiPatientOverview[] = rows.map((r) => ({
        id: r.patientId,
        name: `${r.firstName || ""} ${r.lastName || ""}`.trim(),
        gender: mapGender(r.gender),
        age: calculateAge(r.dob),
        score: r.pcfScore,
        riskLevel: (r.riskLevel || "").toLowerCase(),
        risks: [
          r.caregiver_unable ? "Caregiver is unable to continue care" : null,
          r.recurrent_falls ? "Has risk for recurrent falls" : null,
        ].filter(Boolean) as string[],
      }));

      return res.status(200).json({ ok: true, data });
    }

    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (err: any) {
    console.error("/api/patient-overview error", err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Internal Server Error" });
  }
}
