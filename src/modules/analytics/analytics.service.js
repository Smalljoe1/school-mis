const db = require('../../config/db');

/**
 * Attendance trend: daily summary for a class/session/term.
 */
const attendanceTrend = async (classId, sessionId, termId) => {
  const { rows } = await db.query(
    `SELECT attendance_date,
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'Present') AS present,
            COUNT(*) FILTER (WHERE status = 'Absent')  AS absent,
            ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'Present') / NULLIF(COUNT(*), 0), 2) AS rate
     FROM attendance
     WHERE class_id = $1 AND session_id = $2 AND term_id = $3
     GROUP BY attendance_date
     ORDER BY attendance_date`,
    [classId, sessionId, termId],
  );
  return rows;
};

/**
 * Top performers in a class for a given term.
 */
const topPerformers = async (classId, sessionId, termId, topN = 10) => {
  const { rows } = await db.query(
    `SELECT a.student_id,
            s.first_name || ' ' || s.last_name AS student_name,
            ROUND(AVG(a.total_score), 2) AS avg_score,
            COUNT(a.subject_id) AS subjects
     FROM assessments a
     JOIN students s ON s.student_id = a.student_id
     WHERE a.class_id = $1 AND a.session_id = $2 AND a.term_id = $3
     GROUP BY a.student_id, s.first_name, s.last_name
     ORDER BY avg_score DESC
     LIMIT $4`,
    [classId, sessionId, termId, topN],
  );
  return rows;
};

/**
 * At-risk students: below-average attendance or average score.
 */
const atRiskStudents = async (sessionId, termId, minAttendanceRate = 70, minAvgScore = 45) => {
  const { rows } = await db.query(
    `SELECT s.student_id, s.first_name || ' ' || s.last_name AS student_name, s.admission_no,
            ROUND(AVG(a.total_score), 2) AS avg_score,
            ROUND(100.0 * COUNT(att.*) FILTER (WHERE att.status = 'Present') / NULLIF(COUNT(att.*), 0), 2) AS attendance_rate
     FROM students s
     LEFT JOIN assessments  a   ON a.student_id  = s.student_id AND a.session_id = $1 AND a.term_id = $2
     LEFT JOIN attendance   att ON att.student_id = s.student_id AND att.session_id = $1 AND att.term_id = $2
     GROUP BY s.student_id, s.first_name, s.last_name, s.admission_no
     HAVING
       ROUND(AVG(a.total_score), 2) < $3
       OR ROUND(100.0 * COUNT(att.*) FILTER (WHERE att.status = 'Present') / NULLIF(COUNT(att.*), 0), 2) < $4
     ORDER BY avg_score ASC`,
    [sessionId, termId, minAvgScore, minAttendanceRate],
  );
  return rows;
};

module.exports = { attendanceTrend, topPerformers, atRiskStudents };
