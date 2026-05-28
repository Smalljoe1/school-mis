# School Management Information System (School MIS)

A Node.js/Express/PostgreSQL backend for monitoring **student enrolment, attendance, and academic performance** in secondary schools — built as part of a PhD research project in Logo Local Government Area, Benue State, Nigeria.

---

## Features

- JWT authentication with role-based access control (Admin, Principal, Teacher, ClassTeacher, Student, Parent)
- Student registration and management
- Class and subject management
- Teacher management
- Enrolment tracking
- Daily attendance recording (individual and bulk)
- Score entry and automated grade computation
- Term and class performance reports
- Analytics: attendance trends, top performers, at-risk student detection
- Alerts system for early intervention
- Swagger/OpenAPI documentation
- Parameterised SQL queries via the `pg` driver (no ORM)

---

## Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Runtime    | Node.js               |
| Framework  | Express 4             |
| Database   | PostgreSQL            |
| Auth       | JSON Web Tokens (JWT) |
| Validation | express-validator     |
| Docs       | Swagger UI / OpenAPI  |

---

## Project Structure

```
school-mis/
├── src/
│   ├── app.js              Express application factory
│   ├── server.js           Server entry point
│   ├── config/             DB, env, Swagger config
│   ├── middlewares/        Auth, role, validation, error handlers
│   ├── utils/              asyncHandler, apiResponse, constants, helpers
│   ├── routes/index.js     Route aggregator
│   ├── docs/openapi.yaml   OpenAPI specification
│   └── modules/
│       ├── auth/           Login, profile, change password
│       ├── users/          User CRUD
│       ├── students/       Student CRUD + search
│       ├── teachers/       Teacher CRUD
│       ├── classes/        Class CRUD
│       ├── subjects/       Subject CRUD
│       ├── enrolments/     Enrolment management
│       ├── attendance/     Attendance + bulk recording + rate
│       ├── assessments/    Score entry + grade computation
│       ├── reports/        Student / class / enrolment reports
│       ├── analytics/      Trends, top performers, at-risk
│       └── alerts/         Student alert management
├── sql/
│   ├── schema.sql          PostgreSQL DDL
│   └── seed.sql            Sample data
├── .env.example
├── package.json
└── README.md
```

---

## Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14

### 2. Clone and install

```bash
git clone https://github.com/Smalljoe1/school-mis.git
cd school-mis
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env and set your DB credentials and JWT secret
```

### 4. Create the database and load schema

```bash
psql -U postgres -c "CREATE DATABASE school_mis;"
psql -U postgres -d school_mis -f sql/schema.sql
psql -U postgres -d school_mis -f sql/seed.sql
```

### 5. Start the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.  
Swagger docs: `http://localhost:3000/api/v1/docs`

---

## API Overview

Base URL: `/api/v1`

| Method | Endpoint                            | Description                         |
|--------|-------------------------------------|-------------------------------------|
| GET    | `/health`                           | Health check                        |
| POST   | `/auth/login`                       | Login — returns JWT                 |
| GET    | `/auth/profile`                     | Current user profile                |
| PATCH  | `/auth/change-password`             | Change password                     |
| GET    | `/students`                         | List students (search, paginate)    |
| POST   | `/students`                         | Register a student                  |
| GET    | `/students/:id`                     | Get student by ID                   |
| PATCH  | `/students/:id`                     | Update student                      |
| DELETE | `/students/:id`                     | Delete student (Admin)              |
| GET    | `/attendance`                       | List attendance records             |
| POST   | `/attendance`                       | Record single attendance            |
| POST   | `/attendance/bulk`                  | Record whole-class attendance       |
| GET    | `/attendance/student/:id/rate`      | Get student attendance rate         |
| POST   | `/assessments`                      | Enter scores (grade auto-computed)  |
| GET    | `/reports/student/:id`              | Student term report                 |
| GET    | `/reports/class/:id`                | Class performance report            |
| GET    | `/analytics/attendance-trend`       | Daily attendance trend              |
| GET    | `/analytics/top-performers`         | Top performers in a class           |
| GET    | `/analytics/at-risk`                | At-risk students                    |
| GET    | `/alerts`                           | List alerts                         |
| POST   | `/alerts`                           | Create an alert                     |
| PATCH  | `/alerts/:id/resolve`               | Resolve an alert                    |

---

## Default Login (from seed data)

| Role      | Email                          | Password    |
|-----------|--------------------------------|-------------|
| Admin     | admin@schoolmis.local          | Admin@123   |
| Principal | principal@schoolmis.local      | Admin@123   |
| Teacher   | teacher1@schoolmis.local       | Admin@123   |

---

## Grading Scale

| Score      | Grade | Remark        |
|------------|-------|---------------|
| 75 – 100   | A     | Excellent     |
| 65 – 74    | B     | Good          |
| 55 – 64    | C     | Average       |
| 45 – 54    | D     | Below Average |
| 0 – 44     | F     | Fail          |

---

## Running Tests

```bash
npm test
```

---

## License

MIT © Joseph Nongu
