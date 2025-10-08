import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query("SELECT 1 as ok, DATABASE() as db, @@hostname as host, @@port as port");
      res.status(200).json({ ok: true, info: rows });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
