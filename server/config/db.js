const mysql = require('mysql2/promise');
require('dotenv').config();

// Central MySQL connection pool. Every query in the app goes through
// this pool so we get connection reuse and proper error surfaces.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'programwise',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// Fail fast with a clear message if MySQL isn't reachable.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected successfully to database:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    console.error('Check your .env DB_HOST / DB_USER / DB_PASSWORD / DB_NAME values.');
  }
}

module.exports = { pool, testConnection };
