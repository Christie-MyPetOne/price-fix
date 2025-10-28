"use client";

import React, { useState } from "react";

interface ToggleButtonProps {
  initialActive?: boolean; // Prop para o estado inicial
  onToggle?: (active: boolean) => void;
} // <-- 1. A INTERFACE TERMINA AQUI

/**
 * Componente ToggleButton que gerencia seu próprio estado (não-controlado).
 * Ele usa 'initialActive' para seu estado inicial.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  initialActive = false, // 2. Usa initialActive, e o padrão é 'false'
  onToggle,
}) => {
  const [isActive, setIsActive] = useState(initialActive); // 3. Usa initialActive no estado

  const handleClick = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    onToggle?.(newValue);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${
        // 4. CORRIGIDO: Usa 'bg-primary' para ativo e 'bg-gray-600' para inativo
        isActive ? "bg-primary" : "bg-gray-600"
      } relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span
        className={`${
          isActive ? "translate-x-5" : "translate-x-0"
        } inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};
