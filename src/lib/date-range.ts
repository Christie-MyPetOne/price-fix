// src/lib/date-range.ts

/* ========= opções de período ========= */
export const periodOptions: Record<string, string[]> = {
  Hoje: ["Ontem"],
  Ontem: ["7 dias anteriores", "15 dias anteriores", "30 dias anteriores", "Período personalizado"],
  "Esta semana": [
    "Semana passada",
    "4 semanas anteriores",
    "8 semanas anteriores",
    "12 semanas anteriores",
    "Período personalizado",
  ],
  "Semana passada": [
    "4 semanas anteriores",
    "8 semanas anteriores",
    "12 semanas anteriores",
    "Período personalizado",
  ],
  "Este mês": [
    "Mês passado",
    "2 meses anteriores",
    "4 meses anteriores",
    "6 meses anteriores",
    "Período personalizado",
  ],
  "Mês passado": [
    "2 meses anteriores",
    "4 meses anteriores",
    "6 meses anteriores",
    "Período personalizado",
  ],
  "Período personalizado": ["Período personalizado"],
};

export function formatDate(d?: string) {
  if (!d) return "";
  const [yyyy, mm, dd] = d.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function parseYMD(ymd?: string) {
  if (!ymd) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isWithin(d: Date, a?: string, b?: string) {
  if (!a || !b) return false;
  const da = parseYMD(a)!;
  const db = parseYMD(b)!;
  const min = Math.min(da.getTime(), db.getTime());
  const max = Math.max(da.getTime(), db.getTime());
  const dayStart = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return dayStart(d) >= dayStart(new Date(min)) && dayStart(d) <= dayStart(new Date(max));
}

export function sameDay(d: Date, ymd?: string) {
  if (!ymd) return false;
  const p = parseYMD(ymd)!;
  return (
    d.getFullYear() === p.getFullYear() &&
    d.getMonth() === p.getMonth() &&
    d.getDate() === p.getDate()
  );
}
