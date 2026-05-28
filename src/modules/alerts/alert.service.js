const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { studentId, status } = queryParams;
  const conditions = []; const values = []; let idx = 1;
  if (studentId) { conditions.push(`al.student_id = $${idx++}`); values.push(studentId); }
  if (status)    { conditions.push(`al.status = $${idx++}`);      values.push(status); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const { rows: data } = await db.query(
    `SELECT al.alert_id, al.student_id,
            s.first_name || ' ' || s.last_name AS student_name,
            al.alert_type, al.message, al.status, al.created_at
     FROM alerts al
     JOIN students s ON s.student_id = al.student_id
     ${where}
     ORDER BY al.created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset],
  );
  const { rows: [{ count }] } = await db.query(
    `SELECT COUNT(*) FROM alerts al ${where}`, values,
  );
  return { data, total: Number(count), page, limit };
};

const create = async ({ studentId, alertType, message }) => {
  const { rows } = await db.query(
    `INSERT INTO alerts (student_id, alert_type, message)
     VALUES ($1, $2, $3)
     RETURNING alert_id, student_id, alert_type, message, status, created_at`,
    [studentId, alertType, message || null],
  );
  return rows[0];
};

const resolve = async (id) => {
  const { rows } = await db.query(
    `UPDATE alerts SET status = 'resolved' WHERE alert_id = $1
     RETURNING alert_id, status`,
    [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Alert not found'), { statusCode: 404 });
  return rows[0];
};

module.exports = { getAll, create, resolve };
