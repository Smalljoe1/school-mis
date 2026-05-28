-- =============================================================
--  School MIS — PostgreSQL Schema
--  Database: school_mis
-- =============================================================

-- -------------------------
--  Lookup / reference tables
-- -------------------------

CREATE TABLE IF NOT EXISTS roles (
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id   SERIAL PRIMARY KEY,
    session_name VARCHAR(20) UNIQUE NOT NULL,  -- e.g. 2025/2026
    start_date   DATE,
    end_date     DATE,
    is_current   BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS terms (
    term_id   SERIAL PRIMARY KEY,
    term_name VARCHAR(30) UNIQUE NOT NULL  -- First Term | Second Term | Third Term
);

-- -------------------------
--  Users & access
-- -------------------------

CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(120) UNIQUE,
    phone         VARCHAR(20),
    password_hash TEXT NOT NULL,
    role_id       INT REFERENCES roles(role_id),
    status        VARCHAR(20) DEFAULT 'active',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
--  People
-- -------------------------

CREATE TABLE IF NOT EXISTS teachers (
    teacher_id    SERIAL PRIMARY KEY,
    staff_no      VARCHAR(50) UNIQUE NOT NULL,
    first_name    VARCHAR(80) NOT NULL,
    last_name     VARCHAR(80) NOT NULL,
    gender        VARCHAR(10),
    phone         VARCHAR(20),
    email         VARCHAR(120),
    qualification VARCHAR(120),
    hire_date     DATE,
    user_id       INT UNIQUE REFERENCES users(user_id),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    student_id      SERIAL PRIMARY KEY,
    admission_no    VARCHAR(50) UNIQUE NOT NULL,
    first_name      VARCHAR(80) NOT NULL,
    last_name       VARCHAR(80) NOT NULL,
    gender          VARCHAR(10),
    date_of_birth   DATE,
    address         TEXT,
    parent_name     VARCHAR(150),
    parent_phone    VARCHAR(20),
    state_of_origin VARCHAR(100),
    lga             VARCHAR(100),
    date_registered DATE DEFAULT CURRENT_DATE,
    user_id         INT UNIQUE REFERENCES users(user_id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parents (
    parent_id    SERIAL PRIMARY KEY,
    full_name    VARCHAR(150) NOT NULL,
    phone        VARCHAR(20),
    email        VARCHAR(120),
    address      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_parents (
    student_parent_id SERIAL PRIMARY KEY,
    student_id        INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    parent_id         INT NOT NULL REFERENCES parents(parent_id) ON DELETE CASCADE,
    relationship_type VARCHAR(50),  -- Father | Mother | Guardian
    UNIQUE(student_id, parent_id)
);

-- -------------------------
--  Academic structure
-- -------------------------

CREATE TABLE IF NOT EXISTS classes (
    class_id         SERIAL PRIMARY KEY,
    class_name       VARCHAR(50) NOT NULL,
    class_level      VARCHAR(50),
    class_teacher_id INT REFERENCES teachers(teacher_id),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    subject_id   SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
    teacher_subject_id SERIAL PRIMARY KEY,
    teacher_id         INT NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    subject_id         INT NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    class_id           INT NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
    session_id         INT NOT NULL REFERENCES sessions(session_id),
    term_id            INT NOT NULL REFERENCES terms(term_id),
    UNIQUE(teacher_id, subject_id, class_id, session_id, term_id)
);

-- -------------------------
--  Enrolment
-- -------------------------

CREATE TABLE IF NOT EXISTS enrolments (
    enrolment_id    SERIAL PRIMARY KEY,
    student_id      INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    class_id        INT NOT NULL REFERENCES classes(class_id),
    session_id      INT NOT NULL REFERENCES sessions(session_id),
    term_id         INT REFERENCES terms(term_id),
    enrolment_date  DATE DEFAULT CURRENT_DATE,
    status          VARCHAR(20) DEFAULT 'active',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id, session_id, term_id)
);

-- -------------------------
--  Attendance
-- -------------------------

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id   SERIAL PRIMARY KEY,
    student_id      INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    class_id        INT NOT NULL REFERENCES classes(class_id),
    session_id      INT NOT NULL REFERENCES sessions(session_id),
    term_id         INT NOT NULL REFERENCES terms(term_id),
    attendance_date DATE NOT NULL,
    status          VARCHAR(20) NOT NULL CHECK (status IN ('Present','Absent','Late','Excused')),
    marked_by       INT REFERENCES teachers(teacher_id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, attendance_date, session_id, term_id)
);

-- -------------------------
--  Assessments / Scores
-- -------------------------

CREATE TABLE IF NOT EXISTS assessments (
    assessment_id    SERIAL PRIMARY KEY,
    student_id       INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    subject_id       INT NOT NULL REFERENCES subjects(subject_id),
    class_id         INT NOT NULL REFERENCES classes(class_id),
    session_id       INT NOT NULL REFERENCES sessions(session_id),
    term_id          INT NOT NULL REFERENCES terms(term_id),
    test_score       NUMERIC(5,2) DEFAULT 0,
    assignment_score NUMERIC(5,2) DEFAULT 0,
    exam_score       NUMERIC(5,2) DEFAULT 0,
    total_score      NUMERIC(5,2) GENERATED ALWAYS AS (test_score + assignment_score + exam_score) STORED,
    grade            VARCHAR(5),
    remark           VARCHAR(100),
    entered_by       INT REFERENCES teachers(teacher_id),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, class_id, session_id, term_id)
);

-- -------------------------
--  Performance summary
-- -------------------------

CREATE TABLE IF NOT EXISTS performance_summary (
    summary_id        SERIAL PRIMARY KEY,
    student_id        INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    class_id          INT NOT NULL REFERENCES classes(class_id),
    session_id        INT NOT NULL REFERENCES sessions(session_id),
    term_id           INT NOT NULL REFERENCES terms(term_id),
    total_subjects    INT DEFAULT 0,
    total_score       NUMERIC(8,2) DEFAULT 0,
    average_score     NUMERIC(5,2) DEFAULT 0,
    position_in_class INT,
    attendance_rate   NUMERIC(5,2) DEFAULT 0,
    remark            VARCHAR(100),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, session_id, term_id)
);

-- -------------------------
--  Alerts
-- -------------------------

CREATE TABLE IF NOT EXISTS alerts (
    alert_id   SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,  -- Low Attendance | Poor Performance | At Risk
    message    TEXT,
    status     VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------
--  Indexes for performance
-- -------------------------

CREATE INDEX IF NOT EXISTS idx_enrolments_student   ON enrolments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrolments_session   ON enrolments(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student   ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date      ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_assessments_student  ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_subject  ON assessments(subject_id);
CREATE INDEX IF NOT EXISTS idx_alerts_student       ON alerts(student_id);
