const ROLES = {
  ADMIN: 'Admin',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  CLASS_TEACHER: 'ClassTeacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  EXCUSED: 'Excused',
};

const ENROLMENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TRANSFERRED: 'transferred',
  GRADUATED: 'graduated',
};

const ALERT_TYPES = {
  LOW_ATTENDANCE: 'Low Attendance',
  POOR_PERFORMANCE: 'Poor Performance',
  AT_RISK: 'At Risk',
};

const GRADE_SCALE = [
  { min: 75, max: 100, grade: 'A', remark: 'Excellent' },
  { min: 65, max: 74,  grade: 'B', remark: 'Good' },
  { min: 55, max: 64,  grade: 'C', remark: 'Average' },
  { min: 45, max: 54,  grade: 'D', remark: 'Below Average' },
  { min: 0,  max: 44,  grade: 'F', remark: 'Fail' },
];

module.exports = { ROLES, ATTENDANCE_STATUS, ENROLMENT_STATUS, ALERT_TYPES, GRADE_SCALE };
