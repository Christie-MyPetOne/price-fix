"use client";

import { useState, useEffect, useRef } from "react";

type CanalVenda = {
  id: number;
  nome: string;
};

type Deposito = {
  id: number;
  nome: string;
  ignorar: boolean;
  fulfillment: boolean;
  canaisSelecionados: number[];
};

const canaisVenda: CanalVenda[] = [
  { id: 1, nome: "Tray (11499)" },
  { id: 2, nome: "Amazon (9804)" },
  { id: 3, nome: "Amazon FBA Classic (6688)" },
  { id: 4, nome: "Amazon FBA Onsite (10675)" },
  { id: 5, nome: "Magalu Marketplace (11427)" },
  { id: 6, nome: "MY.PET.ONE (7706)" },
  { id: 7, nome: "Shopee" },
  { id: 8, nome: "Mercado Livre" },
  { id: 9, nome: "Carrefour" },
  { id: 10, nome: "Via / Casas Bahia" },
];

const depositosIniciais: Deposito[] = [
  {
    id: 1,
    nome: "Arca de Noé - Galpão Pet 15",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 2,
    nome: "Arca de Noé - Loja Física",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 3,
    nome: "Armazena Aí",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 4,
    nome: "Avaria",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 5,
    nome: "Centro de Distribuição",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 6,
    nome: "Centro Distribuição",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 7,
    nome: "Depósito padrão",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 8,
    nome: "Depósito Transferência",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
  {
    id: 9,
    nome: "Estoque Full Conta 2",
    ignorar: false,
    fulfillment: false,
    canaisSelecionados: [],
  },
];

export default function ConfigDepositos() {
  const [depositos, setDepositos] = useState<Deposito[]>(depositosIniciais);
  const [dropdownAbertoId, setDropdownAbertoId] = useState<number | null>(null);

  // ref para o dropdown atualmente aberto
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fieldWidth = "w-[clamp(160px,40vw,355px)]";

  const baseInputCls =
    "h-9 rounded-md border border-border-dark bg-[var(--color-card)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

  // Fecha ao clicar fora e ao apertar ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownAbertoId(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownAbertoId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleIgnorar(id: number) {
    setDepositos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ignorar: !d.ignorar } : d)),
    );
  }

  function toggleFulfillment(id: number) {
    setDepositos((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, fulfillment: !d.fulfillment } : d,
      ),
    );
  }

  function toggleDropdown(id: number) {
    setDropdownAbertoId((prev) => (prev === id ? null : id));
  }

  function toggleCanal(depositoId: number, canalId: number) {
    setDepositos((prev) =>
      prev.map((d) => {
        if (d.id !== depositoId) return d;
        const jaTem = d.canaisSelecionados.includes(canalId);
        return {
          ...d,
          canaisSelecionados: jaTem
            ? d.canaisSelecionados.filter((c) => c !== canalId)
            : [...d.canaisSelecionados, canalId],
        };
      }),
    );
  }

  function getResumoCanais(ids: number[]) {
    if (!ids.length) return "Selecione os canais vinculados";
    if (ids.length === 1) {
      const canal = canaisVenda.find((c) => c.id === ids[0]);
      return canal ? canal.nome : "1 canal selecionado";
    }
    return `${ids.length} canais selecionados`;
  }

  return (
    <div className="-mt-9 min-h-[calc(100vh-64px)] pt-6">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="mb-4">
          <h1 className="ml-1 text-2xl font-semibold text-text">Depósitos</h1>
          <div className="mt-2 space-y-1 text-sm text-text-secondary">
            <p>
              Configure seus depósitos para nos ajudar a entender cada depósito
              da sua operação.
            </p>
            <p>
              <span className="font-medium text-text">
                Sua operação conta com depósitos falsos?
              </span>{" "}
              Basta marcar a opção de ignorar e não contabilizaremos estes
              estoques em seus cálculos do Otimizador.
            </p>
            <p>
              <span className="font-medium text-text">
                Existem depósitos fulfillment?
              </span>{" "}
              Marque a opção de fulfillment para cada um e assinale quais canais
              de venda estão associados a cada depósito e nós faremos o cálculo
              de todo o resto.
            </p>
          </div>
        </div>

        {/* Card principal */}
        <div className="relative rounded-xl border border-border-dark bg-card shadow-sm">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-[minmax(240px,1.2fr)_120px_140px_minmax(260px,1.5fr)] items-center gap-2 bg-border-dark px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            <div>Depósitos</div>
            <div className="text-center">Ignorar</div>
            <div className="text-center">Fulfillment</div>
            <div>Canais vinculados</div>
          </div>

          {/* Linhas */}
          <div className="divide-y divide-border-dark">
            {depositos.map((deposito, index) => {
              const isNearBottom = index >= depositos.length - 3;

              return (
                <div
                  key={deposito.id}
                  className="grid grid-cols-[minmax(240px,1.2fr)_120px_140px_minmax(260px,1.5fr)] items-center gap-2 px-5 py-3 text-sm"
                >
                  {/* Nome */}
                  <div className="text-text">{deposito.nome}</div>

                  {/* Ignorar */}
                  <div className="flex justify-center">
                    <ToggleSwitch
                      checked={deposito.ignorar}
                      onChange={() => toggleIgnorar(deposito.id)}
                    />
                  </div>

                  {/* Fulfillment */}
                  <div className="flex justify-center">
                    <ToggleSwitch
                      checked={deposito.fulfillment}
                      onChange={() => toggleFulfillment(deposito.id)}
                    />
                  </div>

                  {/* Canais vinculados */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(deposito.id)}
                      className={`${baseInputCls} ${fieldWidth} flex w-full items-center justify-between gap-2`}
                    >
                      <span className="truncate text-left text-xs sm:text-sm">
                        {getResumoCanais(deposito.canaisSelecionados)}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {dropdownAbertoId === deposito.id ? "▲" : "▼"}
                      </span>
                    </button>

                    {dropdownAbertoId === deposito.id && (
                      <div
                        ref={dropdownRef}
                        className={[
                          "absolute z-50 max-h-64 min-w-[260px] overflow-y-auto rounded-md border border-border-dark bg-[var(--color-card)] text-xs shadow-lg",
                          isNearBottom ? "bottom-full mb-1" : "top-full mt-1",
                        ].join(" ")}
                      >
                        {canaisVenda.map((canal) => {
                          const checked =
                            deposito.canaisSelecionados.includes(canal.id);
                          return (
                            <label
                              key={canal.id}
                              className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-[var(--color-background-soft)]"
                            >
                              {/* espaço para logo */}
                              <div className="h-5 w-5 flex-shrink-0 rounded-sm bg-border-dark/50" />
                              <input
                                type="checkbox"
                                className="accent-primary"
                                checked={checked}
                                onChange={() =>
                                  toggleCanal(deposito.id, canal.id)
                                }
                              />
                              <span className="truncate">{canal.nome}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== Componentes auxiliares =================== */

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
};

function ToggleSwitch({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
        checked
          ? "border-primary bg-primary"
          : "border-border-dark bg-[var(--color-card-soft)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
