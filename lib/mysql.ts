import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

function createPool(): mysql.Pool {
  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER;        // ← must be wp_xxxxx from wp-config.php
  const password = process.env.MYSQL_PASSWORD; // ← same as DB_PASSWORD in wp-config.php
  const database = process.env.MYSQL_DATABASE; // ← wp_pactlatrobedev
  console.log("Loaded env:", {
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  });


  if (!user || !password || !database) {
    throw new Error("Missing required MySQL environment variables.");
  }

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    dateStrings: true,
  });
}

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export type DbPatientRow = {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  dob: string | null;
  gender: string | null;
  deleteReason?: string | null;
  createdAt?: string | null;
};
