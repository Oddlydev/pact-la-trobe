import type { NextApiRequest, NextApiResponse } from "next";
import type { RowDataPacket } from "mysql2";
import { CheckPassword, HashPassword } from "wordpress-hash-node";

import { getPool } from "@/lib/mysql";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;

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
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string"
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters." });
  }

  try {
    const token = req.cookies[COOKIE_NAME];

    // If WP URL is configured, verify current password via WP JWT endpoint,
    // then change the password via WP REST. This avoids DB mismatch issues.
    if (NEXT_PUBLIC_WORDPRESS_URL && token) {
      // 1) Resolve the current user (for username/email + id)
      const meRes = await fetch(
        `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/me&context=edit`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } },
      );
      const me = await meRes.json().catch(() => null);
      if (!meRes.ok || !me?.id) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }

      // 2) Verify current password by requesting a JWT using the email (preferred)
      const usernameCandidate = (me.email as string) || (identifier as string) || "";
      const authRes = await fetch(
        `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/jwt-auth/v1/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ username: usernameCandidate, password: currentPassword }),
        },
      );
      if (!authRes.ok) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }

      // 3) Update password via WP REST for the same user id
      const updateRes = await fetch(
        `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/${me.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        },
      );
      if (!updateRes.ok) {
        const errTxt = await updateRes.text().catch(() => "");
        return res.status(400).json({ message: errTxt || "Unable to change password." });
      }
      return res.status(200).json({ success: true });
    }

    // Fallback path: verify and change via DB (requires same DB as WP)
    const pool = getPool();
    const trimmed = String(identifier || "").trim();
    if (!trimmed) {
      return res.status(400).json({ message: "Missing identifier" });
    }
    const [rows] = await pool.execute<UserRow[]>(
      `SELECT ID, user_login, user_pass, user_email
       FROM wp_users
       WHERE user_email = ? OR user_login = ?
       LIMIT 1`,
      [trimmed, trimmed],
    );
    if (!rows.length) return res.status(404).json({ message: "User not found." });
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
