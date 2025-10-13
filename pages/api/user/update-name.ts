import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/mysql";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";
const WP_PREFIX_ENV = process.env.WORDPRESS_TABLE_PREFIX || ""; // optional override

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
        // Resolve user id (try JWT decode first)
        let id = decodeUserIdFromJWT(token);
        if (!id) {
          const meRes = await fetch(
            `${WP_URL}/?rest_route=/wp/v2/users/me&context=edit`,
            { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
          );
          if (meRes.ok) {
            const me = await meRes.json();
            id = me?.id;
          }
        }
        if (id) {
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
      const meId = (decodeUserIdFromJWT(token)) ?? (await getCurrentUserIdFromWP(token));
      if (!meId) throw new Error("No user id");
      const pool = getPool();
      const prefix = WP_PREFIX_ENV || (await detectWpPrefix(pool));
      await pool.execute(
        `UPDATE ${prefix}users SET display_name = ? WHERE ID = ?`,
        [name, meId]
      );

      // Upsert first_name, last_name, nickname in usermeta
      await upsertUserMeta(pool, prefix, meId, "first_name", firstName);
      await upsertUserMeta(pool, prefix, meId, "last_name", lastName);
      await upsertUserMeta(pool, prefix, meId, "nickname", name);

      return res.status(200).json({ ok: true });
    } catch (e: any) {
      const dbMsg = e?.message || String(e);
      return res.status(500).json({ ok: false, message: "Failed to update name", detail: dbMsg });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

function decodeUserIdFromJWT(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(payloadStr);
    const id = payload?.id || payload?.user_id || payload?.data?.user?.id || payload?.data?.user?.ID || null;
    return typeof id === "number" ? id : (typeof id === "string" ? Number(id) : null);
  } catch {
    return null;
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

async function upsertUserMeta(pool: ReturnType<typeof getPool>, prefix: string, userId: number, key: string, value: string) {
  const [r]: any = await pool.execute(
    `UPDATE ${prefix}usermeta SET meta_value = ? WHERE user_id = ? AND meta_key = ?`,
    [value, userId, key]
  );
  if (r.affectedRows === 0) {
    await pool.execute(
      `INSERT INTO ${prefix}usermeta (user_id, meta_key, meta_value) VALUES (?, ?, ?)`,
      [userId, key, value]
    );
  }
}

let cachedPrefix: string | null = null;
async function detectWpPrefix(pool: ReturnType<typeof getPool>): Promise<string> {
  if (cachedPrefix) return cachedPrefix;
  try {
    const [rows]: any = await pool.query("SHOW TABLES");
    const tableNames: string[] = [];
    for (const row of rows) {
      const name = row[Object.keys(row)[0]] as string;
      if (typeof name === "string") tableNames.push(name);
    }
    const usermeta = tableNames.find((t) => t.endsWith("usermeta"));
    const users = tableNames.find((t) => t.endsWith("users"));
    const cand1 = usermeta ? usermeta.slice(0, -"usermeta".length) : null;
    const cand2 = users ? users.slice(0, -"users".length) : null;
    const prefix = (cand1 && cand2 && cand1 === cand2 ? cand1 : (cand1 || cand2 || "wp_"));
    cachedPrefix = prefix;
    return prefix;
  } catch {
    return "wp_";
  }
}
