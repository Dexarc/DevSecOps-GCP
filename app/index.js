import express from 'express';
import { getSecret } from './secrets'; // Adjust the path as needed
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 8080;

export async function startApp(cloudSQLConnectionString, dbUser, dbPassword, dbName) {
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      host: cloudSQLConnectionString,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    // REST API endpoint to fetch data from Cloud SQL
    app.get('/api/data', async (req, res) => {
      try {
        // Query data from the database
        const [rows] = await pool.query('SELECT * FROM your_table_name');

        // Send the fetched data as JSON response
        res.json(rows);
      } catch (error) {
        console.error('Error fetching data from Cloud SQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

// If you want to start the application without secrets, you can still use this function
// startApp();
