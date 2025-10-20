// Função de ordenação genérica que mantém o tipo original
export function sortData<T>(
  data: T[],
  key: keyof T,
  direction: "asc" | "desc"
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}

// Selecionar/Desselecionar um item
export function toggleSelection(selected: string[], id: string): string[] {
  return selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id];
}

// Selecionar todos ou limpar seleção
export function toggleSelectAll<T extends { id: string }>(
  allData: T[],
  selected: string[]
): string[] {
  return selected.length === allData.length
    ? []
    : allData.map((item) => item.id);
}
