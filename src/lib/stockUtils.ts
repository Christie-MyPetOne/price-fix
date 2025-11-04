import { Product, StockConfig, HealthStatus } from "./types";

export const getDaysLeft = (
  product: Product,
  salesHistoryLength: number = 7
): number => {
  if (!product.salesHistory) return 0;
  
  const totalSales = product.salesHistory.reduce((a, b) => a + b, 0);
  const salesPerDay = totalSales / (product.salesHistory.length || salesHistoryLength);

  if (product.stockLevel === undefined || product.stockLevel <= 0 || salesPerDay <= 0) {
    return 0;
  }

  const daysLeft = product.stockLevel / salesPerDay;
  return isFinite(daysLeft) ? daysLeft : 0;
};

export const calculateStockHealth = (
  daysLeft: number,
  stockConfig: StockConfig
): HealthStatus => {
  if (daysLeft <= 0) {
    return "Risco";
  }

  if (daysLeft <= stockConfig.excelente) return "Excelente";
  if (daysLeft <= stockConfig.moderado) return "Média";
  if (daysLeft <= stockConfig.risco) return "Risco";
  
  return "Parado";
};

export const getPurchaseSuggestionUnits = (
  product: Product,
  stockConfig: StockConfig
): number => {
  if (!product.salesHistory) return 0;
  
  const totalSales = product.salesHistory.reduce((a, b) => a + b, 0);
  const salesPerDay = totalSales / (product.salesHistory.length || 7);
  const idealPurchaseDays = stockConfig.comprarPara;

  const purchaseSuggestionUnits = Math.max(
    0,
    Math.ceil(idealPurchaseDays * salesPerDay - (product.stockLevel || 0))
  );

  return purchaseSuggestionUnits;
};

export const getPurchaseStatus = (
  product: Product,
  healthStatus: HealthStatus
): string => {
  if (product.stockLevel === undefined) return "Bom";
  if (product.stockLevel <= 0 && (product.sales || 0) > 0) return "Acabou";

  if (healthStatus === "Risco" || healthStatus === "Média") return "Pedido";
  if (healthStatus === "Excelente" || healthStatus === "Parado") return "Bom";

  return "Bom";
};