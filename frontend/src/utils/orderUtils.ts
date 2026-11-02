export const ORDER_STATUSES = [
  { label: "Pending", style: "bg-yellow-100 text-yellow-700" },
  { label: "Confirmed", style: "bg-blue-100 text-blue-700" },
  { label: "Processing", style: "bg-yellow-100 text-yellow-700" },
  { label: "Shipped", style: "bg-purple-100 text-purple-700" },
  { label: "Delivered", style: "bg-green-100 text-green-700" },
  { label: "Cancelled", style: "bg-red-100 text-red-700" },
] as const;

export const getOrderStatus = (status: number) =>
  ORDER_STATUSES[status] ?? {
    label: "Unknown",
    style: "bg-gray-100 text-gray-700",
  };

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
export const formatOrderDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
