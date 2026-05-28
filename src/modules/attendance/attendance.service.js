const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { studentId, classId, sessionId, termId, date } = queryParams;
  const conditions = []; const values = []; let idx = 1;
  if (studentId) { conditions.push(`a.student_id = $${idx++}`);      values.push(studentId); }
  if (classId)   { conditions.push(`a.class_id = $${idx++}`);        values.push(classId); }
  if (sessionId) { conditions.push(`a.session_id = $${idx++}`);      values.push(sessionId); }
  if (termId)    { conditions.push(`a.term_id = $${idx++}`);         values.push(termId); }
  if (date)      { conditions.push(`a.attendance_date = $${idx++}`); values.push(date); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const { rows: data } = await db.query(
    `SELECT a.attendance_id, a.student_id,
            s.first_name || ' ' || s.last_name AS student_name,
            a.class_id, c.class_name,
            a.session_id, ss.session_name,
            a.term_id, t.term_name,
            a.attendance_date, a.status,
            a.marked_by, a.created_at
     FROM attendance a
     JOIN students s  ON s.student_id  = a.student_id
     JOIN classes  c  ON c.class_id    = a.class_id
     JOIN sessions ss ON ss.session_id = a.session_id
     JOIN terms    t  ON t.term_id     = a.term_id
     ${where}
     ORDER BY a.attendance_date DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset],
  );

  const { rows: [{ count }] } = await db.query(
    `SELECT COUNT(*) FROM attendance a ${where}`, values,
  );
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT a.*, s.first_name || ' ' || s.last_name AS student_name, c.class_name
     FROM attendance a
     JOIN students s ON s.student_id = a.student_id
     JOIN classes  c ON c.class_id   = a.class_id
     WHERE a.attendance_id = $1`, [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Attendance record not found'), { statusCode: 404 });
  return rows[0];
};

const create = async ({ studentId, classId, sessionId, termId, attendanceDate, status, markedBy }) => {
  const { rows } = await db.query(
    `INSERT INTO attendance (student_id, class_id, session_id, term_id, attendance_date, status, marked_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING attendance_id, student_id, class_id, attendance_date, status`,
    [studentId, classId, sessionId, termId, attendanceDate, status, markedBy || null],
  );
  return rows[0];
};

const bulkCreate = async ({ records, classId, sessionId, termId, attendanceDate }, markedBy) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = [];
    for (const rec of records) {
      const { rows } = await client.query(
        `INSERT INTO attendance (student_id, class_id, session_id, term_id, attendance_date, status, marked_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (student_id, attendance_date, session_id, term_id) DO UPDATE SET status = EXCLUDED.status
         RETURNING attendance_id, student_id, attendance_date, status`,
        [rec.studentId, classId, sessionId, termId, attendanceDate, rec.status, markedBy || null],
      );
      inserted.push(rows[0]);
    }
    await client.query('COMMIT');
    return inserted;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Attendance rate for a student in a session/term.
 */
const getStudentRate = async (studentId, sessionId, termId) => {
  const { rows } = await db.query(
    `SELECT
       COUNT(*) AS total_days,
       COUNT(*) FILTER (WHERE status = 'Present') AS present_days,
       ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Present') / NULLIF(COUNT(*), 0), 2) AS attendance_rate
     FROM attendance
     WHERE student_id = $1 AND session_id = $2 AND term_id = $3`,
    [studentId, sessionId, termId],
  );
  return rows[0];
};

module.exports = { getAll, getById, create, bulkCreate, getStudentRate };
