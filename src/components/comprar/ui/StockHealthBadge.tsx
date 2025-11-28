"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Snowflake,
  XCircle,
} from "lucide-react";
import React from "react";

const healthConfig: Record<
  string,
  { color: string; icon: React.ElementType; label: string }
> = {
  Excelente: {
    color: "text-green-500",
    icon: CheckCircle2,
    label: "Excelente",
  },
  Moderado: {
    color: "text-yellow-500",
    icon: AlertTriangle,
    label: "Moderado",
  },
  Risco: { color: "text-red-500", icon: XCircle, label: "Risco" },
  Parado: { color: "text-blue-400", icon: Snowflake, label: "Parado" },
};

export const StockHealthBadge = ({ status }: { status?: string }) => {
  const config = healthConfig[status ?? "Moderado"];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background-light text-xs ${config.color}`}
    >
      <Icon size={11} /> {config.label}
    </span>
  );
};