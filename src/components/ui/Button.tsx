import React from "react";
import { ButtonProps } from "@/lib/types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-primary-dark border-transparent focus:ring-primary",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent focus:ring-gray-400",
      outline:
        "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary",
    };
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
