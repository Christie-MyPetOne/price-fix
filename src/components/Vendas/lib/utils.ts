export const formatBRL = (value?: number) =>
  (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export const abbreviateProductName = (name: string, maxLength: number = 30) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
};
