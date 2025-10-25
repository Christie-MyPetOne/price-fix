"use client";

import React, { useEffect, useMemo, useState } from "react";

/* =================== TIPOS =================== */
type Money = number | null | undefined;
type StatusVenda =
  | "Pago"
  | "Aguardando pagamento"
  | "Cancelado"
  | "Enviado"
  | "Faturado"
  | "Concluído";

export interface ImpostosDetalhe {
  ipiVenda?: Money; ipi?: Money; creditoIPI?: Money; creditoICMS?: Money; icms?: Money; icmsFCP?: Money;
  creditoPIS?: Money; pis?: Money; creditoCOFINS?: Money; cofins?: Money; icmsDIFAL?: Money; possuiST?: boolean; outrosCreditos?: Money;
}

export interface ProdutoDaVenda {
  qtd: number;
  nome: string;
  sku?: string;
  codigo?: string;
  imagemUrl?: string;

  // visíveis no header do item
  valorVenda?: Money; // prioridade sobre precoVenda
  precoVenda?: Money;

  // escondidos nos detalhes
  receitaFrete?: Money;
  desconto?: Money;

  custosVariaveis?: Money;
  custoEnvio?: Money;
  custoProdutos?: Money;
  comissaoCanal?: Money;
  taxaFixaMktplace?: Money;
  taxaFrete?: Money;

  gastosFixosPedido?: Money;
  gastosFreteAdicionais?: Money;
  descontosAdicionais?: Money;
  impostosAdicionais?: Money;

  impostos?: Money;
  impostosDetalhe?: ImpostosDetalhe;
}

export interface VendasInfoData {
  numeroPedido: string;
  dataPedido: string | Date;
  status: StatusVenda;

  marketplaceId?: string;
  origemLabel?: string;
  estadoDestino?: string;
  nfeEmitida?: boolean;

  // Totais / receitas
  valorVenda?: Money; // KPI
  receitaProdutos?: Money;
  receitaFrete?: Money;
  descontos?: Money;

  // Custos (pedido)
  custosVariaveis?: Money;
  custoEnvio?: Money;
  custoProdutos?: Money;
  comissaoCanal?: Money;
  taxaFixaMktplace?: Money;
  taxaFrete?: Money;

  impostos?: Money;

  // Adicionais
  gastosFixosPedido?: Money;
  gastosFreteAdicionais?: Money;
  descontosAdicionais?: Money;
  impostosAdicionais?: Money;

  produtos: ProdutoDaVenda[];
}

/* =================== HELPERS =================== */
const fmtBRL = (v: Money) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtPct = (v: number | null | undefined) =>
  `${((v ?? 0) * 100).toFixed(2)}%`;

const safe = (v: Money) => v ?? 0;

function calcPedido(d: VendasInfoData) {
  const receita = safe(d.receitaProdutos) + safe(d.receitaFrete) - safe(d.descontos);

  const variaveisComponentes =
    safe(d.custoProdutos) + safe(d.comissaoCanal) + safe(d.taxaFixaMktplace) + safe(d.custoEnvio) + safe(d.taxaFrete);
  const variaveisCampo = safe(d.custosVariaveis);
  const variaveisUsado = variaveisCampo > 0 ? variaveisCampo : variaveisComponentes;

  const adicionais =
    safe(d.gastosFixosPedido) + safe(d.gastosFreteAdicionais) + safe(d.descontosAdicionais) + safe(d.impostosAdicionais);

  const impostos = safe(d.impostos);

  const custosTotais = variaveisUsado + adicionais + impostos;
  const lucro = receita - custosTotais;
  const margem = receita > 0 ? lucro / receita : 0;

  return { receita, variaveisComponentes, variaveisCampo, variaveisUsado, adicionais, impostos, custosTotais, lucro, margem };
}

