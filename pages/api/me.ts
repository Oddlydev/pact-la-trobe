// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from "next";

const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (!token) return res.status(401).json({ ok: false, error: "Not authenticated" });

        // Ask WP for the current user using the token
        // Use rest_route form for environments where /wp-json is not routed
        const meRes = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/wp/v2/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) {
            return res.status(401).json({ ok: false, error: "Invalid or expired session" });
        }

        const me = await meRes.json();
        return res.status(200).json({ ok: true, user: me });
    } catch (err: any) {
        console.error("/api/me error:", err);
        return res.status(500).json({ ok: false, error: "Server error" });
    }
}
