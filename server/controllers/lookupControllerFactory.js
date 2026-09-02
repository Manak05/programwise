const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isNonEmptyString } = require('../utils/validators');

/**
 * Builds a simple CRUD controller for a "lookup" table that has just
 * (id, name, [description], [website]) columns: universities, providers,
 * categories, career_goals. Keeps controllers short and consistent
 * instead of writing near-identical code four times.
 */
function buildLookupController(tableName, { hasDescription = false, hasWebsite = false } = {}) {
  const columns = ['name'];
  if (hasDescription) columns.push('description');
  if (hasWebsite) columns.push('website');

  const getAll = asyncHandler(async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY name ASC`);
    res.json(rows);
  });

  const getById = asyncHandler(async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) throw new ApiError(404, `${tableName} record not found.`);
    res.json(rows[0]);
  });

  const create = asyncHandler(async (req, res) => {
    const { name, description, website } = req.body;
    if (!isNonEmptyString(name)) throw new ApiError(400, 'Name is required.');

    const cols = ['name'];
    const vals = [name.trim()];
    if (hasDescription) { cols.push('description'); vals.push(description || null); }
    if (hasWebsite) { cols.push('website'); vals.push(website || null); }

    const placeholders = cols.map(() => '?').join(', ');
    const [result] = await pool.query(
      `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`,
      vals
    );
    res.status(201).json({ id: result.insertId, message: `${tableName} created successfully.` });
  });

  const update = asyncHandler(async (req, res) => {
    const { name, description, website } = req.body;
    if (!isNonEmptyString(name)) throw new ApiError(400, 'Name is required.');

    const setParts = ['name = ?'];
    const vals = [name.trim()];
    if (hasDescription) { setParts.push('description = ?'); vals.push(description || null); }
    if (hasWebsite) { setParts.push('website = ?'); vals.push(website || null); }
    vals.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE ${tableName} SET ${setParts.join(', ')} WHERE id = ?`,
      vals
    );
    if (result.affectedRows === 0) throw new ApiError(404, `${tableName} record not found.`);
    res.json({ message: `${tableName} updated successfully.` });
  });

  const remove = asyncHandler(async (req, res) => {
    const [result] = await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) throw new ApiError(404, `${tableName} record not found.`);
    res.json({ message: `${tableName} deleted successfully.` });
  });

  return { getAll, getById, create, update, remove };
}

module.exports = buildLookupController;
