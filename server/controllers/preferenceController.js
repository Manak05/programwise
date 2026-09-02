const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isNonEmptyString } = require('../utils/validators');

// GET /api/preferences — list all preference profiles for the logged-in user
const listPreferences = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM user_preferences WHERE user_id = ? ORDER BY is_active DESC, updated_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/preferences/:id — get a single profile (must belong to the logged-in user)
const getPreferenceById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM user_preferences WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'Preference profile not found.');
  }
  res.json(rows[0]);
});

// POST /api/preferences — create a new preference profile
const createPreference = asyncHandler(async (req, res) => {
  const {
    profile_name, career_goal, budget, available_hours, experience_level,
    delivery_preference, preferred_duration
  } = req.body;

  if (!isNonEmptyString(profile_name)) {
    throw new ApiError(400, 'Profile name is required.');
  }
  if (!career_goal || !budget) {
    throw new ApiError(400, 'Career goal and budget are required.');
  }

  // The very first profile a user creates automatically becomes their active one.
  const [[{ count }]] = await pool.query(
    'SELECT COUNT(*) AS count FROM user_preferences WHERE user_id = ?',
    [req.user.id]
  );
  const makeActive = count === 0;

  const [result] = await pool.query(
    `INSERT INTO user_preferences
      (user_id, profile_name, career_goal, budget, available_hours, experience_level, delivery_preference, preferred_duration, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id, profile_name.trim(), career_goal, budget, available_hours,
      experience_level, delivery_preference, preferred_duration, makeActive
    ]
  );

  const [created] = await pool.query('SELECT * FROM user_preferences WHERE id = ?', [result.insertId]);
  res.status(201).json(created[0]);
});

// PUT /api/preferences/:id — update an existing profile's fields
const updatePreference = asyncHandler(async (req, res) => {
  const {
    profile_name, career_goal, budget, available_hours, experience_level,
    delivery_preference, preferred_duration
  } = req.body;

  if (!isNonEmptyString(profile_name)) {
    throw new ApiError(400, 'Profile name is required.');
  }
  if (!career_goal || !budget) {
    throw new ApiError(400, 'Career goal and budget are required.');
  }

  const [existing] = await pool.query(
    'SELECT id FROM user_preferences WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (existing.length === 0) {
    throw new ApiError(404, 'Preference profile not found.');
  }

  await pool.query(
    `UPDATE user_preferences SET
      profile_name = ?, career_goal = ?, budget = ?, available_hours = ?,
      experience_level = ?, delivery_preference = ?, preferred_duration = ?
     WHERE id = ? AND user_id = ?`,
    [
      profile_name.trim(), career_goal, budget, available_hours,
      experience_level, delivery_preference, preferred_duration,
      req.params.id, req.user.id
    ]
  );

  const [updated] = await pool.query('SELECT * FROM user_preferences WHERE id = ?', [req.params.id]);
  res.json(updated[0]);
});

// DELETE /api/preferences/:id
const deletePreference = asyncHandler(async (req, res) => {
  const [existing] = await pool.query(
    'SELECT id, is_active FROM user_preferences WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (existing.length === 0) {
    throw new ApiError(404, 'Preference profile not found.');
  }

  const wasActive = Boolean(existing[0].is_active);
  await pool.query('DELETE FROM user_preferences WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

  // If the deleted profile was the active one, promote the most recently
  // updated remaining profile so recommendations don't silently break.
  if (wasActive) {
    const [remaining] = await pool.query(
      'SELECT id FROM user_preferences WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
      [req.user.id]
    );
    if (remaining.length > 0) {
      await pool.query('UPDATE user_preferences SET is_active = TRUE WHERE id = ?', [remaining[0].id]);
    }
  }

  res.json({ message: 'Preference profile deleted successfully.' });
});

// PATCH /api/preferences/:id/activate — make this profile the selected one
const activatePreference = asyncHandler(async (req, res) => {
  const [existing] = await pool.query(
    'SELECT id FROM user_preferences WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (existing.length === 0) {
    throw new ApiError(404, 'Preference profile not found.');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE user_preferences SET is_active = FALSE WHERE user_id = ?', [req.user.id]);
    await conn.query('UPDATE user_preferences SET is_active = TRUE WHERE id = ?', [req.params.id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  res.json({ message: 'Profile set as active.' });
});

module.exports = {
  listPreferences, getPreferenceById, createPreference, updatePreference, deletePreference, activatePreference
};