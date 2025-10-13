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

    const body = (req.body ?? {}) as { phone?: string; country?: string; number?: string };
    const phoneRaw = (body.phone || `${body.country || ""} ${body.number || ""}`).trim();
    const phone = phoneRaw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!phone) return res.status(400).json({ ok: false, message: "Phone number cannot be empty" });

    // Try to update via ACF REST first (preferred)
    let acfError: string | null = null;
    if (WP_URL) {
      try {
        // Quick capability check – if ACF REST isn't present, skip this block
        const acfPing = await fetch(`${WP_URL}/?rest_route=/acf/v3`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (!acfPing.ok) throw new Error(`acf/v3 unavailable (${acfPing.status})`);
        const id = await getCurrentUserIdFromWP(token);
        if (id) {
          // Discover existing ACF keys on the user
          const getRes = await fetch(`${WP_URL}/?rest_route=/acf/v3/users/${id}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          let candidateKeys = ["phone_number", "contact_number", "contact", "phone"] as const;
          if (getRes.ok) {
            const payload = (await getRes.json().catch(() => null)) as any;
            const acf = payload?.acf || payload?.fields || {};
            const present = candidateKeys.filter((k) => Object.prototype.hasOwnProperty.call(acf, k));
            if (present.length) candidateKeys = present as any;
          }

          // Try updating using the discovered keys
          for (const k of candidateKeys) {
            const resp = await fetch(`${WP_URL}/?rest_route=/acf/v3/users/${id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ fields: { [k]: phone } }),
            });
            if (resp.ok) return res.status(200).json({ ok: true });
            const txt = await resp.text();
            acfError = `ACF update failed (${resp.status}): ${txt?.slice(0,200)}`;
          }
        } else {
          acfError = "Unable to resolve current user ID from WordPress.";
        }
      } catch (e: any) {
        acfError = e?.message || "ACF request error";
      }
    }

    // DB fallback: upsert into wp_usermeta
    try {
      const meId = await getCurrentUserIdFromWP(token);
      if (!meId) throw new Error("No user id");
      const pool = getPool();
      const prefix = WP_PREFIX_ENV || (await detectWpPrefix(pool));
      const keys = ["phone_number", "contact_number", "contact", "phone"];
      for (const k of keys) {
        await upsertUserMeta(pool, prefix, meId, k, phone);
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error("update-phone DB fallback error:", e);
      const dbMsg = (e as any)?.message || String(e);
      // Do not leak the noisy ACF 404 to the UI; provide concise failure
      return res.status(500).json({ ok: false, message: `Failed to update phone number`, detail: dbMsg });
    }
  } catch {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

function decodeUserIdFromJWT(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(payloadStr);
    const id =
      payload?.id ||
      payload?.user_id ||
      payload?.data?.user?.id ||
      payload?.data?.user?.ID ||
      null;
    return typeof id === "number" ? id : (typeof id === "string" ? Number(id) : null);
  } catch {
    return null;
  }
}

async function getCurrentUserIdFromWP(token: string): Promise<number | null> {
  // Try decoding ID from JWT first (fast path)
  const decoded = decodeUserIdFromJWT(token);
  if (decoded) return decoded;
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
    return "wp_"; // safe default
  }
}
