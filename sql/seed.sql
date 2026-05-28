-- =============================================================
--  School MIS — Seed Data
--  Run AFTER schema.sql
-- =============================================================

-- Roles
INSERT INTO roles (role_name) VALUES
  ('Admin'),
  ('Principal'),
  ('Teacher'),
  ('ClassTeacher'),
  ('Student'),
  ('Parent')
ON CONFLICT (role_name) DO NOTHING;

-- Academic sessions
INSERT INTO sessions (session_name, start_date, end_date, is_current) VALUES
  ('2023/2024', '2023-09-04', '2024-07-05', FALSE),
  ('2024/2025', '2024-09-02', '2025-07-04', TRUE)
ON CONFLICT (session_name) DO NOTHING;

-- Terms
INSERT INTO terms (term_name) VALUES
  ('First Term'),
  ('Second Term'),
  ('Third Term')
ON CONFLICT (term_name) DO NOTHING;

-- Admin user  (password: Admin@123  — bcrypt hash)
INSERT INTO users (full_name, email, phone, password_hash, role_id, status) VALUES
  ('System Administrator', 'admin@schoolmis.local', '08012345678',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 'active'),
  ('Mrs. Grace Aper', 'principal@schoolmis.local', '08023456789',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, 'active'),
  ('Mr. Joseph Nongu', 'teacher1@schoolmis.local', '08034567890',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, 'active'),
  ('Mrs. Mary Tser', 'teacher2@schoolmis.local', '08045678901',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, 'active'),
  ('Mr. Samuel Agba', 'teacher3@schoolmis.local', '08056789012',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, 'active')
ON CONFLICT (email) DO NOTHING;

-- Teachers
INSERT INTO teachers (staff_no, first_name, last_name, gender, phone, email, qualification, hire_date, user_id) VALUES
  ('TCH001', 'Joseph',  'Nongu',  'Male',   '08034567890', 'teacher1@schoolmis.local', 'B.Sc. Computer Science', '2020-01-10',
   (SELECT user_id FROM users WHERE email = 'teacher1@schoolmis.local')),
  ('TCH002', 'Mary',    'Tser',   'Female', '08045678901', 'teacher2@schoolmis.local', 'B.Ed. Biology',         '2019-08-05',
   (SELECT user_id FROM users WHERE email = 'teacher2@schoolmis.local')),
  ('TCH003', 'Samuel',  'Agba',   'Male',   '08056789012', 'teacher3@schoolmis.local', 'B.Ed. Mathematics',     '2021-03-15',
   (SELECT user_id FROM users WHERE email = 'teacher3@schoolmis.local'))
ON CONFLICT (staff_no) DO NOTHING;

-- Classes
INSERT INTO classes (class_name, class_level, class_teacher_id) VALUES
  ('JSS 1A', 'JSS 1', (SELECT teacher_id FROM teachers WHERE staff_no = 'TCH001')),
  ('JSS 2A', 'JSS 2', (SELECT teacher_id FROM teachers WHERE staff_no = 'TCH002')),
  ('SSS 1A', 'SSS 1', (SELECT teacher_id FROM teachers WHERE staff_no = 'TCH003')),
  ('SSS 2A', 'SSS 2', NULL),
  ('SSS 3A', 'SSS 3', NULL);

-- Subjects
INSERT INTO subjects (subject_name, subject_code) VALUES
  ('Biology',           'BIO'),
  ('Chemistry',         'CHE'),
  ('Physics',           'PHY'),
  ('Mathematics',       'MTH'),
  ('English Language',  'ENG'),
  ('Agricultural Science', 'AGR'),
  ('Computer Science',  'CSC'),
  ('Economics',         'ECO'),
  ('Government',        'GOV'),
  ('Literature in English', 'LIT')
ON CONFLICT (subject_code) DO NOTHING;

