"use client";
import React, { useState } from "react";

interface ToggleButtonProps {
  defaultActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  defaultActive = false,
  onToggle,
}) => {
  const [active, setActive] = useState(defaultActive);

  const handleToggle = () => {
    const newValue = !active;
    setActive(newValue);
    onToggle?.(newValue);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`${
        active ? "bg-primary" : "bg-gray-600"
      } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span
        className={`${
          active ? "translate-x-4" : "translate-x-0"
        } inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};
