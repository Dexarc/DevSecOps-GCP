const express = require('express');
const loadDatabaseSecrets = require('./secrets.js');
const mysql = require('mysql2/promise');

const MAX_RETRIES = 3;

async function executeQuery(pool) {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const [rows] = await pool.execute('SELECT * FROM entries');
      return rows;
    } catch (error) {
      console.error('Error executing database query:', error);

      retryCount++;
      console.log(`Retrying... (Attempt ${retryCount})`);

      // Add a delay before the next attempt (optional)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Retry limit reached. Unable to execute database query.');
}

async function startServer() {
  try {
    const secrets = await loadDatabaseSecrets();
    const { host, user, password, database } = secrets.database;

    const pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const app = express();
    const PORT = process.env.PORT || 8080;

    app.use(express.json());

    app.get('/', async (req, res) => {
      try {
        const rows = await executeQuery(pool);
        res.json({ data: rows });
      } catch (error) {
        console.error('Error handling database query:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error loading database secrets:', error.message);
  }
}

startServer();
