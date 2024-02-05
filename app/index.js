// index.js
const express = require('express');
const loadDatabaseSecrets = require('./secrets.js'); // Assuming loadDatabaseSecrets is the correct function to call
const mysql = require('mysql2');
const app = express();

app.use(express.json());
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function startServer() {
    const secrets = await loadDatabaseSecrets();
    // Verify that 'secrets' is an object with the 'database' property
    const { user, password, database, socketPath } = secrets.database;

    // Create a MySQL connection pool
    const pool = mysql.createPool({
      user,
      password,
      database,
      socketPath
    });

    app.get("/entries", async(req,res) => {
      const query = "SELECT * FROM entries";
      pool.query(query, [ req.params.entries ], (error,results) => {
        if (!results[0]){
          res.json({status: "Not Found"});
        }else{
          res.json(results[0]);
        }
      });
    });
}

startServer();
