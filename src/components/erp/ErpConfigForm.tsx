// src/components/erp/ErpConfigForm.tsx
import React from 'react';
import { Info, RefreshCcw, ShieldCheck, Copy, Check } from 'lucide-react';
// Reutilizando componentes de UI
import { Field } from "@/components/ui/Field";
import { MultiSelect } from "@/components/ui/MultiSelect";
// Assumindo que você tem um ToggleButton (ou renomeie o seu Toggle)
import { ToggleButton } from "@/components/ui/ToggleButton"; 

// TIPOS e Mocks (Importe do arquivo principal/global de tipos)
type Option = { label: string; value: string }; // Definição simples para evitar erro
// Assumindo que estes mocks são importáveis
const depositosMock: Option[] = [ /* ... */ ]; 
const situacoesMock: Option[] = [ /* ... */ ]; 

type ErpConfigFormProps = {
  token: string; setToken: (v: string) => void;
  webhookUrl: string; setWebhookUrl: (v: string) => void;
  depositos: Option[]; setDepositos: (v: Option[]) => void;
  situacoes: Option[]; setSituacoes: (v: Option[]) => void;
  importarAuto: boolean; setImportarAuto: (v: boolean) => void;
  usarCustoMedio: boolean; setUsarCustoMedio: (v: boolean) => void;
  descontarReservado: boolean; setDescontarReservado: (v: boolean) => void;
  errors: { token?: string; webhookUrl?: string };
  copied: boolean; copyWebhook: () => void;
  testing: boolean; testConnection: () => void;
  slug: string;
  inputBase: (hasError?: boolean) => string; 
};

export const ErpConfigForm: React.FC<ErpConfigFormProps> = ({ 
  token, setToken, webhookUrl, setWebhookUrl, depositos, setDepositos,
  situacoes, setSituacoes, importarAuto, setImportarAuto, usarCustoMedio,
  setUsarCustoMedio, descontarReservado, setDescontarReservado, errors,
  copied, copyWebhook, testing, testConnection, slug, inputBase
}) => (
  <div className="p-4 sm:p-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Coluna esquerda */}
      <div className="space-y-8">
        {/* TOKEN API */}
        <Field
          error={errors.token}
          label={
            <div className="flex items-center gap-3">
              <span>Token API</span>
              <button
                onClick={testConnection}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-[var(--color-border-dark)] bg-[var(--color-card)] hover:bg-[var(--color-primary-light)]/5"
              >
                {testing ? (
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                Testar conexão
              </button>
            </div>
          }
        >
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={`Cole seu token da ${slug}`}
            className={inputBase(!!errors.token)}
          />
        </Field>

        {/* WEBHOOK */}
        <Field
          help="Clique no ícone para copiar o link."
          error={errors.webhookUrl}
          label={
            <span className="inline-flex items-center gap-2">
              URL do webhook <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </span>
          }
        >
          <div className="relative">
            <input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className={inputBase(!!errors.webhookUrl) + " pr-10"}
            />
            <button
              type="button"
              onClick={copyWebhook}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-dark)] hover:bg-[var(--color-primary-light)]/5"
              aria-label="Copiar webhook"
              title="Copiar"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        {/* Importar automaticamente: USANDO ToggleButton */}
        <div className="p-0">
          <label className="block text-sm font-medium text-[var(--color-text)]">Importar automaticamente</label>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">Quando ativado, pedidos serão importados conforme as situações permitidas.</p>
          <div className="mt-2">
            <ToggleButton value={importarAuto} onChange={setImportarAuto} /> 
          </div>
        </div>

        {/* Descontar reservado: USANDO ToggleButton */}
        <div className="p-0">
          <label className="block text-sm font-medium text-[var(--color-text)]">Descontar estoque reservado nas vendas?</label>
          <div className="mt-2">
            <ToggleButton value={descontarReservado} onChange={setDescontarReservado} />
          </div>
        </div>
      </div>

      {/* Coluna direita */}
      <div className="-mt-4 space-y-8">
        <MultiSelect
          label="Depósitos permitidos"
          placeholder="Selecionar depósitos"
          options={depositosMock}
          value={depositos}
          onChange={setDepositos}
          emptyHint="Nenhum depósito selecionado."
          showSideToggle
        />
        <MultiSelect
          label={
            <span className="inline-flex items-center gap-2">
              Situações de vendas permitidas{" "}
              <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </span>
          }
          placeholder="Adicionar situações"
          options={situacoesMock}
          value={situacoes}
          onChange={setSituacoes}
          showSideToggle
        />
        
        {/* Usar custo médio: USANDO ToggleButton */}
        <div className="p-0">
          <label className="block text-sm font-medium text-[var(--color-text)]">Usar custo médio dos produtos nas sincronizações?</label>
          <div className="mt-2">
            <ToggleButton value={usarCustoMedio} onChange={setUsarCustoMedio} />
          </div>
        </div>
      </div>
    </div>
  </div>
);