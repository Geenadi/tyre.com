export default function Stars({ rating, reviews }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      <span className="stars-track">
        ★★★★★
        <span className="stars-fill" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <span className="stars-text">
        {rating.toFixed(1)}
        {reviews != null && <span className="muted"> ({reviews})</span>}
      </span>
    </span>
  );
}
