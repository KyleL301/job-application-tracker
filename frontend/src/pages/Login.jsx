/**
 * Login.jsx
 *
 * Allows an existing user to log in to the application.
 * Sends credentials to the backend and stores the returned
 * authentication token for subsequent API requests.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

// Get the backend API address from the frontend environment variables.
// The localhost address is used as a fallback during local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
  // Store the email and password entered into the form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Track the form's loading state and any API messages.
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to the dashboard after successful login.
  const navigate = useNavigate();

  /**
   * Submit the login form to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Send the login credentials to the backend API.
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Read the backend response.
      const data = await response.json();

      // Display the backend's error if login fails.
      if (!response.ok) {
        setErrorMessage(data.message || "Login failed. Please try again.");
        return;
      }

      // Make sure the backend returned an authentication token.
      if (!data.token) {
        setErrorMessage("Login failed. No authentication token received.");
        return;
      }

      // Keep the token for authenticated API requests in this browser session.
      sessionStorage.setItem("token", data.token);

      // Store the user's basic account details for the frontend.
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Open the dashboard after successful authentication.
      navigate("/dashboard");
    } catch (error) {
      // Handle network errors, such as the backend being offline.
      console.error("Login error:", error);

      setErrorMessage("Could not connect to the server. Please try again.");
    } finally {
      // Re-enable the form after the request finishes.
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue managing your job applications."
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
