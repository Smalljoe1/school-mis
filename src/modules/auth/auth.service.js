const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const env = require('../../config/env');

/**
 * Validate credentials and return a signed JWT.
 */
const login = async (email, password) => {
  const { rows } = await db.query(
    `SELECT u.user_id, u.full_name, u.email, u.password_hash, u.status, r.role_name
     FROM users u
     JOIN roles r ON r.role_id = u.role_id
     WHERE u.email = $1`,
    [email],
  );

  const user = rows[0];
  if (!user) throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  if (user.status !== 'active')
    throw Object.assign(new Error('Account is inactive'), { statusCode: 403 });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });

  const payload = { userId: user.user_id, email: user.email, role: user.role_name };
  const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

  return {
    token,
    user: { userId: user.user_id, fullName: user.full_name, email: user.email, role: user.role_name },
  };
};

/**
 * Return the authenticated user's profile.
 */
const getProfile = async (userId) => {
  const { rows } = await db.query(
    `SELECT u.user_id, u.full_name, u.email, u.phone, u.status, r.role_name, u.created_at
     FROM users u
     JOIN roles r ON r.role_id = u.role_id
     WHERE u.user_id = $1`,
    [userId],
  );
  if (!rows[0]) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return rows[0];
};

/**
 * Change the authenticated user's password.
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const { rows } = await db.query(
    'SELECT password_hash FROM users WHERE user_id = $1',
    [userId],
  );
  const user = rows[0];
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 });

  const hash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [hash, userId]);
};

module.exports = { login, getProfile, changePassword };
