/**
 * Seeds the two demo accounts (student + admin) with REAL bcrypt-hashed
 * passwords, generated at run time using the same bcryptjs library the
 * app uses for authentication. This keeps password hashing 100% genuine
 * (nothing pre-baked or fake) while letting setup stay a single command.
 *
 * Run this AFTER database/schema.sql and database/seed.sql have been
 * executed:
 *
 *   cd server
 *   npm install
 *   npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const DEMO_ACCOUNTS = [
  { name: 'Demo Student', email: 'student@demo.com', password: 'Student@123', role: 'student' },
  { name: 'Demo Admin', email: 'admin@demo.com', password: 'Admin@123', role: 'admin' }
];

async function seedUsers() {
  console.log('Seeding demo accounts...');

  for (const account of DEMO_ACCOUNTS) {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [account.email]);

    if (existing.length > 0) {
      console.log(`  - ${account.email} already exists, skipping.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [account.name, account.email, hashedPassword, account.role]
    );
    console.log(`  - Created ${account.role} account: ${account.email}`);
  }

  console.log('Done. Demo credentials:');
  console.log('  Student -> student@demo.com / Student@123');
  console.log('  Admin   -> admin@demo.com / Admin@123');
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('Failed to seed demo users:', err.message);
  process.exit(1);
});
