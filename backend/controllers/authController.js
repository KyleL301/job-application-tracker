/**
 * Authentication Controller
 *
 * This controller will contain all authentication-related logic.
 * For now, we are creating a placeholder for user registration.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

/**
 * Log in an existing user.
 *
 * Checks the user's email and password, then creates
 * a JWT token if the credentials are correct.
 */
const loginUser = async (req, res) => {
  try {
    // Get the email and password submitted by the user.
    const { email, password } = req.body;

    // Make sure both fields have been provided.
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Confirm that the JWT secret is configured.
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from the environment.");

      return res.status(500).json({
        message: "Server configuration error.",
      });
    }

    // Find the account associated with the supplied email.
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    // Reject the login if no account matches the email.
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Get the matching account.
    const user = users[0];

    // Compare the submitted password with its stored hash.
    const passwordMatches = await bcrypt.compare(password, user.password);

    // Reject an incorrect password.
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create a token that identifies the logged-in user.
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // Send the token and safe account details to the frontend.
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Log the technical error on the server for troubleshooting.
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Failed to log in. Please try again.",
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
};