-- Teacher-subject assignments (session 2, term 1)
INSERT INTO teacher_subjects (teacher_id, subject_id, class_id, session_id, term_id) VALUES
  ((SELECT teacher_id FROM teachers WHERE staff_no = 'TCH001'),
   (SELECT subject_id FROM subjects WHERE subject_code = 'CSC'),
   (SELECT class_id FROM classes WHERE class_name = 'JSS 1A'), 2, 1),
  ((SELECT teacher_id FROM teachers WHERE staff_no = 'TCH002'),
   (SELECT subject_id FROM subjects WHERE subject_code = 'BIO'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 1A'), 2, 1),
  ((SELECT teacher_id FROM teachers WHERE staff_no = 'TCH003'),
   (SELECT subject_id FROM subjects WHERE subject_code = 'MTH'),
   (SELECT class_id FROM classes WHERE class_name = 'JSS 2A'), 2, 1)
ON CONFLICT DO NOTHING;

-- Students (user_id left NULL for simplicity in seed)
INSERT INTO students (admission_no, first_name, last_name, gender, date_of_birth, address, parent_name, parent_phone, state_of_origin, lga) VALUES
  ('ADM/2024/001', 'Ameh',    'Ocholi',  'Male',   '2009-03-14', 'Logo Town',     'Ocholi Ameh Sr.', '07011111111', 'Benue', 'Logo'),
  ('ADM/2024/002', 'Blessing','Ikyegh',  'Female', '2010-06-20', 'Ugbokpo',       'Ikyegh Paul',     '07022222222', 'Benue', 'Logo'),
  ('ADM/2024/003', 'Daniel',  'Tyav',    'Male',   '2009-11-05', 'Adikpo',        'Tyav Moses',      '07033333333', 'Benue', 'Kwande'),
  ('ADM/2024/004', 'Favour',  'Igbana',  'Female', '2010-01-18', 'Vandeikya',     'Igbana John',     '07044444444', 'Benue', 'Vandeikya'),
  ('ADM/2024/005', 'Gabriel', 'Agber',   'Male',   '2008-08-25', 'Gboko',         'Agber Michael',   '07055555555', 'Benue', 'Gboko'),
  ('ADM/2024/006', 'Hannah',  'Terngu',  'Female', '2009-04-10', 'Logo Town',     'Terngu Sarah',    '07066666666', 'Benue', 'Logo'),
  ('ADM/2024/007', 'Isaac',   'Aver',    'Male',   '2010-09-30', 'Katsina-Ala',   'Aver David',      '07077777777', 'Benue', 'Katsina-Ala'),
  ('ADM/2024/008', 'Joy',     'Torwua',  'Female', '2009-12-22', 'Makurdi',       'Torwua Felix',    '07088888888', 'Benue', 'Makurdi'),
  ('ADM/2024/009', 'Kenneth', 'Igber',   'Male',   '2010-07-08', 'Logo Town',     'Igber Peter',     '07099999999', 'Benue', 'Logo'),
  ('ADM/2024/010', 'Lois',    'Uyange',  'Female', '2008-05-16', 'Otukpo',        'Uyange Grace',    '07000000000', 'Benue', 'Otukpo')
ON CONFLICT (admission_no) DO NOTHING;

-- Enrolments (session 2 / First Term)
INSERT INTO enrolments (student_id, class_id, session_id, term_id, status) VALUES
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/001'),
   (SELECT class_id FROM classes WHERE class_name = 'JSS 1A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/002'),
   (SELECT class_id FROM classes WHERE class_name = 'JSS 1A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/003'),
   (SELECT class_id FROM classes WHERE class_name = 'JSS 2A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/004'),
   (SELECT class_id FROM classes WHERE class_name = 'JSS 2A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/005'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 1A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/006'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 1A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/007'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 2A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/008'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 2A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/009'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 3A'), 2, 1, 'active'),
  ((SELECT student_id FROM students WHERE admission_no = 'ADM/2024/010'),
   (SELECT class_id FROM classes WHERE class_name = 'SSS 3A'), 2, 1, 'active')
ON CONFLICT DO NOTHING;

-- Attendance (sample — first week of term)
INSERT INTO attendance (student_id, class_id, session_id, term_id, attendance_date, status, marked_by)
SELECT
  s.student_id,
  e.class_id,
  2,
  1,
  d.attendance_date,
  CASE WHEN RANDOM() > 0.15 THEN 'Present' ELSE 'Absent' END,
  (SELECT teacher_id FROM teachers WHERE staff_no = 'TCH001')
FROM students s
JOIN enrolments e ON e.student_id = s.student_id AND e.session_id = 2 AND e.term_id = 1
CROSS JOIN (
  VALUES
    ('2024-09-09'::DATE),
    ('2024-09-10'::DATE),
    ('2024-09-11'::DATE),
    ('2024-09-12'::DATE),
    ('2024-09-13'::DATE)
) AS d(attendance_date)
ON CONFLICT DO NOTHING;

-- Assessments (Biology — SSS 1A students, session 2 term 1)
INSERT INTO assessments (student_id, subject_id, class_id, session_id, term_id, test_score, assignment_score, exam_score, grade, remark, entered_by)
SELECT
  s.student_id,
  (SELECT subject_id FROM subjects WHERE subject_code = 'BIO'),
  (SELECT class_id FROM classes WHERE class_name = 'SSS 1A'),
  2, 1,
  ROUND((RANDOM() * 15 + 5)::NUMERIC, 2),
  ROUND((RANDOM() * 10 + 5)::NUMERIC, 2),
  ROUND((RANDOM() * 50 + 20)::NUMERIC, 2),
  'B',
  'Good',
  (SELECT teacher_id FROM teachers WHERE staff_no = 'TCH002')
FROM students s
JOIN enrolments e ON e.student_id = s.student_id
  AND e.class_id = (SELECT class_id FROM classes WHERE class_name = 'SSS 1A')
  AND e.session_id = 2
  AND e.term_id = 1
ON CONFLICT DO NOTHING;
