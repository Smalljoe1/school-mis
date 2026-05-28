const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Run a parameterized query.
 * @param {string} text  - SQL statement
 * @param {Array}  params - Query parameters
 */
const query = (text, params) => pool.query(text, params);

/**
 * Verify the database connection on startup.
 */
const connect = async () => {
  const client = await pool.connect();
  console.log('PostgreSQL connected to database:', env.db.database);
  client.release();
};

module.exports = { query, connect, pool };
