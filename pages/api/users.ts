import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Fetch only safe public fields
    const [rows] = await connection.query(
      `SELECT ID, user_login, user_nicename, user_email, user_url FROM wp_users`
    );

    connection.end();

    res.status(200).json(rows);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
}
