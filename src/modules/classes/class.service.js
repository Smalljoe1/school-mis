const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { rows: data } = await db.query(
    `SELECT c.class_id, c.class_name, c.class_level,
            t.teacher_id AS class_teacher_id,
            t.first_name || ' ' || t.last_name AS class_teacher_name,
            c.created_at
     FROM classes c
     LEFT JOIN teachers t ON t.teacher_id = c.class_teacher_id
     ORDER BY c.class_name
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM classes');
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT c.class_id, c.class_name, c.class_level,
            t.teacher_id AS class_teacher_id,
            t.first_name || ' ' || t.last_name AS class_teacher_name,
            c.created_at
     FROM classes c
     LEFT JOIN teachers t ON t.teacher_id = c.class_teacher_id
     WHERE c.class_id = $1`,
    [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  return rows[0];
};

const create = async ({ className, classLevel, classTeacherId }) => {
  const { rows } = await db.query(
    `INSERT INTO classes (class_name, class_level, class_teacher_id)
     VALUES ($1, $2, $3) RETURNING class_id, class_name, class_level`,
    [className, classLevel || null, classTeacherId || null],
  );
  return rows[0];
};

const update = async (id, fields) => {
  const map = { className: 'class_name', classLevel: 'class_level', classTeacherId: 'class_teacher_id' };
  const sets = []; const values = []; let idx = 1;
  for (const [k, col] of Object.entries(map)) {
    if (fields[k] !== undefined) { sets.push(`${col} = $${idx++}`); values.push(fields[k]); }
  }
  if (!sets.length) throw Object.assign(new Error('No fields to update'), { statusCode: 400 });
  values.push(id);
  const { rows } = await db.query(
    `UPDATE classes SET ${sets.join(', ')} WHERE class_id = $${idx}
     RETURNING class_id, class_name, class_level`,
    values,
  );
  if (!rows[0]) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM classes WHERE class_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('Class not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
