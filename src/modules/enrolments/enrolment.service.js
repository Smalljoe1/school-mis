const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { sessionId, classId, termId } = queryParams;
  const conditions = []; const values = []; let idx = 1;
  if (sessionId) { conditions.push(`e.session_id = $${idx++}`); values.push(sessionId); }
  if (classId)   { conditions.push(`e.class_id = $${idx++}`);   values.push(classId); }
  if (termId)    { conditions.push(`e.term_id = $${idx++}`);     values.push(termId); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const { rows: data } = await db.query(
    `SELECT e.enrolment_id, e.student_id,
            s.first_name || ' ' || s.last_name AS student_name, s.admission_no,
            e.class_id, c.class_name,
            e.session_id, ss.session_name,
            e.term_id, t.term_name,
            e.enrolment_date, e.status
     FROM enrolments e
     JOIN students s  ON s.student_id  = e.student_id
     JOIN classes  c  ON c.class_id    = e.class_id
     JOIN sessions ss ON ss.session_id = e.session_id
     LEFT JOIN terms t ON t.term_id = e.term_id
     ${where}
     ORDER BY e.enrolment_date DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset],
  );

  const countSql = `SELECT COUNT(*) FROM enrolments e ${where}`;
  const { rows: [{ count }] } = await db.query(countSql, values);
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT e.enrolment_id, e.student_id,
            s.first_name || ' ' || s.last_name AS student_name, s.admission_no,
            e.class_id, c.class_name,
            e.session_id, ss.session_name,
            e.term_id, t.term_name,
            e.enrolment_date, e.status, e.created_at
     FROM enrolments e
     JOIN students s  ON s.student_id  = e.student_id
     JOIN classes  c  ON c.class_id    = e.class_id
     JOIN sessions ss ON ss.session_id = e.session_id
     LEFT JOIN terms t ON t.term_id = e.term_id
     WHERE e.enrolment_id = $1`,
    [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Enrolment not found'), { statusCode: 404 });
  return rows[0];
};

const create = async ({ studentId, classId, sessionId, termId, status }) => {
  const { rows } = await db.query(
    `INSERT INTO enrolments (student_id, class_id, session_id, term_id, status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING enrolment_id, student_id, class_id, session_id, term_id, enrolment_date, status`,
    [studentId, classId, sessionId, termId || null, status || 'active'],
  );
  return rows[0];
};

const update = async (id, { status }) => {
  const { rows } = await db.query(
    `UPDATE enrolments SET status = $1 WHERE enrolment_id = $2
     RETURNING enrolment_id, student_id, class_id, status`,
    [status, id],
  );
  if (!rows[0]) throw Object.assign(new Error('Enrolment not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM enrolments WHERE enrolment_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('Enrolment not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
