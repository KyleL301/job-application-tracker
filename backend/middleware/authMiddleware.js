/**
 * Authentication Middleware
 *
 * Verifies the JWT token supplied by a logged-in user.
 * Protected routes can use this to identify the user.
 */

const jwt = require("jsonwebtoken");

/**
 * Verify the user's authentication token.
 */
const authMiddleware = (req, res, next) => {
  // Read the Authorization header from the request.
  const authHeader = req.headers.authorization;

  // Require the token to use the Bearer format.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required. Please log in.",
    });
  }

  // Extract the token after the word "Bearer".
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the private JWT secret.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make the verified user's identity available to the controller.
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    // Continue to the requested route.
    next();
  } catch (error) {
    // Reject missing, invalid, or expired tokens.
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = authMiddleware;
