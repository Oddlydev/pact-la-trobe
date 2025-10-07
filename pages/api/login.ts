import type { NextApiRequest, NextApiResponse } from "next";
import type { RowDataPacket } from "mysql2";
import { CheckPassword } from "wordpress-hash-node";

import { getPool } from "@/lib/mysql";

type UserRow = RowDataPacket & {
  ID: number;
  user_login: string;
  user_pass: string;
  user_email: string;
  display_name: string;
};

type UserMetaRow = RowDataPacket & {
  meta_key: string;
  meta_value: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { identifier, password } = req.body ?? {};

  if (
    typeof identifier !== "string" ||
    typeof password !== "string" ||
    !identifier.trim() ||
    !password
  ) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const pool = getPool();
    const normalizedIdentifier = identifier.trim();

    const [users] = await pool.execute<UserRow[]>(
      `SELECT ID, user_login, user_pass, user_email, display_name
       FROM wp_users
       WHERE user_email = ? OR user_login = ?
       LIMIT 1`,
      [normalizedIdentifier, normalizedIdentifier],
    );

    if (!users.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const passwordOk = CheckPassword(password, user.user_pass);
    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const metaKeys = [
      "first_name",
      "last_name",
      "nickname",
      "description",
      "wp_capabilities",
    ];
    const keyPlaceholders = metaKeys.map(() => "?").join(", ");

    const [metaRows] = await pool.execute<UserMetaRow[]>(
      `SELECT meta_key, meta_value
       FROM wp_usermeta
       WHERE user_id = ?
         AND meta_key IN (${keyPlaceholders})`,
      [user.ID, ...metaKeys],
    );

    const meta: Record<string, string> = {};
    for (const row of metaRows) {
      meta[row.meta_key] = row.meta_value;
    }

    return res.status(200).json({
      user: {
        id: user.ID,
        login: user.user_login,
        email: user.user_email,
        displayName: user.display_name,
        meta,
      },
    });
  } catch (error) {
    console.error("Failed to authenticate user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
