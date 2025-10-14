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

    // Handle delete with reason: persist to patients.deleteReason
    if (req.method === "DELETE") {
      const reason = (req.body?.reason ?? "").toString();
      // Update the deleteReason for this patientId
      await pool.execute(
        `UPDATE patients SET deleteReason = ? WHERE patientId = ?`,
        [reason, id]
      );
      return res.status(200).json({ ok: true });
    }

    // Update patient
    if (req.method === "PUT") {
      const body = req.body || {};
      const allowed: Record<string, string> = {
        firstName: "firstName",
        lastName: "lastName",
        address: "address",
        phone: "phone",
        dob: "dob",
        gender: "gender",
      };

      const keys = Object.keys(allowed).filter((k) => body[k] !== undefined);
      if (keys.length === 0) {
        return res
          .status(400)
          .json({ ok: false, error: "No updatable fields provided" });
      }

      const setClause = keys.map((k) => `${allowed[k]} = ?`).join(", ");
      const params = keys.map((k) => body[k]);
      params.push(id);

      await pool.execute(
        `UPDATE patients SET ${setClause} WHERE patientId = ?`,
        params
      );

      return res.status(200).json({ ok: true });
    }

    // Default GET: return patient details
    if (req.method === "GET") {
      const [rows] = await pool.query<any[]>(
        `SELECT p.id,
                p.patientId,
                p.firstName,
                p.lastName,
                p.address,
                p.phone,
                p.dob,
                p.gender,
                o.pcfScore,
                o.riskLevel,
                o.caregiver_unable,
                o.recurrent_falls
         FROM patients p
         LEFT JOIN patient_overview o ON p.patientId = o.patientId
         WHERE p.patientId = ?`,
        [id]
      );

      if (!rows.length) {
        return res
          .status(404)
          .json({ ok: false, error: "Patient not found" });
      }

      const r = rows[0];
      return res.status(200).json({
        ok: true,
        data: {
          id: r.id, // internal DB ID
          patientId: r.patientId,
          firstName: r.firstName || "",
          lastName: r.lastName || "",
          address: r.address || "",
          phone: r.phone || "",
          gender: mapGender(r.gender),
          dob: r.dob,
          // extras used by other pages
          name: `${r.firstName || ""} ${r.lastName || ""}`.trim(),
          age: calculateAge(r.dob),
          score: r.pcfScore ?? null,
          riskLevel: (r.riskLevel || "").toLowerCase(),
          risks: [
            r.caregiver_unable
              ? "Caregiver is unable to continue care"
              : null,
            r.recurrent_falls ? "Has risk for recurrent falls" : null,
          ].filter(Boolean),
        },
      });
    }

    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (err: any) {
    console.error("/api/patients/[id] error", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}

