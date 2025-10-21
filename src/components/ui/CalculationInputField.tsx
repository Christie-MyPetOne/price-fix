import React from "react";

export const CalculationInputField = ({
  label,
  value,
  onChange,
  unit,
  placeholder,
}: {
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: "%" | "R$";
  placeholder?: string;
}) => (
  <div>
    <label className="block text-xs font-medium text-text-secondary mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-border-dark rounded-md bg-background text-text text-sm pl-10"
      />
      {unit && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-secondary">
          {unit}
        </span>
      )}
    </div>
  </div>
);
