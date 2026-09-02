const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/admin/stats — live counts pulled directly from MySQL, never hardcoded.
const getStats = asyncHandler(async (req, res) => {
  const [[{ totalPrograms }]] = await pool.query('SELECT COUNT(*) AS totalPrograms FROM programs');
  const [[{ activePrograms }]] = await pool.query('SELECT COUNT(*) AS activePrograms FROM programs WHERE is_active = TRUE');
  const [[{ universities }]] = await pool.query('SELECT COUNT(*) AS universities FROM universities');
  const [[{ providers }]] = await pool.query('SELECT COUNT(*) AS providers FROM providers');
  const [[{ categories }]] = await pool.query('SELECT COUNT(*) AS categories FROM categories');
  const [[{ students }]] = await pool.query("SELECT COUNT(*) AS students FROM users WHERE role = 'student'");
  const [[{ totalSaves }]] = await pool.query('SELECT COUNT(*) AS totalSaves FROM saved_programs');

  res.json({
    totalPrograms, activePrograms, universities, providers, categories, students, totalSaves
  });
});

module.exports = { getStats };
