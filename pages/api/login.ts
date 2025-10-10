// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";
const MAX_AGE = Number(process.env.JWT_COOKIE_MAX_AGE || 3600);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Missing email or password" });
  }

  try {
    // WP plugin expects "username" even if it's an email. Most setups accept email here.
    // Use rest_route form for environments where /wp-json is not routed
    const wpRes = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    });

    // WP can sometimes return HTML (e.g., redirects, WAF blocks). Read as text and try JSON.
    const raw = await wpRes.text();
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!wpRes.ok || !data?.token) {
      // If JSON parse failed, include a short snippet of raw text for debugging.
      const snippet = raw && typeof raw === "string" ? raw.slice(0, 200) : undefined;
      const message = (data && data.message) || snippet || "Invalid login";
      return res.status(wpRes.status && wpRes.status !== 200 ? wpRes.status : 401).json({
        ok: false,
        error: message,
      });
    }

    // Set httpOnly cookie
    const cookie = serialize(COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    res.setHeader("Set-Cookie", cookie);

    // Return minimal public info to the client
    return res.status(200).json({
      ok: true,
      user: {
        email: data.user_email,
        nicename: data.user_nicename,
        name: data.user_display_name,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
