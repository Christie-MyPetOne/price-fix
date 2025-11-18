"use client";

import React from "react";

// A nova interface aceita 'value' e 'onChange'
interface ToggleButtonProps {
  value: boolean; // Estado atual do toggle (controlado pelo componente pai)
  onChange: (active: boolean) => void; // Função para alterar o estado no componente pai
  disabled?: boolean;
}

/**
 * Componente ToggleButton (CONTROLADO).
 * O estado é gerenciado externamente via 'value' e 'onChange'.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      // Notifica o componente pai sobre a nova mudança de valor
      onChange(!value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${
        // Usa 'value' (que é o estado do componente pai) para determinar o estilo
        value ? "bg-primary" : "bg-gray-600"
      } relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <span
        className={`${
          // Usa 'value' para determinar a posição
          value ? "translate-x-5" : "translate-x-0"
        } inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};