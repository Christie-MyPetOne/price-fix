"use client";

import React from "react";

interface MarginBadgeProps {
  margin: number;
}

export function MarginBadge({ margin }: MarginBadgeProps) {
  const marginStyle =
    margin >= 20
      ? "bg-green-100 text-green-700"
      : margin >= 10
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${marginStyle}`}
    >
      {margin.toFixed(2)}%
    </span>
  );
}
