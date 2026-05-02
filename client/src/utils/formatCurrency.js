export const formatCurrency = (amount) =>
  `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(amount || 0)}`;
