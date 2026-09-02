const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isValidEmail, isNonEmptyString } = require('../utils/validators');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password)) {
    throw new ApiError(400, 'Name, a valid email, and password are required.');
  }
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new ApiError(400, 'Password and confirm password do not match.');
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name.trim(), email.trim().toLowerCase(), hashedPassword, 'student']
  );

  const user = { id: result.insertId, name: name.trim(), email: email.trim().toLowerCase(), role: 'student' };
  const token = signToken(user);

  res.status(201).json({ token, user });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    throw new ApiError(400, 'A valid email and password are required.');
  }

  const [rows] = await pool.query(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email.trim().toLowerCase()]
  );

  if (rows.length === 0) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const dbUser = rows[0];
  const match = await bcrypt.compare(password, dbUser.password);
  if (!match) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role };
  const token = signToken(user);

  res.json({ token, user });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'User not found.');
  }
  res.json(rows[0]);
});

module.exports = { register, login, getMe };
