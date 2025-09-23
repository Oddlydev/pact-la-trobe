import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool() {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "la-trobe";

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Ensure dates come back as strings (YYYY-MM-DD)
    dateStrings: true,
  });

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
