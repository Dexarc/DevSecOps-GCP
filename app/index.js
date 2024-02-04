// index.js
const express = require('express');
const loadDatabaseSecrets = require('./secrets.js'); // Assuming loadDatabaseSecrets is the correct function to call
const mysql = require('mysql2/promise');

async function startServer() {
  try {
    const secrets = await loadDatabaseSecrets();
    // Verify that 'secrets' is an object with the 'database' property
    const { host, user, password, database } = secrets.database;

    // Create a MySQL connection pool
    const pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port: 8080,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const app = express();
    const PORT = process.env.PORT || 8080;

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Example REST API endpoint to retrieve data from the database
    app.get('/', async (req, res) => {
      try {
        const [rows] = await pool.execute('SELECT * FROM entries');
        res.json({ data: rows });
      } catch (error) {
        console.error('Error executing database query:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error loading database secrets:', error.message);
  }
}

startServer();
