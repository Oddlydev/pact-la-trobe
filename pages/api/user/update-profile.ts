import type { NextApiRequest, NextApiResponse } from "next";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ ok: false, error: "Not authenticated" });

  const { name, phone, country } = (req.body || {}) as {
    name?: string;
    phone?: string;
    country?: string;
  };

  if (!name && !phone) {
    return res.status(400).json({ ok: false, error: "Nothing to update" });
  }

  try {
    // Get current user id
    const meRes = await fetch(
      `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/me&context=edit`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );
    const me = await meRes.json().catch(() => null);
    if (!meRes.ok || !me?.id) {
      return res.status(401).json({ ok: false, error: "Invalid or expired session" });
    }

    const payload: any = {};
    if (typeof name === "string" && name.trim()) {
      payload.name = name.trim();
    }
    if (typeof phone === "string") {
      const full = `${country ? String(country).trim() + " " : ""}${phone.trim()}`.trim();
      payload.meta = { phone_number: full };
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ ok: false, error: "Invalid update payload" });
    }

    const updateRes = await fetch(
      `${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/${me.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const raw = await updateRes.text();
    let updated: any = null;
    try {
      updated = raw ? JSON.parse(raw) : null;
    } catch {
      updated = null;
    }

    if (!updateRes.ok) {
      const msg = (updated && (updated.message || updated.error)) || raw?.slice(0, 200) || "Update failed";
      return res.status(updateRes.status || 400).json({ ok: false, error: msg });
    }

    return res.status(200).json({ ok: true, user: updated });
  } catch (e: any) {
    console.error("/api/user/update-profile error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

