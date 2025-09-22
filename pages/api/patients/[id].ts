import type { NextApiRequest, NextApiResponse } from "next";
import { getPool, type DbPatientRow } from "@/lib/mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = getPool();
  const { id } = req.query; // patientId
  if (!id || typeof id !== "string") {
    return res.status(400).json({ ok: false, error: "Missing patient id" });
  }

  try {
    if (req.method === "GET") {
      const [rows] = await pool.query<DbPatientRow[]>("SELECT * FROM patients WHERE patientId = ? LIMIT 1", [id]);
      if (!rows.length) return res.status(404).json({ ok: false, error: "Not found" });
      return res.status(200).json({ ok: true, data: rows[0] });
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const { firstName, lastName, address, phone, dob, gender } = req.body || {};
      const sql = `UPDATE patients SET firstName = ?, lastName = ?, address = ?, phone = ?, dob = ?, gender = ? WHERE patientId = ?`;
      await pool.execute(sql, [firstName || "", lastName || "", address || "", phone || "", dob || null, gender || null, id]);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const reason = (req.body?.reason as string) || null;
      await pool.execute(
        `UPDATE patients SET deleteReason = ? WHERE patientId = ?`,
        [reason, id]
      );
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (err: any) {
    console.error(`/api/patients/${id} error`, err);
    return res.status(500).json({ ok: false, error: err?.message || "Internal Server Error" });
  }
}

