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
