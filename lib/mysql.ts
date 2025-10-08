// lib/mysql.ts
import mysql from "mysql2/promise";

const DEFAULTS = {
  // Primary guess based on WP Engine docs
  host: "127.0.0.1:3306",
  user: "pactlatrobedev",
  database: "wp_pactlatrobedev",
  password: "Z2Aq8ctI-LYymNqP3zyT",
};

const CANDIDATE_HOSTS = [
  // Most likely
  "pactlatrobedev.wpenginepowered.com",
  "pactlatrobedev.wpengine.com",
  // Some environments prefix with `wp-`
  "wp-pactlatrobedev.wpenginepowered.com",
  "wp-pactlatrobedev.wpengine.com",
];

const WP_ENGINE_HOST_REGEX = /\.wpengine(powered)?\.com$/i;

let pool: mysql.Pool | null = null;
let selectedHost: string | null = null;

function resolveSslConfig(host: string): mysql.SslOptions | undefined {
  const envSsl = process.env.MYSQL_SSL;
  const enableSsl =
    (envSsl && envSsl.toLowerCase() !== "false") ||
    (!envSsl && WP_ENGINE_HOST_REGEX.test(host));

  if (!enableSsl) return undefined;

  const envReject = process.env.MYSQL_SSL_REJECT_UNAUTHORIZED;
  const rejectUnauthorized =
    envReject != null ? envReject.toLowerCase() !== "false" : false; // WP Engine cert chain sometimes fails locally

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

async function tryCreatePool(host: string): Promise<mysql.Pool | null> {
  const user = process.env.MYSQL_USER || DEFAULTS.user;
  const password =
    (process.env.MYSQL_PASSWORD !== undefined
      ? process.env.MYSQL_PASSWORD
      : DEFAULTS.password) || "";
  const database = process.env.MYSQL_DATABASE || DEFAULTS.database;
  const ssl = resolveSslConfig(host);

  const candidate = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 7000,
    dateStrings: true,
    ...(ssl ? { ssl } : {}),
  });

  try {
    const conn = await candidate.getConnection();
    await conn.ping();
    conn.release();
    selectedHost = host;
    return candidate;
  } catch {
    try {
      candidate.end();
    } catch {}
    return null;
  }
}

export function getPool() {
  if (pool) return pool;

  const envHost = process.env.MYSQL_HOST;
  const hosts = envHost ? [envHost, ...CANDIDATE_HOSTS] : CANDIDATE_HOSTS;

  // Note: we cannot use top-level await here; initialize lazily on first use.
  // Create a lightweight proxy that resolves to a working pool on first query.
  const lazy = new Proxy({} as mysql.Pool, {
    get(_t, prop) {
      return async (...args: any[]) => {
        if (!pool) {
          for (const h of hosts) {
            const p = await tryCreatePool(h);
            if (p) {
              pool = p;
              break;
            }
          }
          if (!pool) {
            // Last resort: try DEFAULTS.host
            const fallback = await tryCreatePool(DEFAULTS.host);
            if (fallback) pool = fallback;
          }
          if (!pool) {
            throw new Error(
              `Unable to connect to WP Engine MySQL (hosts tried: ${hosts.join(", ")}).`
            );
          }
        }
        // @ts-ignore - forward calls to the real pool
        return (pool as any)[prop](...args);
      };
    },
  });

  // @ts-ignore
  return lazy as unknown as mysql.Pool;
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
