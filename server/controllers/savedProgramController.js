const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/saved-programs
const getSavedPrograms = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT
        p.id, p.title, p.fee, p.currency, p.duration_months, p.delivery_mode,
        p.experience_level, p.is_active,
        u.name AS university_name, pr.name AS provider_name, c.name AS category_name,
        sp.saved_at
     FROM saved_programs sp
     JOIN programs p ON sp.program_id = p.id
     JOIN universities u ON p.university_id = u.id
     JOIN providers pr ON p.provider_id = pr.id
     JOIN categories c ON p.category_id = c.id
     WHERE sp.user_id = ?
     ORDER BY sp.saved_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// POST /api/saved-programs/:programId
const saveProgram = asyncHandler(async (req, res) => {
  const { programId } = req.params;

  const [program] = await pool.query('SELECT id FROM programs WHERE id = ?', [programId]);
  if (program.length === 0) {
    throw new ApiError(404, 'Program not found.');
  }

  const [existing] = await pool.query(
    'SELECT * FROM saved_programs WHERE user_id = ? AND program_id = ?',
    [req.user.id, programId]
  );
  if (existing.length > 0) {
    throw new ApiError(409, 'Program is already saved.');
  }

  await pool.query(
    'INSERT INTO saved_programs (user_id, program_id) VALUES (?, ?)',
    [req.user.id, programId]
  );

  res.status(201).json({ message: 'Program saved successfully.' });
});

// DELETE /api/saved-programs/:programId
const unsaveProgram = asyncHandler(async (req, res) => {
  const { programId } = req.params;
  const [result] = await pool.query(
    'DELETE FROM saved_programs WHERE user_id = ? AND program_id = ?',
    [req.user.id, programId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Saved program not found.');
  }
  res.json({ message: 'Program removed from saved list.' });
});

module.exports = { getSavedPrograms, saveProgram, unsaveProgram };
