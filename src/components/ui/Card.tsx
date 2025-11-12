"use client";

import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-border-dark p-6 shadow-sm ${
      className || ""
    }`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";

export { Card };
