"use client";

import { CONFIG_SECTIONS, ConfigSectionId } from "@/lib/config-section";

type Props = {
  active: ConfigSectionId;
  onChange: (id: ConfigSectionId) => void;
  className?: string;
};

export default function SidebarConfig({ active, onChange, className }: Props) {
  return (
    <aside
      className={`w-72 max-h-full shrink-0 border-r border-border-dark bg-card ${className ?? ""}`}
      aria-label="Menu de configuração"
    >
      <div className="px-5 py-4">
        <h2 className="text-sm uppercase tracking-wide text-text-secondary">
          Configuração
        </h2>
      </div>

      <nav className="px-2 pb-4 space-y-1">
        {CONFIG_SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors
                ${isActive
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-card-light hover:text-text"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}