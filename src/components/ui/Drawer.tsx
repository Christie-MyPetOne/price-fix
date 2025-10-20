"use client";
import React, { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
}: DrawerProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Painel lateral */}
      <div
        className={`absolute top-0 ${side === "right" ? "right-0" : "left-0"} h-full w-full max-w-xl
                    bg-card border-l border-border-dark shadow-xl
                    transition-transform duration-300
                    ${
                      open
                        ? "translate-x-0"
                        : side === "right"
                        ? "translate-x-full"
                        : "-translate-x-full"
                    }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-dark">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-background"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          {children}
        </div>
      </div>
    </div>
  );
}