// ---------- SORT ----------
export function sortData<T>(
  data: T[],
  keyOrAccessor: keyof T | ((row: T) => unknown),
  direction: "asc" | "desc",
  opts?: { dateKeys?: (keyof T | string)[] } // ex.: { dateKeys: ['orderDate'] }
): T[] {
  const factor = direction === "asc" ? 1 : -1;
  const dateKeys = new Set((opts?.dateKeys ?? []).map(String));

  const getVal = (row: T) =>
    typeof keyOrAccessor === "function" ? keyOrAccessor(row) : (row as any)[keyOrAccessor];

  const isLikelyDate = (k: string, v: unknown) => {
    if (dateKeys.has(k)) return true;
    if (typeof v !== "string") return false;
    // heurística simples: ISO ou yyyy-mm-dd
    return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(v);
  };

  return [...data].sort((a: any, b: any) => {
    const ka = typeof keyOrAccessor === "function" ? "" : String(keyOrAccessor);
    const kb = ka; // mesma key

    let va = getVal(a);
    let vb = getVal(b);

    // nulls por último
    const aNull = va === null || va === undefined;
    const bNull = vb === null || vb === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;

    // datas
    if (isLikelyDate(ka, va) || isLikelyDate(kb, vb)) {
      const ta = toTime(va);
      const tb = toTime(vb);
      return (ta - tb) * factor;
    }

    // números
    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * factor;
    }
    // strings que representam número
    const na = Number(va);
    const nb = Number(vb);
    if (!Number.isNaN(na) && !Number.isNaN(nb) && na.toString() === String(va) && nb.toString() === String(vb)) {
      return (na - nb) * factor;
    }

    // fallback string
    return String(va).localeCompare(String(vb)) * factor;
  });
}

function toTime(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  const d = new Date(String(v));
  return d.getTime();
}

// ---------- SELEÇÃO ----------
export function toggleSelection(selected: string[], id: string): string[] {
  return selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id];
}

// Seleciona apenas as linhas *exibidas* (passe displayedRows)
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
