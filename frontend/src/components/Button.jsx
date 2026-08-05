/**
 * Button.jsx
 *
 * Reusable button component used throughout the application.
 * Supports different button styles through props.
 */

import "../styles/button.css";

/**
 * Reusable Button Component
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Content displayed inside the button.
 * @param {Function} props.onClick - Function executed when the button is clicked.
 * @param {string} props.type - HTML button type (button, submit, reset).
 * @param {string} props.variant - Visual style of the button.
 * @param {boolean} props.disabled - Disables the button when true.
 */
function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
