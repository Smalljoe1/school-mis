const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { search } = queryParams;
  let baseQuery = `SELECT student_id, admission_no, first_name, last_name, gender,
                          date_of_birth, address, parent_name, parent_phone,
                          state_of_origin, lga, date_registered, created_at
                   FROM students`;
  const values = [];
  if (search) {
    baseQuery += ` WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR admission_no ILIKE $1`;
    values.push(`%${search}%`);
  }
  baseQuery += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const { rows: data } = await db.query(baseQuery, values);

  const countQuery = search
    ? `SELECT COUNT(*) FROM students WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR admission_no ILIKE $1`
    : `SELECT COUNT(*) FROM students`;
  const countValues = search ? [`%${search}%`] : [];
  const { rows: [{ count }] } = await db.query(countQuery, countValues);

  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT student_id, admission_no, first_name, last_name, gender,
            date_of_birth, address, parent_name, parent_phone,
            state_of_origin, lga, date_registered, user_id, created_at
     FROM students WHERE student_id = $1`,
    [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Student not found'), { statusCode: 404 });
  return rows[0];
};

const create = async (fields) => {
  const {
    admissionNo, firstName, lastName, gender, dateOfBirth,
    address, parentName, parentPhone, stateOfOrigin, lga,
  } = fields;
  const { rows } = await db.query(
    `INSERT INTO students
       (admission_no, first_name, last_name, gender, date_of_birth, address,
        parent_name, parent_phone, state_of_origin, lga)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING student_id, admission_no, first_name, last_name, gender, date_registered`,
    [admissionNo, firstName, lastName, gender, dateOfBirth || null,
     address || null, parentName || null, parentPhone || null,
     stateOfOrigin || null, lga || null],
  );
  return rows[0];
};

const update = async (id, fields) => {
  const map = {
    firstName: 'first_name', lastName: 'last_name', gender: 'gender',
    dateOfBirth: 'date_of_birth', address: 'address', parentName: 'parent_name',
    parentPhone: 'parent_phone', stateOfOrigin: 'state_of_origin', lga: 'lga',
  };
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
    `UPDATE students SET ${sets.join(', ')} WHERE student_id = $${idx}
     RETURNING student_id, admission_no, first_name, last_name, gender`,
    values,
  );
  if (!rows[0]) throw Object.assign(new Error('Student not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM students WHERE student_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('Student not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
