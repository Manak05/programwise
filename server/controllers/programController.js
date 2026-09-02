const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isNonEmptyString, isPositiveNumber } = require('../utils/validators');

// GET /api/programs
// Supports: search, category, budgetMax, durationMax, delivery, experience, includeInactive
// This is a real SQL query with JOINs across universities/providers/categories.
const getPrograms = asyncHandler(async (req, res) => {
  const {
    search, category, budgetMax, durationMax, delivery, experience, includeInactive
  } = req.query;

  const conditions = [];
  const params = [];

  if (!includeInactive) {
    conditions.push('p.is_active = TRUE');
  }
  if (search) {
    conditions.push('(p.title LIKE ? OR p.description LIKE ? OR u.name LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (category) {
    conditions.push('p.category_id = ?');
    params.push(category);
  }
  if (budgetMax) {
    conditions.push('p.fee <= ?');
    params.push(budgetMax);
  }
  if (durationMax) {
    conditions.push('p.duration_months <= ?');
    params.push(durationMax);
  }
  if (delivery) {
    conditions.push('p.delivery_mode = ?');
    params.push(delivery);
  }
  if (experience) {
    conditions.push('p.experience_level = ?');
    params.push(experience);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT
        p.id, p.title, p.description, p.fee, p.currency, p.duration_months,
        p.delivery_mode, p.experience_level, p.prerequisites, p.outcomes,
        p.is_active, p.created_at,
        u.id AS university_id, u.name AS university_name,
        pr.id AS provider_id, pr.name AS provider_name,
        c.id AS category_id, c.name AS category_name
     FROM programs p
     JOIN universities u ON p.university_id = u.id
     JOIN providers pr ON p.provider_id = pr.id
     JOIN categories c ON p.category_id = c.id
     ${whereClause}
     ORDER BY p.created_at DESC`,
    params
  );

  res.json(rows);
});

// GET /api/programs/:id  (full detail including related career goals)
const getProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `SELECT
        p.*,
        u.name AS university_name, u.website AS university_website,
        pr.name AS provider_name, pr.website AS provider_website,
        c.name AS category_name
     FROM programs p
     JOIN universities u ON p.university_id = u.id
     JOIN providers pr ON p.provider_id = pr.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Program not found.');
  }

  const [careerGoals] = await pool.query(
    `SELECT cg.id, cg.name
     FROM program_career_goals pcg
     JOIN career_goals cg ON pcg.career_goal_id = cg.id
     WHERE pcg.program_id = ?`,
    [id]
  );

  res.json({ ...rows[0], career_goals: careerGoals });
});

// POST /api/programs  (admin only)
const createProgram = asyncHandler(async (req, res) => {
  const {
    title, university_id, provider_id, category_id, description, fee, currency,
    duration_months, delivery_mode, experience_level, prerequisites, outcomes,
    career_goal_ids
  } = req.body;

  if (!isNonEmptyString(title) || !university_id || !provider_id || !category_id) {
    throw new ApiError(400, 'Title, university, provider, and category are required.');
  }
  if (!isPositiveNumber(fee) || !isPositiveNumber(duration_months)) {
    throw new ApiError(400, 'Fee and duration must be valid positive numbers.');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO programs
        (title, university_id, provider_id, category_id, description, fee, currency,
         duration_months, delivery_mode, experience_level, prerequisites, outcomes, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        title.trim(), university_id, provider_id, category_id, description || null,
        fee, currency || 'INR', duration_months, delivery_mode || 'Online',
        experience_level || 'Beginner', prerequisites || null, outcomes || null
      ]
    );

    const programId = result.insertId;

    if (Array.isArray(career_goal_ids) && career_goal_ids.length > 0) {
      const values = career_goal_ids.map((gid) => [programId, gid]);
      await conn.query(
        'INSERT INTO program_career_goals (program_id, career_goal_id) VALUES ?',
        [values]
      );
    }

    await conn.commit();
    res.status(201).json({ id: programId, message: 'Program created successfully.' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// PUT /api/programs/:id  (admin only)
const updateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title, university_id, provider_id, category_id, description, fee, currency,
    duration_months, delivery_mode, experience_level, prerequisites, outcomes,
    is_active, career_goal_ids
  } = req.body;

  const [existing] = await pool.query('SELECT id FROM programs WHERE id = ?', [id]);
  if (existing.length === 0) {
    throw new ApiError(404, 'Program not found.');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE programs SET
        title = ?, university_id = ?, provider_id = ?, category_id = ?, description = ?,
        fee = ?, currency = ?, duration_months = ?, delivery_mode = ?, experience_level = ?,
        prerequisites = ?, outcomes = ?, is_active = ?
       WHERE id = ?`,
      [
        title, university_id, provider_id, category_id, description || null,
        fee, currency || 'INR', duration_months, delivery_mode, experience_level,
        prerequisites || null, outcomes || null,
        is_active === undefined ? true : is_active,
        id
      ]
    );

    if (Array.isArray(career_goal_ids)) {
      await conn.query('DELETE FROM program_career_goals WHERE program_id = ?', [id]);
      if (career_goal_ids.length > 0) {
        const values = career_goal_ids.map((gid) => [id, gid]);
        await conn.query(
          'INSERT INTO program_career_goals (program_id, career_goal_id) VALUES ?',
          [values]
        );
      }
    }

    await conn.commit();
    res.json({ message: 'Program updated successfully.' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// PATCH /api/programs/:id/deactivate (admin only)
const deactivateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query('UPDATE programs SET is_active = FALSE WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Program not found.');
  }
  res.json({ message: 'Program deactivated successfully.' });
});

// PATCH /api/programs/:id/activate (admin only)
const activateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query('UPDATE programs SET is_active = TRUE WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Program not found.');
  }
  res.json({ message: 'Program activated successfully.' });
});

// DELETE /api/programs/:id  (admin only) - hard delete
const deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query('DELETE FROM programs WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new ApiError(404, 'Program not found.');
  }
  res.json({ message: 'Program deleted successfully.' });
});

// GET /api/programs/compare?ids=1,2,3
const comparePrograms = asyncHandler(async (req, res) => {
  const { ids } = req.query;
  if (!ids) {
    throw new ApiError(400, 'Provide program ids to compare, e.g. ?ids=1,2,3');
  }
  const idList = ids.split(',').map((n) => parseInt(n, 10)).filter(Boolean);
  if (idList.length < 2 || idList.length > 3) {
    throw new ApiError(400, 'You must compare between 2 and 3 programs.');
  }

  const placeholders = idList.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT
        p.id, p.title, p.description, p.fee, p.currency, p.duration_months,
        p.delivery_mode, p.experience_level, p.outcomes,
        u.name AS university_name, pr.name AS provider_name, c.name AS category_name
     FROM programs p
     JOIN universities u ON p.university_id = u.id
     JOIN providers pr ON p.provider_id = pr.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.id IN (${placeholders})`,
    idList
  );

  // Attach career goals for each program
  for (const program of rows) {
    const [goals] = await pool.query(
      `SELECT cg.name FROM program_career_goals pcg
       JOIN career_goals cg ON pcg.career_goal_id = cg.id
       WHERE pcg.program_id = ?`,
      [program.id]
    );
    program.career_goals = goals.map((g) => g.name);
  }

  res.json(rows);
});

module.exports = {
  getPrograms, getProgramById, createProgram, updateProgram,
  deactivateProgram, activateProgram, deleteProgram, comparePrograms
};
