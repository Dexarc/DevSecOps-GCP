const express = require('express');
const { database } = require('./secret');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 8080;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example REST API endpoint to retrieve data from the database
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM your_table_name');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching data from the database:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
