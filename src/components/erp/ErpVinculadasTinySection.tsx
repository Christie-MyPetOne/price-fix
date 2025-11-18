// src/components/erp/ErpVinculadasTinySection.tsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"; // Reutilizando seu componente Button
// Assumindo que você tem um Select Simples que funciona com strings
import { Select } from "@/components/ui/Select"; 

// TIPOS (Importe do arquivo principal/global de tipos)
type Hub = { id: string; name: string; icon: string; };
type VinculadaTiny = { id: string; hubId?: string; code: string; };

type ErpVinculadasTinySectionProps = {
  slug: string;
  vinculadasTiny: VinculadaTiny[];
  addLinhaTiny: () => void;
  removeLinhaTiny: (id: string) => void;
  updateLinhaTiny: (id: string, patch: Partial<Pick<VinculadaTiny, "hubId" | "code">>) => void;
  hubsDisponiveis: Hub[];
  inputBase: (hasError?: boolean) => string; 
};

export const ErpVinculadasTinySection: React.FC<ErpVinculadasTinySectionProps> = ({
  slug, vinculadasTiny, addLinhaTiny, removeLinhaTiny, updateLinhaTiny, hubsDisponiveis, inputBase
}) => (
  <Card className=" p-0 bg-[var(--color-card)]">
    <div className="px-4 py-3 border-b border-[var(--color-border-dark)] flex items-center justify-between">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Integrações vinculadas à {slug.charAt(0).toUpperCase() + slug.slice(1)}</h2>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Selecione a integração e informe o código da loja API {slug.charAt(0).toUpperCase() + slug.slice(1)}.
        </p>
      </div>
    </div>

    <div className="p-4 space-y-3">
      {/* Cabeçalho desktop */}
      <div className="hidden md:grid grid-cols-[7fr_4fr_auto] gap-3 text-xs text-[var(--color-text-secondary)] px-1">
        <div>Integração</div>
        <div>Código da loja API {slug.charAt(0).toUpperCase() + slug.slice(1)}</div>
        <div></div>
      </div>

      {vinculadasTiny.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-1 md:grid-cols-[7fr_4fr_auto] gap-3 items-center border border-[var(--color-border-dark)] rounded-md p-3 md:p-2"
        >
          {/* Integração - USANDO O SEU SELECT SIMPLES */}
          <div>
            <label className="md:hidden block text-xs text-[var(--color-text-secondary)] mb-1">
              Integração
            </label>
                <select
                value={row.hubId || ""}
                onChange={(e) =>
                    updateLinhaTiny(row.id, {
                    hubId: e.target.value || undefined,
                    })
                }
                className="w-full rounded-lg border border-border-dark bg-card px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                <option value="">Selecione uma integração</option>

                {hubsDisponiveis.map((h) => (
                    <option key={h.id} value={h.id}>
                    {h.name}
                    </option>
                ))}
                </select>
          </div>

          {/* Código Tiny */}
          <div>
            <label className="md:hidden block text-xs text-[var(--color-text-secondary)] mb-1">
              Código da loja API {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </label>
            <input
              value={row.code}
              onChange={(e) => updateLinhaTiny(row.id, { code: e.target.value })}
              placeholder="Ex: 203690006"
              className={inputBase(false)}
              inputMode="numeric"
              autoComplete="off"
            />
          </div>

          {/* Remover - USANDO O SEU BUTTON */}
          <div className="flex md:block md:justify-self-end md:self-center">
            <Button
              onClick={() => removeLinhaTiny(row.id)}
              className="w-full md:w-auto shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2 text-xs px-2.5 py-2 rounded-md border border-[var(--color-error)] text-[var(--color-error)] hover:bg-rose-50"
              title="Remover"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Remover</span>
              <span className="sm:hidden">Excluir</span>
            </Button>
          </div>
        </div>
      ))}

      <Button
        onClick={addLinhaTiny}
        className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-[var(--color-border-dark)] bg-[var(--color-card)] hover:bg-[var(--color-primary-light)]/5"
      >
        <Plus className="w-4 h-4" />
        Adicionar outro hub/marketplace
      </Button>

      <div className="pt-4">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">Webhooks de depósitos</h4>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Nenhum depósito foi selecionado ainda.</p>
      </div>
    </div>
  </Card>
);