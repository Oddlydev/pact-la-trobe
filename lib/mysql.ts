// lib/mysql.ts
import mysql from "mysql2/promise";

const WP_ENGINE_HOST_REGEX = /\.wpenginepowered\.com$/i;

let pool: mysql.Pool | null = null;

function resolveSslConfig(host: string): mysql.SslOptions | undefined {
  const envSsl = process.env.MYSQL_SSL;
  const enableSsl =
    (envSsl && envSsl.toLowerCase() !== "false") ||
    (!envSsl && WP_ENGINE_HOST_REGEX.test(host));

  if (!enableSsl) return undefined;

  const envReject = process.env.MYSQL_SSL_REJECT_UNAUTHORIZED;
  const rejectUnauthorized =
    envReject != null
      ? envReject.toLowerCase() !== "false"
      : !WP_ENGINE_HOST_REGEX.test(host);

  const ssl: mysql.SslOptions = {
    rejectUnauthorized,
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

  const defaultHost = "wp-pactlatrobedev.wpenginepowered.com";
  const defaultDatabase = "wp_pactlatrobedev";
  const defaultUser = "wp_pactlatrobedev";

  const host = process.env.MYSQL_HOST || defaultHost;
  const user = process.env.MYSQL_USER || defaultUser;
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || defaultDatabase;

  const rawPort = process.env.MYSQL_PORT || "13306";
  const parsedPort = Number.parseInt(rawPort, 10);
  const port = Number.isNaN(parsedPort) ? 13306 : parsedPort;

  const ssl = resolveSslConfig(host);

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
