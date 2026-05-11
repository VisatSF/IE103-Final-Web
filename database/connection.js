import mysql from 'mysql2/promise';

let pool;

export function getDatabasePool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'jobillee_web',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    });
  }

  return pool;
}

export async function checkDatabaseConnection() {
  const db = getDatabasePool();
  const connection = await db.getConnection();

  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}
