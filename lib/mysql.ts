// lib/mysql.ts
import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

function resolveSslConfig(): mysql.SslOptions | undefined {
  const sslFlag = process.env.MYSQL_SSL;
  if (!sslFlag || sslFlag.toLowerCase() === "false") return undefined;

  const ssl: mysql.SslOptions = {
    rejectUnauthorized:
      process.env.MYSQL_SSL_REJECT_UNAUTHORIZED?.toLowerCase() !== "false",
  };

  const ca = process.env.MYSQL_SSL_CA;
  if (ca) ssl.ca = ca.replace(/\\n/g, "\n");

  const cert = process.env.MYSQL_SSL_CERT;
  if (cert) ssl.cert = cert.replace(/\\n/g, "\n");

  const key = process.env.MYSQL_SSL_KEY;
  if (key) ssl.key = key.replace(/\\n/g, "\n");

  return ssl;
}

export function getPool() {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "la-trobe";

  const rawPort = process.env.MYSQL_PORT;
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : 3306;
  const port = Number.isNaN(parsedPort) ? 3306 : parsedPort;
  const ssl = resolveSslConfig();

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true, // return dates as strings
    ...(ssl ? { ssl } : {}),
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
