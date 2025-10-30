export const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-border-dark bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    {...props}
  />
);
