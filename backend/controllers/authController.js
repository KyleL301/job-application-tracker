/**
 * Authentication Controller
 *
 * This controller will contain all authentication-related logic.
 * For now, we are creating a placeholder for user registration.
 */

const bcrypt = require("bcryptjs");
const db = require("../config/db");

/**
 * Register a new user
 */
const registerUser = async (req, res) => {
  try {
    // Get the user data from the request body
    const { name, email, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert a new user
    const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
`;

    // Execute the query
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to register user.",
        });
      }

      res.status(201).json({
        message: "User registered successfully!",
        userId: result.insertId,
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
};
