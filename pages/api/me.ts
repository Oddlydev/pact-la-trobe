// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from "next";

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

    // If ACF not present, try ACF endpoint and merge
    if ((!me.acf || Object.keys(me.acf).length === 0) && me?.id) {
      try {
        const acfRes = await fetch(
          `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/acf/v3/users/${me.id}`,
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
        );
        if (acfRes.ok) {
          const acfRaw = await acfRes.text();
          const acfParsed = acfRaw ? JSON.parse(acfRaw) : null;
          if (acfParsed?.acf) {
            me.acf = { ...(me.acf || {}), ...acfParsed.acf };
          }
        }
      } catch {
        // ignore
      }
    }

    // Convenience fields: normalize phone number and provide a masked password placeholder
    try {
      const phoneCandidate =
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
