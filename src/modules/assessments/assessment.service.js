const db = require('../../config/db');
const { parsePagination } = require('../../utils/helpers');
const { computeGrade } = require('../../utils/helpers');

const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { studentId, classId, subjectId, sessionId, termId } = queryParams;
  const conditions = []; const values = []; let idx = 1;
  if (studentId) { conditions.push(`a.student_id = $${idx++}`); values.push(studentId); }
  if (classId)   { conditions.push(`a.class_id = $${idx++}`);   values.push(classId); }
  if (subjectId) { conditions.push(`a.subject_id = $${idx++}`); values.push(subjectId); }
  if (sessionId) { conditions.push(`a.session_id = $${idx++}`); values.push(sessionId); }
  if (termId)    { conditions.push(`a.term_id = $${idx++}`);    values.push(termId); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const { rows: data } = await db.query(
    `SELECT a.assessment_id, a.student_id,
            s.first_name || ' ' || s.last_name AS student_name,
            a.subject_id, sub.subject_name,
            a.class_id, c.class_name,
            a.session_id, ss.session_name,
            a.term_id, t.term_name,
            a.test_score, a.assignment_score, a.exam_score, a.total_score,
            a.grade, a.remark, a.created_at
     FROM assessments a
     JOIN students s  ON s.student_id  = a.student_id
     JOIN subjects sub ON sub.subject_id = a.subject_id
     JOIN classes  c  ON c.class_id    = a.class_id
     JOIN sessions ss ON ss.session_id = a.session_id
     JOIN terms    t  ON t.term_id     = a.term_id
     ${where}
     ORDER BY a.created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset],
  );

  const { rows: [{ count }] } = await db.query(
    `SELECT COUNT(*) FROM assessments a ${where}`, values,
  );
  return { data, total: Number(count), page, limit };
};

const getById = async (id) => {
  const { rows } = await db.query(
    `SELECT a.*, s.first_name || ' ' || s.last_name AS student_name,
            sub.subject_name, c.class_name, ss.session_name, t.term_name
     FROM assessments a
     JOIN students s   ON s.student_id   = a.student_id
     JOIN subjects sub ON sub.subject_id = a.subject_id
     JOIN classes  c   ON c.class_id     = a.class_id
     JOIN sessions ss  ON ss.session_id  = a.session_id
     JOIN terms    t   ON t.term_id      = a.term_id
     WHERE a.assessment_id = $1`, [id],
  );
  if (!rows[0]) throw Object.assign(new Error('Assessment not found'), { statusCode: 404 });
  return rows[0];
};

const create = async (fields) => {
  const { studentId, subjectId, classId, sessionId, termId,
          testScore, assignmentScore, examScore, enteredBy } = fields;
  const total = Number(testScore) + Number(assignmentScore) + Number(examScore);
  const { grade, remark } = computeGrade(total);

  const { rows } = await db.query(
    `INSERT INTO assessments
       (student_id, subject_id, class_id, session_id, term_id,
        test_score, assignment_score, exam_score, grade, remark, entered_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING assessment_id, student_id, subject_id, total_score, grade, remark`,
    [studentId, subjectId, classId, sessionId, termId,
     testScore, assignmentScore, examScore, grade, remark, enteredBy || null],
  );
  return rows[0];
};

const update = async (id, fields) => {
  const { testScore, assignmentScore, examScore } = fields;
  // Fetch existing scores to recalculate
  const existing = await getById(id);
  const ts = testScore       !== undefined ? Number(testScore)       : Number(existing.test_score);
  const as = assignmentScore !== undefined ? Number(assignmentScore) : Number(existing.assignment_score);
  const es = examScore       !== undefined ? Number(examScore)       : Number(existing.exam_score);
  const { grade, remark } = computeGrade(ts + as + es);

  const { rows } = await db.query(
    `UPDATE assessments
     SET test_score = $1, assignment_score = $2, exam_score = $3, grade = $4, remark = $5
     WHERE assessment_id = $6
     RETURNING assessment_id, student_id, subject_id, total_score, grade, remark`,
    [ts, as, es, grade, remark, id],
  );
  if (!rows[0]) throw Object.assign(new Error('Assessment not found'), { statusCode: 404 });
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM assessments WHERE assessment_id = $1', [id]);
  if (!rowCount) throw Object.assign(new Error('Assessment not found'), { statusCode: 404 });
};

module.exports = { getAll, getById, create, update, remove };
