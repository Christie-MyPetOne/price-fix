"use client";

import React from "react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer bg-white ${className}`}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
