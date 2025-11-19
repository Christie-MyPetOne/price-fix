// src/app/configuracao/sections/erp.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Save } from "lucide-react";
// Reutiliza seus componentes de UI
import { Card } from "@/components/ui/Card"; // Card é um contêiner com estilo (borda, sombra, etc.)
import { Button } from "@/components/ui/Button";

// Importa os componentes de Seção
import { ErpConfigForm } from "@/components/erp/ErpConfigForm";
import { ErpStatusSection } from "@/components/erp/ErpStatusSection";
import { ErpHubsSection } from "@/components/erp/ErpHubsSection";
import { ErpVinculadasTinySection } from "@/components/erp/ErpVinculadasTinySection";

// Importa funções auxiliares do MultiSelect
import { cryptoRandomId } from "@/components/ui/MultiSelect";

/* === PROPS E TIPOS === */
export type Option = { label: string; value: string };
export type Hub = { id: string; name: string; icon: string };
export type VinculadaTiny = { id: string; hubId?: string; code: string };

export type ErpConfigProps = {
  slug: string;
  onClose: () => void;
};

// Mocks (MANTIDOS aqui)
export const depositosMock: Option[] = [
  { label: "Matriz - Principal", value: "matriz" },
  { label: "CD São Paulo", value: "cd_sp" },
  { label: "CD Extrema", value: "cd_extrema" },
];

export const situacoesMock: Option[] = [
  { label: "Aprovado", value: "aprovado" },
  { label: "Preparando envio", value: "preparando_envio" },
  { label: "Faturado", value: "faturado" },
  { label: "Pronto para envio", value: "pronto_envio" },
  { label: "Enviado", value: "enviado" },
  { label: "Entregue", value: "entregue" },
];

export const hubsDisponiveis: Hub[] = [
  { id: "mercado_livre", name: "Mercado Livre", icon: "/icons/mercadolivre.svg" },
  { id: "tray", name: "Tray", icon: "/icons/tray.svg" },
  { id: "skyhub", name: "SkyHub", icon: "/icons/skyhub.svg" },
  { id: "shopee", name: "Shopee", icon: "/icons/shopee.svg" },
  { id: "magalu", name: "Magalu", icon: "/icons/magalu.svg" },
];

// Estilo helper (MANTIDO aqui)
const classNames = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");
const inputBase = (hasError?: boolean) =>
  classNames(
    "w-full rounded-md px-3 py-2 text-sm outline-none transition-colors",
    "bg-[var(--color-card)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)]",
    "border border-solid ring-0 focus:ring-2",
    hasError
      ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
      : "border-[var(--color-border-dark)] focus:ring-[var(--color-primary-light)]"
  );

// Estilos do layout antigo para consistência
const sectionTitle = "text-base font-semibold text-text";
const cardCls = "rounded-xl border border-border-dark bg-card shadow-sm"; // Corresponde ao Card principal do ConfigBasica

