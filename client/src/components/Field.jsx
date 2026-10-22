// Labelled form control with an inline error. Pass the input as children.
export default function Field({ label, error, hint, children, className = '' }) {
  return (
    <label className={`field ${error ? 'has-error' : ''} ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="error-text">{error}</span> : hint && <span className="hint">{hint}</span>}
    </label>
  );
}
