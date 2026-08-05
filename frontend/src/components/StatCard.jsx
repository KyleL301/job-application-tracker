/**
 * StatCard.jsx
 *
 * Reusable statistics card used on the dashboard.
 * Displays a title and a value.
 */

import Card from "./Card";

/**
 * Reusable statistics card.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string|number} props.value
 */
function StatCard({ title, value }) {
  return (
    <Card className="stat-card">
      <h3>{title}</h3>

      <h2>{value}</h2>
    </Card>
  );
}

export default StatCard;
