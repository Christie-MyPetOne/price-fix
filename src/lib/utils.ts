import { Product, StockConfig, HealthStatus, AnyRow } from "./types";

/**
 * Ordena um array de objetos ou valores com base em uma chave ou função acessora.
 * Suporta ordenação ascendente e descendente, além de detecção automática de datas e números.
 */
export function sortData<T>(
  data: T[],
  keyOrAccessor: keyof T | ((row: T) => unknown),
  direction: "asc" | "desc",
  opts?: { dateKeys?: (keyof T | string)[] }
): T[] {
  const factor = direction === "asc" ? 1 : -1;
  const dateKeys = new Set((opts?.dateKeys ?? []).map(String));

  const getVal = (row: T) =>
    typeof keyOrAccessor === "function"
      ? keyOrAccessor(row)
      : (row as any)[keyOrAccessor];

  const isLikelyDate = (k: string, v: unknown) => {
    if (dateKeys.has(k)) return true;
    if (typeof v !== "string") return false;
    return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(v);
  };

  return [...data].sort((a: any, b: any) => {
    const ka = typeof keyOrAccessor === "function" ? "" : String(keyOrAccessor);
    const kb = ka;

    const va = getVal(a);
    const vb = getVal(b);

    const aNull = va === null || va === undefined;
    const bNull = vb === null || vb === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;

    if (isLikelyDate(ka, va) || isLikelyDate(kb, vb)) {
      const ta = toTime(va);
      const tb = toTime(vb);
      return (ta - tb) * factor;
    }

    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * factor;
    }

    const na = Number(va);
    const nb = Number(vb);
    if (
      !Number.isNaN(na) &&
      !Number.isNaN(nb) &&
      na.toString() === String(va) &&
      nb.toString() === String(vb)
    ) {
      return (na - nb) * factor;
    }

    return String(va).localeCompare(String(vb)) * factor;
  });
}

/**
 * Converte um valor (string ou Date) em timestamp numérico para comparação de datas.
 */
function toTime(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  const d = new Date(String(v));
  return d.getTime();
}

/**
 * Alterna a seleção de um item (single click)
 */
export function toggleSelection(selected: string[], id: string): string[] {
  return selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id];
}

/**
 * Alterna a seleção de todas as linhas da página
 */
export function toggleSelectAll<T extends { id: string }>(
  rowsOnPage: T[],
  selected: string[]
): string[] {
  const pageIds = rowsOnPage.map((r) => r.id);
  const allSelected = pageIds.every((id) => selected.includes(id));
  if (allSelected) return selected.filter((id) => !pageIds.includes(id));
  const set = new Set([...selected, ...pageIds]);
  return Array.from(set);
}

/**
 * Lógica de seleção universal com shift+click
 */
export function handleShiftSelection<T extends { id: string }>(
  clickedId: string,
  rows: T[],
  selected: string[],
  lastIndex: number | null
): string[] {
  const currentIndex = rows.findIndex((r) => r.id === clickedId);

  if (lastIndex !== null) {
    const start = Math.min(lastIndex, currentIndex);
    const end = Math.max(lastIndex, currentIndex);
    const idsInRange = rows.slice(start, end + 1).map((r) => r.id);
    return Array.from(new Set([...selected, ...idsInRange]));
  } else {
    return toggleSelection(selected, clickedId);
  }
}

/**
 * Paginação
 */
