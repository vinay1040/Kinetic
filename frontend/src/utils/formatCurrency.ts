export const formatCurrency = (amount: number | null): string => {
  if (amount === null || !Number.isFinite(amount)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};