function calcItem(p: ProdutoDaVenda) {
  const receita = safe(p.precoVenda) + safe(p.receitaFrete) - safe(p.desconto);

  const variaveisComponentes =
    safe(p.custoProdutos) + safe(p.comissaoCanal) + safe(p.taxaFixaMktplace) + safe(p.custoEnvio) + safe(p.taxaFrete);
  const variaveisCampo = safe(p.custosVariaveis);
  const variaveisUsado = variaveisCampo > 0 ? variaveisCampo : variaveisComponentes;

  const adicionais =
    safe(p.gastosFixosPedido) + safe(p.gastosFreteAdicionais) + safe(p.descontosAdicionais) + safe(p.impostosAdicionais);

  const impostos = safe(p.impostos);

  const custosTotais = variaveisUsado + adicionais + impostos;
  const lucro = receita - custosTotais;
  const margem = receita > 0 ? lucro / receita : 0;

  return { receita, variaveisComponentes, variaveisCampo, variaveisUsado, adicionais, impostos, custosTotais, lucro, margem };
}

/* =================== UI BASE =================== */
const card: React.CSSProperties = { background: "var(--color-card)", border: "1px solid var(--color-border-dark)", borderRadius: 12, padding: 16 };
const row: React.CSSProperties  = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--color-border-dark)", fontSize: 14 };
const mutedTitle: React.CSSProperties = { fontSize: 12, textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8, letterSpacing: 0.3 };
const chip: React.CSSProperties = { background: "var(--color-background)", border: "1px solid var(--color-border-dark)", borderRadius: 10, padding: "12px 14px", minWidth: 160 };
const pillBtn: React.CSSProperties = { border: "1px solid var(--color-border-dark)", borderRadius: 10, padding: "8px 12px", background: "var(--color-card)", color: "var(--color-text)", fontWeight: 700, cursor: "pointer" };
const gridCols = (n: number): React.CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`, gap: 12 });

/* Acordeão controlado por “Expandir/Minimizar tudo” */
const Collapsible: React.FC<{ title: React.ReactNode; openAll: boolean | null; defaultOpen?: boolean; children?: React.ReactNode; right?: React.ReactNode; }> =
({ title, openAll, defaultOpen, children, right }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  useEffect(() => { if (openAll !== null) setOpen(openAll); }, [openAll]);
  return (
    <div style={{ ...card, padding: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: "100%", textAlign: "left", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "transparent", border: "none", cursor: "pointer" }}
      >
        <div style={{ fontWeight: 800 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {right}
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", fill: "currentColor", color: "var(--color-text-secondary)" }}>
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </button>
      {open && children && <div style={{ padding: 16, paddingTop: 0 }}>{children}</div>}
    </div>
  );
};

/* =================== COMPONENTE =================== */
interface Props { open: boolean; onClose: () => void; data: VendasInfoData; }

export const VendasInfo: React.FC<Props> = ({ open, onClose, data }) => {
  const K = useMemo(() => calcPedido(data), [data]);
  const [openAll, setOpenAll] = useState<boolean | null>(false); // controla expandir/minimizar todos

  if (!open) return null;

  const statusColor =
    data.status === "Cancelado" ? "var(--color-error)" :
    data.status === "Aguardando pagamento" ? "var(--color-warning)" :
    "var(--color-success)";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(940px,95vw)", maxHeight: "92vh", overflow: "auto", borderRadius: 16, background: "var(--color-card)", color: "var(--color-text)", border: "1px solid var(--color-border-dark)", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
        {/* Header */}
        <div style={{ padding: 18, borderBottom: "1px solid var(--color-border-dark)", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {data.origemLabel && <span style={{ border: "1px solid var(--color-border-dark)", borderRadius: 8, padding: "4px 8px", fontSize: 12, fontWeight: 700 }}>{data.origemLabel}</span>}
              <div style={{ fontWeight: 900 }}>Pedido {data.numeroPedido}</div>
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              {new Date(data.dataPedido).toLocaleString("pt-BR")} ·{" "}
              <span style={{ color: statusColor, fontWeight: 800 }}>{data.status}</span>
            </div>
          </div>
          <button onClick={onClose} style={pillBtn} aria-label="Fechar">✕</button>
        </div>

        {/* Barra de ações */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--color-border-dark)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button style={pillBtn} onClick={() => setOpenAll(false)}>Minimizar tudo</button>
          <button style={{ ...pillBtn, background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary-dark)" }} onClick={() => setOpenAll(true)}>Expandir tudo</button>
        </div>

        {/* Identificador / Canal */}
        <div style={{ padding: 16, borderBottom: "1px solid var(--color-border-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--color-background)", border: "1px solid var(--color-border-dark)" }} />
            <div style={{ flex: 1 }}>
              <div style={mutedTitle}>Número do pedido no canal</div>
              <div style={{ fontWeight: 900 }}>{data.marketplaceId ?? "—"}</div>
            </div>
          </div>
        </div>

        {/* KPIs principais */}
        <div style={{ padding: 16, ...gridCols(4) }}>
          <div style={chip}><div style={mutedTitle}>Valor de venda</div><div style={{ fontWeight: 900, fontSize: 18 }}>{fmtBRL(data.valorVenda ?? K.receita)}</div></div>
          <div style={chip}><div style={mutedTitle}>Lucro</div><div style={{ fontWeight: 900, fontSize: 18 }}>{fmtBRL(K.lucro)}</div></div>
          <div style={chip}><div style={mutedTitle}>Margem</div><div style={{ fontWeight: 900, fontSize: 18, color: "var(--color-primary-dark)" }}>{fmtPct(K.margem)}</div></div>
          <div style={chip}><div style={mutedTitle}>UF destino</div><div style={{ fontWeight: 900, fontSize: 18 }}>{data.estadoDestino ?? "—"}</div></div>
        </div>

        {/* ===== BLOCO ÚNICO: RECEITA + CUSTOS + IMPOSTOS ===== */}
        <div style={{ padding: 16 }}>
          <Collapsible title="Receita, custos e impostos" openAll={openAll} defaultOpen>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              {/* Receita */}
              <div style={card}>
                <div style={mutedTitle}>Receita</div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Receita de produtos</span><strong>{fmtBRL(data.receitaProdutos)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Receita de frete</span><strong>{fmtBRL(data.receitaFrete)}</strong></div>
                <div style={{ ...row, borderBottom: "none" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Descontos</span>
                  <strong>- {fmtBRL(data.descontos)}</strong>
                </div>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--color-border-dark)", fontSize: 12, color: "var(--color-text-secondary)" }}>
                  receita_total = {fmtBRL(data.receitaProdutos)} + {fmtBRL(data.receitaFrete)} − {fmtBRL(data.descontos)} = <b>{fmtBRL(K.receita)}</b>
                </div>
              </div>

              {/* Custos variáveis */}
              <div style={card}>
                <div style={mutedTitle}>Custos variáveis</div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Custo dos Produtos</span><strong>{fmtBRL(data.custoProdutos)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Comissão do Canal</span><strong>{fmtBRL(data.comissaoCanal)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Taxa fixa do MKTPlace</span><strong>{fmtBRL(data.taxaFixaMktplace)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Custo de Envio</span><strong>{fmtBRL(data.custoEnvio)}</strong></div>
                <div style={{ ...row, borderBottom: "none" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Taxa de Frete</span><strong>{fmtBRL(data.taxaFrete)}</strong>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
                  subtotal_componentes = <b>{fmtBRL(K.variaveisComponentes)}</b> | campo agregado = <b>{fmtBRL(data.custosVariaveis)}</b><br/>
                  usado no cálculo = <b>{fmtBRL(K.variaveisUsado)}</b> {K.variaveisCampo > 0 ? "(campo agregado)" : "(soma dos componentes)"}
                </div>
              </div>

              {/* Impostos + Adicionais */}
              <div style={card}>
                <div style={mutedTitle}>Impostos e adicionais</div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Impostos (total)</span><strong>{fmtBRL(data.impostos)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Gastos fixos do pedido</span><strong>{fmtBRL(data.gastosFixosPedido)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Gastos de frete adicionais</span><strong>{fmtBRL(data.gastosFreteAdicionais)}</strong></div>
                <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Descontos adicionais</span><strong>{fmtBRL(data.descontosAdicionais)}</strong></div>
                <div style={{ ...row, borderBottom: "none" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Impostos adicionais</span><strong>{fmtBRL(data.impostosAdicionais)}</strong>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
                  subtotal_adicionais = <b>{fmtBRL(K.adicionais)}</b>
                </div>
              </div>
            </div>

            {/* Resumo do cálculo simples */}
            <div style={{ ...card, marginTop: 12 }}>
              <div style={mutedTitle}>Resumo do cálculo</div>
              <div style={{ fontSize: 14 }}>
                <div style={{ marginBottom: 6 }}>Receita total: <b>{fmtBRL(K.receita)}</b></div>
                <div style={{ marginBottom: 6 }}>
                  Custos totais: <b>{fmtBRL(K.variaveisUsado + K.impostos + K.adicionais)}</b>{" "}
                  <span style={{ color: "var(--color-text-secondary)" }}>(variáveis + impostos + adicionais)</span>
                </div>
                <div>Lucro: <b>{fmtBRL(K.lucro)}</b> &nbsp;|&nbsp; Margem: <b>{fmtPct(K.margem)}</b></div>
              </div>
            </div>
          </Collapsible>
        </div>

        {/* ===== PRODUTOS (sempre visível) ===== */}
        <div style={{ padding: 16 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.produtos.map((p, i) => {
              const I = calcItem(p);
              const valorVendaItem = p.valorVenda ?? p.precoVenda;

              return (
                <div key={i} style={{ ...card }}>
                  <div style={{ fontWeight: 800 }}>Produtos ({data.produtos.length})</div>
                  {/* Cabeçalho do item: SEMPRE visível */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: "var(--color-background)", border: "1px solid var(--color-border-dark)", overflow: "hidden", flex: "0 0 auto" }}>
                      {p.imagemUrl && <img src={p.imagemUrl} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800 }}>{p.qtd}x {p.nome}</div>
                      {(p.sku || p.codigo) && (
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                          {p.sku ?? "—"}{p.sku && p.codigo ? " · " : ""}{p.codigo ?? "—"}
                        </div>
                      )}
                    </div>

                    {/* KPIs do item: SEMPRE visíveis */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <div style={chip}>
                        <div style={mutedTitle}>Valor de venda</div>
                        <div style={{ fontWeight: 900 }}>{fmtBRL(valorVendaItem)}</div>
                      </div>
                      <div style={chip}>
                        <div style={mutedTitle}>Lucro</div>
                        <div style={{ fontWeight: 900 }}>{fmtBRL(I.lucro)}</div>
                      </div>
                      <div style={chip}>
                        <div style={mutedTitle}>Margem</div>
                        <div style={{ fontWeight: 900, color: "var(--color-primary-dark)" }}>{fmtPct(I.margem)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do item: escondidos por padrão, controlados por Expandir/Minimizar tudo */}
                  <Collapsible title="Detalhes do item" openAll={openAll} defaultOpen={false}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
                      {/* Receita do item */}
                      <div style={card}>
                        <div style={mutedTitle}>Receita do item</div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Preço de venda</span><strong>{fmtBRL(p.precoVenda)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Receita de frete</span><strong>{fmtBRL(p.receitaFrete)}</strong></div>
                        <div style={{ ...row, borderBottom: "none" }}>
                          <span style={{ color: "var(--color-text-secondary)" }}>Desconto</span>
                          <strong>- {fmtBRL(p.desconto)}</strong>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
                          receita_item = {fmtBRL(p.precoVenda)} + {fmtBRL(p.receitaFrete)} − {fmtBRL(p.desconto)} = <b>{fmtBRL(I.receita)}</b>
                        </div>
                      </div>

                      {/* Custos variáveis do item */}
                      <div style={card}>
                        <div style={mutedTitle}>Custos variáveis (item)</div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Custo dos Produtos</span><strong>{fmtBRL(p.custoProdutos)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Comissão do Canal</span><strong>{fmtBRL(p.comissaoCanal)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Taxa fixa do MKTPlace</span><strong>{fmtBRL(p.taxaFixaMktplace)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Custo de Envio</span><strong>{fmtBRL(p.custoEnvio)}</strong></div>
                        <div style={{ ...row, borderBottom: "none" }}>
                          <span style={{ color: "var(--color-text-secondary)" }}>Taxa de Frete</span><strong>{fmtBRL(p.taxaFrete)}</strong>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
                          subtotal_componentes = <b>{fmtBRL(I.variaveisComponentes)}</b> | campo agregado = <b>{fmtBRL(p.custosVariaveis)}</b><br/>
                          usado = <b>{fmtBRL(I.variaveisUsado)}</b> {I.variaveisCampo > 0 ? "(campo agregado)" : "(soma dos componentes)"}
                        </div>
                      </div>

                      {/* Impostos e adicionais do item */}
                      <div style={card}>
                        <div style={mutedTitle}>Impostos e adicionais (item)</div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Impostos</span><strong>{fmtBRL(p.impostos)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Gastos fixos</span><strong>{fmtBRL(p.gastosFixosPedido)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Frete adicionais</span><strong>{fmtBRL(p.gastosFreteAdicionais)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Descontos adicionais</span><strong>{fmtBRL(p.descontosAdicionais)}</strong></div>
                        <div style={{ ...row, borderBottom: "none" }}>
                          <span style={{ color: "var(--color-text-secondary)" }}>Impostos adicionais</span><strong>{fmtBRL(p.impostosAdicionais)}</strong>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
                          custos_totais_item = {fmtBRL(I.variaveisUsado)} + {fmtBRL(I.impostos)} + {fmtBRL(I.adicionais)} = <b>{fmtBRL(I.custosTotais)}</b><br/>
                          lucro_item = {fmtBRL(I.receita)} − {fmtBRL(I.custosTotais)} = <b>{fmtBRL(I.lucro)}</b>
                        </div>
                      </div>
                    </div>

                    {/* Detalhamento de impostos (se existir) */}
                    {p.impostosDetalhe && (
                      <div style={{ ...card, marginTop: 12 }}>
                        <div style={mutedTitle}>Detalhamento de impostos (item)</div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>IPI de Venda</span><strong>{fmtBRL(p.impostosDetalhe.ipiVenda)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>IPI</span><strong>{fmtBRL(p.impostosDetalhe.ipi)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Crédito de IPI</span><strong>{fmtBRL(p.impostosDetalhe.creditoIPI)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Crédito de ICMS</span><strong>{fmtBRL(p.impostosDetalhe.creditoICMS)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>ICMS</span><strong>{fmtBRL(p.impostosDetalhe.icms)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>ICMS FCP</span><strong>{fmtBRL(p.impostosDetalhe.icmsFCP)}</strong></div>
                        <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>Crédito de PIS</span><strong>{fmtBRL(p.impostosDetalhe.creditoPIS)}</strong></div>
                        <div style={{ ...row, borderBottom: "none" }}>
                          <span style={{ color: "var(--color-text-secondary)" }}>COFINS (-)</span><strong>{fmtBRL(p.impostosDetalhe.cofins)}</strong>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text)" }}>
                          ST: <b>{p.impostosDetalhe.possuiST ? "Sim" : "Não"}</b> · Outros créditos: <b>{fmtBRL(p.impostosDetalhe.outrosCreditos)}</b>
                        </div>
                      </div>
                    )}
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </div>

        {/* OUTRAS INFORMAÇÕES (colapsável) */}
        <div style={{ padding: 16 }}>
          <Collapsible title="Outras informações" openAll={openAll} defaultOpen>
            <div style={{ ...card }}>
              <div style={row}><span style={{ color: "var(--color-text-secondary)" }}>NFe emitida</span><strong>{data.nfeEmitida ? "Sim" : "Não"}</strong></div>
              <div style={{ ...row, borderBottom: "none" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Estado de destino</span><strong>{data.estadoDestino ?? "—"}</strong>
              </div>
            </div>
          </Collapsible>
        </div>

        {/* Footer */}
        <div style={{ padding: 16, borderTop: "1px solid var(--color-border-dark)", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...pillBtn, background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary-dark)" }}>
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendasInfo;
