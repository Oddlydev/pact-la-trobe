import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/mysql";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ ok: false, message: "Not authenticated" });

    const nameRaw = (req.body?.name ?? "") as string;
    const name = String(nameRaw).replace(/<[^>]*>/g, " ").trim();
    if (!name) return res.status(400).json({ ok: false, message: "Name cannot be empty" });

    // Split to optional first/last
    const parts = name.split(/\s+/);
    const firstName = parts.slice(0, -1).join(" ") || parts[0];
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "";

    // Try WordPress REST update first (preferred)
    if (WP_URL) {
      try {
        // Fetch current user to get ID
        const meRes = await fetch(
          `${WP_URL}/?rest_route=/wp/v2/users/me&context=edit`,
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
        );
        if (meRes.ok) {
          const me = await meRes.json();
          const id = me?.id;
          if (id) {
            const updRes = await fetch(
              `${WP_URL}/?rest_route=/wp/v2/users/${id}`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  name, // display_name
                  first_name: firstName,
                  last_name: lastName,
                  nickname: name,
                }),
              }
            );
            if (updRes.ok) {
              return res.status(200).json({ ok: true });
            }
          }
        }
      } catch {}
    }

    // Fallback: update DB directly
    try {
      const meId = await getCurrentUserIdFromWP(token);
      if (!meId) throw new Error("No user id");
      const pool = getPool();
      await pool.execute(
        `UPDATE wp_users SET display_name = ? WHERE ID = ?`,
        [name, meId]
      );

      // Upsert first_name, last_name, nickname in wp_usermeta
      await upsertUserMeta(meId, "first_name", firstName);
      await upsertUserMeta(meId, "last_name", lastName);
      await upsertUserMeta(meId, "nickname", name);

      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ ok: false, message: "Failed to update name" });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

async function getCurrentUserIdFromWP(token: string): Promise<number | null> {
  if (!WP_URL) return null;
  try {
    const meRes = await fetch(
      `${WP_URL}/?rest_route=/wp/v2/users/me&context=edit`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!meRes.ok) return null;
    const me = await meRes.json();
    return typeof me?.id === "number" ? me.id : null;
  } catch {
    return null;
  }
}

async function upsertUserMeta(userId: number, key: string, value: string) {
  const pool = getPool();
  const [r]: any = await pool.execute(
    `UPDATE wp_usermeta SET meta_value = ? WHERE user_id = ? AND meta_key = ?`,
    [value, userId, key]
  );
  if (r.affectedRows === 0) {
    await pool.execute(
      `INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES (?, ?, ?)`,
      [userId, key, value]
    );
  }
}

