interface Props {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Asterism mark — three dots in a triangle. Used in header + footer.
 * Uses currentColor so it inherits the surrounding text color and
 * adapts to light/dark themes automatically.
 */
export function Mark({ size = 22, className = "", label = "Confabulatorium" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={label}
      className={className}
      fill="currentColor"
    >
      <circle cx="16" cy="11" r="1.7" />
      <circle cx="10.5" cy="20" r="1.7" />
      <circle cx="21.5" cy="20" r="1.7" />
    </svg>
  );
}
