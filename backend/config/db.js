/**
 * Database Connection
 *
 * This file establishes a connection between our
 * Express backend and the MariaDB database.
 */

const mysql = require("mysql2");
require("dotenv").config();

// Create the database connection using environment variables.
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Attempt to connect to the database.
connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }

  console.log("✅ Connected to MariaDB!");
});

// Export the connection so it can be used in other files.
module.exports = connection;
