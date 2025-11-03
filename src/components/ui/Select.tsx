export const Select = ({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`h-10 rounded-md border border-border-dark bg-background px-3 py-2 text-sm text-text-secondary focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  >
    {children}
  </select>
);