export default function ErpConfig({ slug, onClose }: ErpConfigProps) {
  // -------- Form states --------
  const [token, setToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(
    "https://sys.precocerto.co/api/tiny/webhook/d0791015-38b0-4f0d-8653-65c3cabe"
  );
  const [depositos, setDepositos] = useState<Option[]>([]);
  const [situacoes, setSituacoes] = useState<Option[]>([]); // Mudado para começar vazio para consistência
  const [importarAuto, setImportarAuto] = useState(true);
  const [usarCustoMedio, setUsarCustoMedio] = useState(false);
  const [descontarReservado, setDescontarReservado] = useState(false);

  // -------- UI states --------
  const [copied, setCopied] = useState(false);
  const [loadingSync, setLoadingSync] = useState<"all" | "prod" | "vendas" | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState<"idle" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<{ token?: string; webhookUrl?: string }>({});

  // -------- Hubs/integrações --------
  const [integracoesAdicionadas, setIntegracoesAdicionadas] = useState<string[]>([]); // Mudado para começar vazio
  const [vinculadasTiny, setVinculadasTiny] = useState<VinculadaTiny[]>([
    { id: cryptoRandomId(), hubId: undefined, code: "" },
  ]); // Mudado para começar com uma linha vazia

  // Lógica (MANTIDA)
  const lastUpdated = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    []
  );

  const canSync = token.trim().length > 0;

  const simulateSync = async (type: "all" | "prod" | "vendas") => {
    setLoadingSync(type);
    await new Promise((r) => setTimeout(r, 900));
    setLoadingSync(null);
  };

  const testConnection = async () => {
    setTesting(true);
    await new Promise((r) => setTimeout(r, 900));
    setTesting(false);
  };

  const handleSave = async () => {
    const next: typeof errors = {};
    if (!token.trim()) next.token = "Informe o Token da API.";
    if (!/^https?:\/\//i.test(webhookUrl)) next.webhookUrl = "URL inválida.";

    setErrors(next);
    if (Object.keys(next).length > 0) return setSaved("error");

    setSaved("idle");
    await new Promise((r) => setTimeout(r, 500));
    setSaved("ok");
    setTimeout(() => setSaved("idle"), 1500);
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  const handleAdicionarHub = (hubId: string) => {
    setIntegracoesAdicionadas((curr) => (curr.includes(hubId) ? curr : [...curr, hubId]));
  };

  const addLinhaTiny = () => {
    setVinculadasTiny((curr) => [...curr, { id: cryptoRandomId(), hubId: undefined, code: "" }]);
  };

  const removeLinhaTiny = (id: string) => {
    setVinculadasTiny((curr) => curr.filter((l) => l.id !== id));
  };

  const updateLinhaTiny = (id: string, patch: Partial<Pick<VinculadaTiny, "hubId" | "code">>) => {
    setVinculadasTiny((curr) => curr.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  return (
    // Contêiner principal para manter a mesma margem superior e centralização
    <div className="-mt-1 min-h-[calc(100vh-64px)]">
      {/* Container de largura máxima, igual ao ConfigBasica */}
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho da página (Igual ao ConfigBasica) */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="ml-4 text-2xl font-semibold text-text">
              Integração: {slug.toUpperCase()}
            </h1>
            <p className="ml-4 text-sm text-text-secondary max-w-3xl">
              Conecte sua conta do ERP selecionado para importação automática de vendas, indicadores
              em tempo real e atualização de preços.
            </p>
          </div>
          
          {/* Botões de Ação, mantendo o estilo de título principal */}
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <Button 
              onClick={handleSave} 
              className="ml-4 inline-flex items-center gap-2 text-sm px-4 py-2" // Ajustado para px-4 py-2 para visualmente manter a altura padrão de botões maiores.
            >
              <Save className="w-4 h-4" /> Salvar
            </Button>
            <Button 
              onClick={onClose} 
              variant="secondary" // Usando um botão secundário para contraste
              className="inline-flex items-center gap-2 text-sm px-4 py-2"
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Card principal que engloba todas as seções (igual ao ConfigBasica) */}
        <div className={cardCls}>
          <div className="p-6 grid gap-8">
            
            {/* Aviso de erro (mantido, mas estilizado para se integrar ao card/layout) */}
            {!canSync && (
              // Usando um div com margem negativa para parecer inserido entre o header e o conteúdo
              <div className=" flex items-start rounded-lg border border-solid border-[var(--color-border-dark)] bg-red-500/10 text-error p-3">
                <p className="text-sm">
                  Para habilitar as sincronizações, preencha o <b>Token API</b> e verifique a{" "}
                  <b>URL do webhook</b>.
                </p>
              </div>
            )}

            {/* ===== 1. Configuração (Reutilizando a estrutura de seção) ===== */}
            <section className="grid gap-3">
              <h2 className={sectionTitle}>Configuração</h2>
              <p className="text-sm text-text-secondary mt-1">
                  Ajuste as credenciais e parâmetros de importação.
              </p>
              
              {/* O componente ErpConfigForm deve gerenciar seus inputs internamente para manter a largura/altura */}
              <ErpConfigForm 
                token={token} setToken={setToken} 
                webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} 
                depositos={depositos} setDepositos={setDepositos} 
                situacoes={situacoes} setSituacoes={setSituacoes} 
                importarAuto={importarAuto} setImportarAuto={setImportarAuto}
                usarCustoMedio={usarCustoMedio} setUsarCustoMedio={setUsarCustoMedio}
                descontarReservado={descontarReservado} setDescontarReservado={setDescontarReservado}
                errors={errors} 
                copied={copied} copyWebhook={copyWebhook}
                testing={testing} testConnection={testConnection}
                slug={slug} inputBase={inputBase}
              />
            </section>
            
            <div className="h-px bg-border-dark/60" /> {/* Divisor */}

            {/* ===== 2. Status (Convertido para estrutura de seção) ===== */}
            <section className="-mt-10 grid gap-3">
              <h2 className={sectionTitle}>Status da Sincronização</h2>
              <ErpStatusSection 
                lastUpdated={lastUpdated} 
                loadingSync={loadingSync} 
                simulateSync={simulateSync} 
                canSync={canSync}
              />
            </section>
            
            <div className="h-px bg-border-dark/60" /> {/* Divisor */}

            {/* ===== 3. Vincular Hubs/Marketplaces (Convertido para estrutura de seção) ===== */}
            <section className="-mt-10 grid gap-3">
              <h2 className={sectionTitle}>Hubs e Marketplaces</h2>
              <p className="text-sm text-text-secondary">
                  Adicione e configure as integrações com marketplaces.
              </p>
              <ErpHubsSection
                hubsDisponiveis={hubsDisponiveis}
                integracoesAdicionadas={integracoesAdicionadas}
                handleAdicionarHub={handleAdicionarHub}
              />
            </section>

            <div className="h-px bg-border-dark/60" /> {/* Divisor */}

            {/* ===== 4. Integrações Vinculadas à Tiny (Convertido para estrutura de seção) ===== */}
            <section className="-mt-10 grid gap-3">
              <h2 className={sectionTitle}>Vínculos de Códigos Tiny</h2>
              <p className="text-sm text-text-secondary">
                  Mapeie códigos internos para hubs específicos, se necessário.
              </p>
              <ErpVinculadasTinySection
                slug={slug}
                vinculadasTiny={vinculadasTiny}
                addLinhaTiny={addLinhaTiny}
                removeLinhaTiny={removeLinhaTiny}
                updateLinhaTiny={updateLinhaTiny}
                hubsDisponiveis={hubsDisponiveis}
                inputBase={inputBase}
              />
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}