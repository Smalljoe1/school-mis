const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { rows: data } = await db.query(
    `SELECT u.user_id, u.full_name, u.email, u.phone, u.status, r.role_name, u.created_at
     FROM users u JOIN roles r ON r.role_id = u.role_id
     ORDER BY u.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM users');
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT u.user_id, u.full_name, u.email, u.phone, u.status, r.role_name, u.created_at
     FROM users u JOIN roles r ON r.role_id = u.role_id WHERE u.user_id = $1`,
    [id],
  );
  if (!rows[0]) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return rows[0];
};

const create = async ({ fullName, email, phone, password, roleId, status }) => {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    `INSERT INTO users (full_name, email, phone, password_hash, role_id, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, full_name, email, phone, status, created_at`,
    [fullName, email, phone || null, hash, roleId, status || 'active'],
  );
  return rows[0];
};

const update = async (id, fields) => {
  const allowed = ['full_name', 'email', 'phone', 'status'];
  const map = { fullName: 'full_name', email: 'email', phone: 'phone', status: 'status' };
  const sets = [];
  const values = [];
  let idx = 1;
  for (const [k, col] of Object.entries(map)) {
    if (fields[k] !== undefined) {
      sets.push(`${col} = $${idx++}`);
      values.push(fields[k]);
    }
  }
  if (!sets.length) throw Object.assign(new Error('No fields to update'), { statusCode: 400 });
  values.push(id);
  const { rows } = await db.query(
    `UPDATE users SET ${sets.join(', ')} WHERE user_id = $${idx} RETURNING user_id, full_name, email, phone, status`,
    values,
  );
  if (!rows[0]) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM users WHERE user_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('User not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
