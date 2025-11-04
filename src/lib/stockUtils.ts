import { Product, StockConfig, HealthStatus } from "./types";

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

// 🧠 Classifica o estado de saúde do estoque conforme o número de dias restantes
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

// 📦 Sugere quantas unidades comprar para manter o estoque ideal
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
