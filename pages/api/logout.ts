// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "wpToken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // Overwrite cookie with immediate expiry
    res.setHeader(
        "Set-Cookie",
        serialize(COOKIE_NAME, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        })
    );

    return res.status(200).json({ ok: true });
}
