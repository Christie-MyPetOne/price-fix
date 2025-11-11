"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshCcw,
  Info,
  ChevronDown,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/* === PROPS: agora o componente aceita slug e onClose === */
export type ErpConfigProps = {
  slug: string;
  onClose: () => void;
};

/* === Renomeado para ErpConfig e tipado com props === */
export default function ErpConfig({ slug, onClose }: ErpConfigProps) {
  type Option = { label: string; value: string };

  type Hub = {
    id: string;
    name: string;
    icon: string;
  };

  type VinculadaTiny = {
    id: string;          // id interno da linha
    hubId?: string;      // qual hub/marketplace
    code: string;        // código da loja API Tiny
  };

  // Mocks
  const depositosMock: Option[] = [
    { label: "Matriz - Principal", value: "matriz" },
    { label: "CD São Paulo", value: "cd_sp" },
    { label: "CD Extrema", value: "cd_extrema" },
  ];

  const situacoesMock: Option[] = [
    { label: "Aprovado", value: "aprovado" },
    { label: "Preparando envio", value: "preparando_envio" },
    { label: "Faturado", value: "faturado" },
    { label: "Pronto para envio", value: "pronto_envio" },
    { label: "Enviado", value: "enviado" },
    { label: "Entregue", value: "entregue" },
  ];

  const hubsDisponiveis: Hub[] = [
    { id: "mercado_livre", name: "Mercado Livre", icon: "/icons/mercadolivre.svg" },
    { id: "tray", name: "Tray", icon: "/icons/tray.svg" },
    { id: "skyhub", name: "SkyHub", icon: "/icons/skyhub.svg" },
    { id: "shopee", name: "Shopee", icon: "/icons/shopee.svg" },
    { id: "magalu", name: "Magalu", icon: "/icons/magalu.svg" },
  ];

  const classNames = (...c: Array<string | false | null | undefined>) =>
    c.filter(Boolean).join(" ");

  // -------- Form states --------
  const [token, setToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(
    "https://sys.precocerto.co/api/tiny/webhook/d0791015-38b0-4f0d-8653-65c3cabe"
  );
  const [depositos, setDepositos] = useState<Option[]>([]);
  const [situacoes, setSituacoes] = useState<Option[]>([...situacoesMock]);
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
  const [integracoesAdicionadas, setIntegracoesAdicionadas] = useState<string[]>([
    "mercado_livre",
    "shopee",
    "magalu",
  ]);

  // Lista vinculada à Tiny (tabela/linhas)
  const [vinculadasTiny, setVinculadasTiny] = useState<VinculadaTiny[]>([
    { id: cryptoRandomId(), hubId: "mercado_livre", code: "7706" },
    { id: cryptoRandomId(), hubId: "mercado_livre", code: "8544" },
    { id: cryptoRandomId(), hubId: "shopee", code: "9566" },
    { id: cryptoRandomId(), hubId: undefined, code: "" }, // linha vazia (select + placeholder)
  ]);

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

  // ----- Handlers: Hubs/Marketplaces -----
  const handleAdicionarHub = (hubId: string) => {
    setIntegracoesAdicionadas((curr) =>
      curr.includes(hubId) ? curr : [...curr, hubId]
    );
  };

  // ----- Handlers: Vinculadas à Tiny -----
  const addLinhaTiny = () => {
    setVinculadasTiny((curr) => [
      ...curr,
      { id: cryptoRandomId(), hubId: undefined, code: "" },
    ]);
  };

  const removeLinhaTiny = (id: string) => {
    setVinculadasTiny((curr) => curr.filter((l) => l.id !== id));
  };

  const updateLinhaTiny = (
    id: string,
    patch: Partial<Pick<VinculadaTiny, "hubId" | "code">>
  ) => {
    setVinculadasTiny((curr) =>
      curr.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  };

  return (
    <div className="max-w-7xl -mt-8 mx-auto w-full flex flex-col gap-6 h-full px-3 sm:px-4 md:px-6 pb-10">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r border border-border/60 mt-4 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          {/* usa o slug só para contextualizar */}
          <h1 className="text-2xl font-bold text-text">Integração: {slug.toUpperCase()}</h1>
          <p className="text-sm text-text-secondary max-w-3xl">
            Conecte sua conta do ERP selecionado para importação automática de vendas, indicadores em tempo real e atualização de preços.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <Button onClick={handleSave} className="inline-flex items-center gap-2 text-sm px-3 py-2">
            <Save className="w-4 h-4" /> Salvar
          </Button>
          {/* Botão voltar chamando onClose */}
          <Button onClick={onClose} className="inline-flex items-center gap-2 text-sm px-3 py-2">
            Voltar
          </Button>
        </div>
      </div>

      {!canSync && (
        <div className="-mt-5 rounded-lg border bg-amber-50 text-amber-700 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <p className="text-sm">
            Para habilitar as sincronizações, preencha o <b>Token API</b> e verifique a{" "}
            <b>URL do webhook</b>.
          </p>
        </div>
      )}

      {/* ===== Card Único (todo o formulário dentro) ===== */}
      <Card className=" -mt-5 p-0">
        <div className="-mt-4 p-4 sm:p-5 border-b border-border/60">
          <h2 className="text-base font-semibold text-text">Configuração</h2>
          <p className="text-xs text-text-secondary mt-1">
            Ajuste as credenciais e parâmetros de importação.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna esquerda */}
            <div className="space-y-8">
              {/* TOKEN API */}
              <Field
                label={
                  <div className="flex items-center gap-3">
                    <span>Token API</span>
                    <button
                      onClick={testConnection}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-border/60 hover:bg-muted"
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
                error={errors.token}
              >
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="cole seu token da Tiny"
                  className={classNames(
                    "w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2",
                    errors.token
                      ? "border-rose-400 focus:ring-rose-300"
                      : "border-border/50 focus:ring-indigo-300"
                  )}
                />
              </Field>

              {/* WEBHOOK */}
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    URL do webhook <Info className="w-4 h-4 text-text-secondary" />
                  </span>
                }
                help="Clique no ícone para copiar o link."
                error={errors.webhookUrl}
              >
                <div className="relative">
                  <input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className={classNames(
                      "w-full rounded-md border bg-background pl-3 pr-10 py-2 outline-none focus:ring-2",
                      errors.webhookUrl
                        ? "border-rose-400 focus:ring-rose-300"
                        : "border-border/50 focus:ring-indigo-300"
                    )}
                  />
                  <button
                    type="button"
                    onClick={copyWebhook}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-md border border-border/50 hover:bg-muted"
                    aria-label="Copiar webhook"
                    title="Copiar"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {/* Importar automaticamente */}
              <div className="p-0">
                <label className="block text-sm font-medium text-text">Importar automaticamente</label>
                <p className="text-xs text-text-secondary mt-2">
                  Quando ativado, pedidos serão importados conforme as situações permitidas.
                </p>
                <div className="mt-2">
                  <Toggle value={importarAuto} onChange={setImportarAuto} />
                </div>
              </div>

              {/* Descontar reservado */}
              <div className="p-0">
                <label className="block text-sm font-medium text-text">
                  Descontar estoque reservado nas vendas?
                </label>
                <div className="mt-2">
                  <Toggle value={descontarReservado} onChange={setDescontarReservado} />
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
                    Situações de vendas permitidas <Info className="w-4 h-4 text-text-secondary" />
                  </span>
                }
                placeholder="Adicionar situações"
                options={situacoesMock}
                value={situacoes}
                onChange={setSituacoes}
                showSideToggle
              />

              <div className="p-0">
                <label className="block text-sm font-medium text-text">
                  Usar custo médio dos produtos nas sincronizações?
                </label>
                <div className="mt-2">
                  <Toggle value={usarCustoMedio} onChange={setUsarCustoMedio} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* ===== Fim do Card Único ===== */}

      {/* Status */}
      <Card className="-mt-3 p-0 border-emerald-200/50">
        <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-text">Status da última importação</span>
        </div>

        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4" /> Seus pedidos foram atualizados{" "}
            <span className="font-medium">({lastUpdated})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-text-secondary">Importação Manual:</span>

            <ActionBtn
              label="SINCRONIZAR PRODUTOS E VENDAS"
              loading={loadingSync === "all"}
              onClick={() => simulateSync("all")}
              disabled={!canSync}
            />

            <ActionBtn
              label="SINCRONIZAR PRODUTOS"
              loading={loadingSync === "prod"}
              onClick={() => simulateSync("prod")}
              disabled={!canSync}
            />

            <ActionBtn
              label="SINCRONIZAR VENDAS"
              loading={loadingSync === "vendas"}
              onClick={() => simulateSync("vendas")}
              disabled={!canSync}
            />
          </div>
        </div>
      </Card>

      {/* ===== Card combinado: Vincular + Lista de adicionadas ===== */}
      <Card className="-mt-3 p-0">
        {/* Vincular Hubs/Marketplaces */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text">Vincular Hubs/Marketplaces</h2>
          <span className="text-xs text-text-secondary">(clique em ADICIONAR para vincular)</span>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {hubsDisponiveis.map((hub) => {
            const added = integracoesAdicionadas.includes(hub.id);
            return (
              <div
                key={hub.id}
                className="flex flex-col items-center justify-between border rounded-lg p-4 bg-background"
              >
                <img src={hub.icon} alt={hub.name} className="w-12 h-12 mb-3" />
                <span className="text-sm font-medium mb-3">{hub.name}</span>

                <button
                  onClick={() => handleAdicionarHub(hub.id)}
                  disabled={added}
                  className={classNames(
                    "w-full text-xs font-semibold px-3 py-2 rounded-md border transition",
                    added
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                      : "bg-muted hover:bg-muted/80 border-border"
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
          <div className="h-px bg-border/60 my-2" />
          <h3 className="text-sm font-semibold text-text mb-3">Integrações adicionadas</h3>

          {integracoesAdicionadas.length === 0 ? (
            <p className="text-sm text-text-secondary">Nenhuma integração vinculada ainda.</p>
          ) : (
            <ul className="divide-y divide-border/60 rounded-md border border-border/60 bg-card">
              {integracoesAdicionadas.map((id) => {
                const hub = hubsDisponiveis.find((h) => h.id === id)!;
                return (
                  <li key={id} className="flex items-center gap-3 px-3 py-2">
                    <img src={hub.icon} alt={hub.name} className="w-6 h-6" />
                    <span className="text-sm">{hub.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>

      {/* ===== Integrações Vinculadas à Tiny (lista editável) ===== */}
      <Card className="-mt-3 p-0">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text">Integrações vinculadas à Tiny</h2>
            <p className="text-xs text-text-secondary">Selecione a integração e informe o código da loja API Tiny.</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Cabeçalho da "tabela" simples */}
          <div className="hidden md:grid grid-cols-12 gap-3 text-xs text-text-secondary px-1">
            <div className="col-span-7">Integração</div>
            <div className="col-span-4">Código da loja API Tiny</div>
            <div className="col-span-1"> </div>
          </div>

          {vinculadasTiny.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border rounded-md p-3 md:p-2"
            >
              {/* Select Integração */}
              <div className="md:col-span-7">
                <select
                  value={row.hubId ?? ""}
                  onChange={(e) => updateLinhaTiny(row.id, { hubId: e.target.value || undefined })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">{row.hubId ? "Alterar integração" : "Selecione uma integração"}</option>
                  {hubsDisponiveis.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Código Tiny */}
              <div className="md:col-span-4">
                <input
                  value={row.code}
                  onChange={(e) => updateLinhaTiny(row.id, { code: e.target.value })}
                  placeholder="Ex: 203690006"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              {/* Remover */}
              <div className="md:col-span-1 flex md:justify-end">
                <button
                  onClick={() => removeLinhaTiny(row.id)}
                  className="inline-flex items-center gap-2 text-xs px-2.5 py-2 rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remover</span>
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addLinhaTiny}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border/60 hover:bg-muted"
          >
            <Plus className="w-4 h-4" />
            Adicionar outro hub/marketplace
          </button>

          <div className="pt-4">
            <h4 className="text-sm font-semibold text-text">Webhooks de depósitos</h4>
            <p className="text-sm text-text-secondary mt-1">
              Nenhum depósito foi selecionado ainda.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Componentes auxiliares ---------- */

const Field = ({ label, children, help, error }: any) => (
  <div className="p-0">
    <div className="flex items-start gap-2 justify-between">
      <label className="block text-sm font-medium text-text">{label}</label>
    </div>
    <div className="mt-2">{children}</div>
    {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    {help && <p className="text-xs text-text-secondary mt-2">{help}</p>}
  </div>
);

const Tag = ({ children, onClear }: { children: React.ReactNode; onClear: () => void }) => (
  <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-700 border border-indigo-200">
    {children}
    <button onClick={onClear} className="w-4 h-4 rounded hover:bg-black/10 flex items-center justify-center">
      ×
    </button>
  </span>
);

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!value)}
    className={
      "relative inline-flex items-center rounded-full transition px-1 py-1 text-xs font-semibold border w-20 " +
      (value ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200")
    }
  >
    <span
      className={
        "inline-block w-6 h-6 rounded-full bg-white shadow transform transition " +
        (value ? "translate-x-8" : "translate-x-0")
      }
    />
    <span className={"absolute text-center " + (value ? "left-2" : "right-2")}>
      {value ? "SIM" : "NÃO"}
    </span>
  </button>
);

const ActionBtn = ({ label, onClick, loading, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={
      "inline-flex items-center gap-2 px-3 py-2 rounded-md border text-xs sm:text-sm font-medium " +
      (disabled
        ? "opacity-60 cursor-not-allowed border-border/50"
        : "bg-indigo-500/10 text-indigo-700 border-indigo-200 hover:bg-indigo-500/15")
    }
  >
    {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
    {label}
  </button>
);

/* ---------- MultiSelect (com fundo visível) ---------- */
function MultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  emptyHint,
  showSideToggle = false,
}: any) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const toggle = (opt: { label: string; value: string }) => {
    const exists = value.some((o: { value: string }) => o.value === opt.value);
    onChange(exists ? value.filter((o: { value: string }) => o.value !== opt.value) : [...value, opt]);
  };

  const remove = (optValue: string) => onChange(value.filter((o: { value: string }) => o.value !== optValue));

  return (
    <div className="p-0">
      <label className="block text-sm font-medium text-text">{label}</label>

      <div className="flex flex-wrap gap-2 mt-2">
        {value.length === 0 && (
          <span className="text-xs text-text-secondary">
            {emptyHint ?? "Nenhum item selecionado."}
          </span>
        )}
        {value.map((v: { label: string; value: string }) => (
          <Tag key={v.value} onClear={() => remove(v.value)}>
            {v.label}
          </Tag>
        ))}
      </div>

      <div className="relative mt-3" ref={ref}>
        {/* botão do select */}
        <button
          onClick={() => setOpen((s) => !s)}
          className="w-full text-left rounded-md border border-border-dark bg-card px-3 py-2 text-sm hover:bg-muted transition inline-flex items-center justify-between shadow-sm"
        >
          {placeholder}
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        {/* chevron/botão lateral */}
        {showSideToggle && (
          <button
            onClick={() => setOpen((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center"
            aria-label="Abrir seleção"
            title="Abrir seleção"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-lg border border-border-dark bg-card shadow-lg max-h-56 overflow-auto p-1.5">
            {options.map((opt: { label: string; value: string }) => {
              const active = value.some((v: { value: string }) => v.value === opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt)}
                  className="w-full text-left px-2.5 py-1.5 text-sm rounded hover:bg-muted flex items-center gap-2"
                >
                  <span
                    className={
                      "inline-flex w-4 h-4 items-center justify-center rounded border " +
                      (active ? "bg-indigo-600 text-white border-indigo-600" : "border-border/60")
                    }
                  >
                    {active && <Check className="w-3 h-3" />}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Hook ---------- */
function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  return ref;
}

/* ---------- Utils ---------- */
function cryptoRandomId() {
  // id simples para as linhas (ok para UI)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
