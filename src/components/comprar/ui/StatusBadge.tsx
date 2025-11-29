"use client";

import {
  CheckCircle2,
  PackageCheck,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import React from "react";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> =
  {
    Acabou: { color: "#ef4444", icon: XCircle },
    Comprar: { color: "#f59e0b", icon: ShoppingCart },
    Bom: { color: "#22c55e", icon: CheckCircle2 },
    Pedido: { color: "#3b82f6", icon: PackageCheck },
  };

export const StatusBadge = ({ status }: { status?: string }) => {
  const config = statusConfig[status ?? ""];
  if (!config) return <span className="text-xs text-text-secondary">-</span>;

  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded font-medium text-[10px] text-white"
      style={{ backgroundColor: config.color }}
    >
      <Icon size={11} />
      {status}
    </span>
  );
};