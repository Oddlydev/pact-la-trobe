// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/mysql";
const WP_PREFIX_ENV = process.env.WORDPRESS_TABLE_PREFIX || "";
let cachedPrefixMe: string | null = null;
async function detectWpPrefix(pool: ReturnType<typeof getPool>): Promise<string> {
  if (cachedPrefixMe) return cachedPrefixMe;
  try {
    const [rows]: any = await pool.query("SHOW TABLES");
    const names = rows.map((r: any) => r[Object.keys(r)[0]] as string).filter(Boolean);
    const u = names.find((t: string) => t.endsWith("users"));
    const m = names.find((t: string) => t.endsWith("usermeta"));
    const p1 = u ? u.slice(0, -"users".length) : null;
    const p2 = m ? m.slice(0, -"usermeta".length) : null;
    const p = (p1 && p2 && p1 === p2 ? p1 : (p1 || p2 || "wp_"));
    cachedPrefixMe = p;
    return p;
  } catch {
    return "wp_";
  }
}

const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ ok: false, error: "Not authenticated" });

    // Use context=edit to expose fields like email; use rest_route for reliability
    const meUrl = `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/me&context=edit`;
    const meRes = await fetch(meUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    const raw = await meRes.text();
    let me: any = null;
    try {
      me = raw ? JSON.parse(raw) : null;
    } catch {
      me = null;
    }

    if (!meRes.ok || !me) {
      const snippet = raw?.slice(0, 200);
      return res
        .status(meRes.status && meRes.status !== 200 ? meRes.status : 401)
        .json({ ok: false, error: snippet || "Invalid or expired session" });
    }

    // Always try to augment with ACF endpoint for user meta like phone_number
    if (me?.id) {
      try {
        const acfRes = await fetch(
          `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/acf/v3/users/${me.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (acfRes.ok) {
          const acfRaw = await acfRes.text();
          const acfParsed = acfRaw ? JSON.parse(acfRaw) : null;
          if (acfParsed?.acf) {
            me.acf = { ...(me.acf || {}), ...acfParsed.acf };
          }
        }
      } catch {
        // ignore network/parse errors silently
      }
    }

    // If ACF not available or doesn't include phone, try DB usermeta as fallback
    if (
      me?.id &&
      (!me.acf ||
        (!me.acf.phone_number &&
          !me.acf.contact_number &&
          !me.acf.contact &&
          !me.acf.phone))
    ) {
      try {
        const pool = getPool();
        const prefix = WP_PREFIX_ENV || (await detectWpPrefix(pool));
        const [rows]: any = await pool.execute(
          `SELECT meta_key, meta_value FROM ${prefix}usermeta WHERE user_id = ? AND meta_key IN ('phone_number','contact_number','contact','phone')`,
          [me.id]
        );
        const meta: Record<string, string> = {};
        for (const r of rows || []) meta[r.meta_key] = r.meta_value;
        if (Object.keys(meta).length) {
          me.acf = { ...(me.acf || {}), ...meta };
        }
      } catch {
        // ignore DB fallback errors
      }
    }

    // Convenience fields: normalize phone number and provide a masked password placeholder
    try {
      const phoneCandidate =
        // Prefer WP core user meta if exposed via register_meta(..., 'phone_number', ['show_in_rest'=>true])
        me?.meta?.phone_number ||
        // Fall back to ACF fields if present
        me?.acf?.phone_number ||
        me?.acf?.contact_number ||
        me?.acf?.contact ||
        me?.acf?.phone ||
        null;
      if (phoneCandidate) {
        me.phone_number = phoneCandidate;
      }
      me.password_mask = "********";
    } catch {}

    return res.status(200).json({ ok: true, user: me });
  } catch (err: any) {
    console.error("/api/me error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
