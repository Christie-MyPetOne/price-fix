"use client";

import React from "react";

interface CalculationInputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  placeholder?: string;
}

export const CalculationInputField: React.FC<CalculationInputFieldProps> = ({
  label,
  value,
  onChange,
  unit,
  placeholder,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-text-secondary">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-card border border-border-dark rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};