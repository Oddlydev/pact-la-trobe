import type { NextApiRequest, NextApiResponse } from "next";
import type { RowDataPacket } from "mysql2";
import { CheckPassword, HashPassword } from "wordpress-hash-node";

import { getPool } from "@/lib/mysql";

type UserRow = RowDataPacket & {
  ID: number;
  user_login: string;
  user_pass: string;
  user_email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { identifier, currentPassword, newPassword } = req.body ?? {};

  if (
    typeof identifier !== "string" ||
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string"
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!identifier.trim() || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters." });
  }

  try {
    const pool = getPool();
    const trimmed = identifier.trim();

    const [rows] = await pool.execute<UserRow[]>(
      `SELECT ID, user_login, user_pass, user_email
       FROM wp_users
       WHERE user_email = ? OR user_login = ?
       LIMIT 1`,
      [trimmed, trimmed],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];

    const passwordsMatch = CheckPassword(currentPassword, user.user_pass);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const hashedPassword = HashPassword(newPassword);
    await pool.execute(
      `UPDATE wp_users
       SET user_pass = ?, user_activation_key = ''
       WHERE ID = ?`,
      [hashedPassword, user.ID],
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to change password", error);
    return res
      .status(500)
      .json({ message: "Unable to change password right now." });
  }
}
