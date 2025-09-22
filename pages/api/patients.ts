import type { NextApiRequest, NextApiResponse } from "next";
import { getPool, type DbPatientRow } from "@/lib/mysql";

type ApiPatient = {
  id: string; // Patient ID like PT123456
  name: string;
  address: string;
  phone: string;
  gender: "M" | "F" | "NA";
  dob?: string | null;
};

function toApiPatient(row: DbPatientRow): ApiPatient {
  const gender = (row.gender || "").toUpperCase();
  const mapped = gender === "MALE" || gender === "M" ? "M" : gender === "FEMALE" || gender === "F" ? "F" : "NA";
  return {
    id: row.patientId,
    name: `${row.firstName || ""} ${row.lastName || ""}`.trim(),
    address: row.address,
    phone: row.phone,
    gender: mapped as ApiPatient["gender"],
    dob: row.dob ?? null,
  };
}

function generatePatientId() {
  // Simple unique-ish ID: PT + 6 digits
  const n = Math.floor(100000 + Math.random() * 900000);
  return `PT${n}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = getPool();

  try {
    if (req.method === "GET") {
      const [rows] = await pool.query<DbPatientRow[]>("SELECT * FROM patients ORDER BY id DESC");
      const data = rows.map(toApiPatient);
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === "POST") {
      const { firstName, lastName, address, phone, dob, gender } = req.body || {};

      if (!firstName || !lastName || !dob || !gender) {
        return res.status(400).json({ ok: false, error: "Missing required fields: firstName, lastName, dob, gender" });
      }

      const patientId = generatePatientId();
      const createdAt = new Date();

      const sql = `INSERT INTO patients (patientId, firstName, lastName, address, phone, dob, gender, createdAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [
        patientId,
        firstName,
        lastName,
        address || "",
        phone || "",
        dob || null,
        gender || null,
        createdAt,
      ];

      await pool.execute(sql, params);

      return res.status(201).json({ ok: true, data: { id: patientId } });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (err: any) {
    console.error("/api/patients error", err);
    return res.status(500).json({ ok: false, error: err?.message || "Internal Server Error" });
  }
}
