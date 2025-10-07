// lib/mysql.ts
import mysql from "mysql2/promise";

const DEFAULTS = {
  host: "wp-pactlatrobedev.wpenginepowered.com",
  port: 13306,
  user: "wp_pactlatrobedev",
  database: "wp_pactlatrobedev",
};

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

  const host = process.env.MYSQL_HOST || DEFAULTS.host;
  const user = process.env.MYSQL_USER || DEFAULTS.user;
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || DEFAULTS.database;

  const rawPort = process.env.MYSQL_PORT;
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : DEFAULTS.port;
  const port = Number.isNaN(parsedPort) ? DEFAULTS.port : parsedPort;

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
    dateStrings: true,
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