export function paginate<T>(data: T[], page: number, perPage: number) {
  const totalPages = Math.ceil(data.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageData = data.slice(start, end);
  return { pageData, totalPages };
}

/**
 * Formata valores numéricos em BRL curto.
 */
export function formatBRLShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)} mi`;
  if (abs >= 1_000) return `R$ ${Math.round(n / 1000)} mil`;
  return `R$ ${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(n)}`;
}

/**
 * Formata um valor numérico como BRL para exibir em tooltip.
 */
export function defaultTooltipFormatter(value: any) {
  return `R$ ${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value as number)}`;
}

/**
 * Formata um número inteiro para exibição em formato BR.
 */
export function formatInt(n: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
}

/**
 * Formata um valor numérico como BRL para tooltip (2 casas decimais).
 */
export function tooltipBRL(value: any) {
  return `R$ ${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value as number)}`;
}

/**
 * Calcula o domínio para eixos de gráfico com base nos dados fornecidos.
 * Detecta se os valores são fracionais (0 a 1) ou absolutos.
 */
export function calcularDominio(data: AnyRow[], yKey: string) {
  if (!data?.length)
    return { isFraction: true, domain: ["auto", "auto"] as const };

  const vals = data
    .map((d) => Number(d?.[yKey] ?? 0))
    .filter((v) => !Number.isNaN(v));

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const fraction = Math.max(Math.abs(min), Math.abs(max)) <= 1;

  if (fraction) {
    const pad = 0.05;
    return {
      isFraction: true,
      domain: [min - pad, max + pad] as [number, number],
    };
  }

  return { isFraction: false, domain: ["auto", "auto"] as const };
}

// Calcula quantos dias de estoque restam com base nas vendas diárias
export const getDaysLeft = (
  product: Product,
  salesHistoryLength: number = 7
): number => {
  // Se não houver histórico de vendas, retorna 0
  if (!product.salesHistory) return 0;

  // Soma todas as vendas do histórico
  const totalSales = product.salesHistory.reduce((a, b) => a + b, 0);
  // Calcula média de vendas por dia
  const salesPerDay =
    totalSales / (product.salesHistory.length || salesHistoryLength);

  // Se estoque for inválido ou vendas por dia forem zero, não há dias restantes
  if (
    product.stockLevel === undefined ||
    product.stockLevel <= 0 ||
    salesPerDay <= 0
  ) {
    return 0;
  }

  // Divide estoque atual pela média de vendas para estimar dias restantes
  const daysLeft = product.stockLevel / salesPerDay;

  // Retorna o valor se for finito (evita Infinity ou NaN)
  return isFinite(daysLeft) ? daysLeft : 0;
};

// Classifica o estado de saúde do estoque conforme o número de dias restantes
export const calculateStockHealth = (
  daysLeft: number,
  stockConfig: StockConfig
): HealthStatus => {
  // Sem estoque = risco máximo
  if (daysLeft <= 0) {
    return "Risco";
  }

  // Avalia os níveis definidos na configuração do estoque
  if (daysLeft <= stockConfig.excelente) return "Excelente";
  if (daysLeft <= stockConfig.moderado) return "Média";
  if (daysLeft <= stockConfig.risco) return "Risco";

  // Caso ultrapasse todos os limites → estoque parado
  return "Parado";
};

// Sugere quantas unidades comprar para manter o estoque ideal
export const getPurchaseSuggestionUnits = (
  product: Product,
  stockConfig: StockConfig
): number => {
  // Se não há histórico de vendas, não dá pra sugerir nada
  if (!product.salesHistory) return 0;

  // Média de vendas diárias
  const totalSales = product.salesHistory.reduce((a, b) => a + b, 0);
  const salesPerDay = totalSales / (product.salesHistory.length || 7);

  // Quantos dias de cobertura queremos manter (definido na config)
  const idealPurchaseDays = stockConfig.comprarPara;

  // Calcula quantas unidades faltam para atingir a meta de dias de cobertura
  const purchaseSuggestionUnits = Math.max(
    0,
    Math.ceil(idealPurchaseDays * salesPerDay - (product.stockLevel || 0))
  );
  return purchaseSuggestionUnits;
};

// Define o status de compra (se precisa pedir mais, se está bom, etc.)
export const getPurchaseStatus = (
  product: Product,
  healthStatus: HealthStatus
): string => {
  // Se não há dado de estoque, assume que está "Bom"
  if (product.stockLevel === undefined) return "Bom";
  // Se acabou o estoque mas ainda há vendas → "Acabou"
  if (product.stockLevel <= 0 && (product.sales || 0) > 0) return "Acabou";
  // Se o estoque está em risco ou médio → precisa de pedido
  if (healthStatus === "Risco" || healthStatus === "Média") return "Pedido";
  // Se está excelente ou parado → está tudo bem
  if (healthStatus === "Excelente" || healthStatus === "Parado") return "Bom";

  return "Bom";
};
