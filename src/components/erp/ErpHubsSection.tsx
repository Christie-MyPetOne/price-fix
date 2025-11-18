// src/components/erp/ErpHubsSection.tsx
import React from 'react';
import { Card } from "@/components/ui/Card";

// TIPOS (Importe do arquivo principal/global de tipos)
type Hub = { id: string; name: string; icon: string; };

type ErpHubsSectionProps = {
  hubsDisponiveis: Hub[];
  integracoesAdicionadas: string[];
  handleAdicionarHub: (hubId: string) => void;
};

// Função auxiliar (mantida no arquivo original)
const classNames = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

export const ErpHubsSection: React.FC<ErpHubsSectionProps> = ({
  hubsDisponiveis, integracoesAdicionadas, handleAdicionarHub
}) => (
  <Card className="p-0 bg-[var(--color-card)]">
    <div className="px-4 py-3 border-b border-[var(--color-border-dark)] flex items-center gap-2">
      <h2 className="text-sm font-semibold text-[var(--color-text)]">Vincular Hubs/Marketplaces</h2>
      <span className="text-xs text-[var(--color-text-secondary)]">(clique em ADICIONAR para vincular)</span>
    </div>

    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {hubsDisponiveis.map((hub) => {
        const added = integracoesAdicionadas.includes(hub.id);
        return (
          <div
            key={hub.id}
            className="flex flex-col items-center justify-between border border-[var(--color-border-dark)] rounded-lg p-4 bg-[var(--color-background)]"
          >
            <img src={hub.icon} alt={hub.name} className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium mb-3">{hub.name}</span>

            <button
              onClick={() => handleAdicionarHub(hub.id)}
              disabled={added}
              className={classNames(
                "w-full text-xs font-semibold px-3 py-2 rounded-md border transition",
                added
                  ? "bg-white text-[var(--color-primary)] cursor-default"
                  : "bg-[var(--color-card)] hover:bg-[var(--color-primary-light)]/5 border-[var(--color-border-dark)]"
              )}
            >
              {added ? "ADICIONADO" : "ADICIONAR"}
            </button>
          </div>
        );
      })}
    </div>

    {/* Integrações adicionadas (em lista) */}
    <div className="px-4 pt-1 pb-4">
      <div className="h-px border-[var(--color-border-dark)] my-2" />
      <h3 className="text-sm font-semibold text-[var(--color-text)]">Integrações adicionadas</h3>

      {integracoesAdicionadas.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Nenhuma integração vinculada ainda.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--color-border-dark)] rounded-md border border-[var(--color-border-dark)] bg-[var(--color-card)]">
          {integracoesAdicionadas.map((id) => {
            const hub = hubsDisponiveis.find((h) => h.id === id)!;
            return (
              <li key={id}>
                <button
                  onClick={() => console.log("clicou em", hub.name)} 
                  className="
                    w-full flex items-center gap-3 px-3 py-2 rounded-md
                    text-left transition
                    hover:bg-[var(--color-primary-light)]/10
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]
                  "
                >
                  <img
                    src={hub.icon}
                    alt={hub.name}
                    className="w-6 h-6 rounded-md bg-[var(--color-background)] p-0.5"
                  />
                  <span className="text-sm text-[var(--color-text)]">{hub.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </Card>
);