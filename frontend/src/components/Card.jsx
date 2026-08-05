/**
 * Card.jsx
 *
 * Reusable container component used throughout the application.
 * Provides consistent spacing, border radius and shadow.
 */

import "../styles/card.css";

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export default Card;
