import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/mysql";

function calculateAge(dob?: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function mapGender(g: string | null): "M" | "F" | "NA" {
  const gender = (g || "").toUpperCase();
  if (gender === "M" || gender === "MALE") return "M";
  if (gender === "F" || gender === "FEMALE") return "F";
  return "NA";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const pool = getPool();

  try {
    if (!id) {
      return res.status(400).json({ ok: false, error: "Missing id" });
    }

    const [rows] = await pool.query<any[]>(
      `SELECT p.id, p.patientId, p.firstName, p.lastName, p.dob, p.gender,
              o.pcfScore, o.riskLevel, o.caregiver_unable, o.recurrent_falls
       FROM patients p
       JOIN patient_overview o ON p.patientId = o.patientId
       WHERE p.patientId = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ ok: false, error: "Patient not found" });
    }

    const r = rows[0];
    return res.status(200).json({
      ok: true,
      data: {
        id: r.id, // internal DB ID
        patientId: r.patientId, // external public ID like PT200013 ✅
        name: `${r.firstName || ""} ${r.lastName || ""}`.trim(),
        gender: mapGender(r.gender),
        age: calculateAge(r.dob),
        score: r.pcfScore,
        riskLevel: (r.riskLevel || "").toLowerCase(),
        risks: [
          r.caregiver_unable ? "Caregiver is unable to continue care" : null,
          r.recurrent_falls ? "Has risk for recurrent falls" : null,
        ].filter(Boolean),
        dob: r.dob,
      },
    });
  } catch (err: any) {
    console.error("/api/patient-profile/[id] error", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
