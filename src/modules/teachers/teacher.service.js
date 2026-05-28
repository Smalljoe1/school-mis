const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const cols = `t.teacher_id, t.staff_no, t.first_name, t.last_name, t.gender,
              t.phone, t.email, t.qualification, t.hire_date, t.user_id, t.created_at`;

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { rows: data } = await db.query(
    `SELECT ${cols} FROM teachers t ORDER BY t.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM teachers');
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT ${cols} FROM teachers t WHERE t.teacher_id = $1`, [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  return rows[0];
};

const create = async (fields) => {
  const { staffNo, firstName, lastName, gender, phone, email, qualification, hireDate } = fields;
  const { rows } = await db.query(
    `INSERT INTO teachers (staff_no, first_name, last_name, gender, phone, email, qualification, hire_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING teacher_id, staff_no, first_name, last_name, gender`,
    [staffNo, firstName, lastName, gender, phone || null, email || null,
     qualification || null, hireDate || null],
  );
  return rows[0];
};

const update = async (id, fields) => {
  const map = {
    firstName: 'first_name', lastName: 'last_name', gender: 'gender',
    phone: 'phone', email: 'email', qualification: 'qualification', hireDate: 'hire_date',
  };
  const sets = []; const values = []; let idx = 1;
  for (const [k, col] of Object.entries(map)) {
    if (fields[k] !== undefined) { sets.push(`${col} = $${idx++}`); values.push(fields[k]); }
  }
  if (!sets.length) throw Object.assign(new Error('No fields to update'), { statusCode: 400 });
  values.push(id);
  const { rows } = await db.query(
    `UPDATE teachers SET ${sets.join(', ')} WHERE teacher_id = $${idx}
     RETURNING teacher_id, staff_no, first_name, last_name, gender`,
    values,
  );
  if (!rows[0]) throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM teachers WHERE teacher_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
