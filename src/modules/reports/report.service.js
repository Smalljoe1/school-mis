const db = require('../../config/db');

/**
 * Term report for a single student: subjects, scores, attendance rate.
 */
const getStudentTermReport = async (studentId, sessionId, termId) => {
  const { rows: assessments } = await db.query(
    `SELECT sub.subject_name, a.test_score, a.assignment_score, a.exam_score,
            a.total_score, a.grade, a.remark
     FROM assessments a
     JOIN subjects sub ON sub.subject_id = a.subject_id
     WHERE a.student_id = $1 AND a.session_id = $2 AND a.term_id = $3
     ORDER BY sub.subject_name`,
    [studentId, sessionId, termId],
  );

  const { rows: [attendance] } = await db.query(
    `SELECT COUNT(*) AS total_days,
            COUNT(*) FILTER (WHERE status = 'Present') AS present_days,
            ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Present') / NULLIF(COUNT(*), 0), 2) AS rate
     FROM attendance
     WHERE student_id = $1 AND session_id = $2 AND term_id = $3`,
    [studentId, sessionId, termId],
  );

  const { rows: [student] } = await db.query(
    `SELECT s.first_name || ' ' || s.last_name AS full_name, s.admission_no,
            c.class_name, ss.session_name, t.term_name
     FROM students s
     JOIN enrolments e  ON e.student_id  = s.student_id
     JOIN classes    c  ON c.class_id    = e.class_id
     JOIN sessions   ss ON ss.session_id = e.session_id
     JOIN terms      t  ON t.term_id     = e.term_id
     WHERE s.student_id = $1 AND e.session_id = $2 AND e.term_id = $3
     LIMIT 1`,
    [studentId, sessionId, termId],
  );

  return { student, assessments, attendance };
};

/**
 * Class performance summary: average score per subject.
 */
const getClassReport = async (classId, sessionId, termId) => {
  const { rows } = await db.query(
    `SELECT sub.subject_name,
            COUNT(a.assessment_id) AS students_assessed,
            ROUND(AVG(a.total_score), 2) AS avg_score,
            MAX(a.total_score) AS max_score,
            MIN(a.total_score) AS min_score
     FROM assessments a
     JOIN subjects sub ON sub.subject_id = a.subject_id
     WHERE a.class_id = $1 AND a.session_id = $2 AND a.term_id = $3
     GROUP BY sub.subject_name
     ORDER BY sub.subject_name`,
    [classId, sessionId, termId],
  );
  return rows;
};

/**
 * Enrolment summary by session.
 */
const getEnrolmentSummary = async (sessionId) => {
  const { rows } = await db.query(
    `SELECT c.class_name, COUNT(e.enrolment_id) AS total_enrolled
     FROM enrolments e
     JOIN classes c ON c.class_id = e.class_id
     WHERE e.session_id = $1
     GROUP BY c.class_name
     ORDER BY c.class_name`,
    [sessionId],
  );
  return rows;
};

module.exports = { getStudentTermReport, getClassReport, getEnrolmentSummary };
