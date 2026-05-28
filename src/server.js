require('dotenv').config();
const app = require('./app');
const { connect } = require('./config/db');
const env = require('./config/env');

const start = async () => {
  try {
    await connect();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
      console.log(`API docs: http://localhost:${env.port}/api/v1/docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
