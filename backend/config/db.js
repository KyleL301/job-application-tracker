/**
 * Database Connection
 *
 * This file establishes a connection between our
 * Express backend and the MariaDB database.
 */

const mysql = require("mysql2");

// Create the database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_tracker",
});

// Attempt to connect
connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }

  console.log("✅ Connected to MariaDB!");
});

// Export the connection so it can be used in other files
module.exports = connection;
