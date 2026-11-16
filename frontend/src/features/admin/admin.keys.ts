export const adminKeys = {
  all: ["admin"] as const,

  dashboard: () => [...adminKeys.all, "dashboard"] as const,

  revenue: () => [...adminKeys.all, "revenue"] as const,

  monthlyRevenue: () => [...adminKeys.revenue(), "monthly"] as const,

  categoryRevenue: () => [...adminKeys.revenue(), "categories"] as const,

  orders: () => [...adminKeys.all, "orders"] as const,
};
