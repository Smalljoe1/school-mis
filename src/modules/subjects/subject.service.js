const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { rows: data } = await db.query(
    `SELECT subject_id, subject_name, subject_code, created_at
     FROM subjects ORDER BY subject_name LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM subjects');
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT subject_id, subject_name, subject_code, created_at FROM subjects WHERE subject_id = $1`, [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Subject not found'), { statusCode: 404 });
  return rows[0];
};

const create = async ({ subjectName, subjectCode }) => {
  const { rows } = await db.query(
    `INSERT INTO subjects (subject_name, subject_code) VALUES ($1, $2)
     RETURNING subject_id, subject_name, subject_code`,
    [subjectName, subjectCode || null],
  );
  return rows[0];
};

const update = async (id, fields) => {
  const map = { subjectName: 'subject_name', subjectCode: 'subject_code' };
  const sets = []; const values = []; let idx = 1;
  for (const [k, col] of Object.entries(map)) {
    if (fields[k] !== undefined) { sets.push(`${col} = $${idx++}`); values.push(fields[k]); }
  }
  if (!sets.length) throw Object.assign(new Error('No fields to update'), { statusCode: 400 });
  values.push(id);
  const { rows } = await db.query(
    `UPDATE subjects SET ${sets.join(', ')} WHERE subject_id = $${idx}
     RETURNING subject_id, subject_name, subject_code`,
    values,
  );
  if (!rows[0]) throw Object.assign(new Error('Subject not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM subjects WHERE subject_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('Subject not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
