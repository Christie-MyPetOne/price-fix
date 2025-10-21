import React from "react";

export const TabButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
      isActive
        ? "bg-background text-primary border-b-2 border-primary"
        : "text-text-secondary hover:bg-background"
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);
