import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

function createPool(): mysql.Pool {
  const host = process.env.MYSQL_HOST || "127.0.0.1";
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!user || !password || !database) {
    throw new Error("Missing required MySQL environment variables.");
  }

  console.log("Connected to DB:", { user, database });

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
  if (!pool) pool = createPool();
  return pool;
}
