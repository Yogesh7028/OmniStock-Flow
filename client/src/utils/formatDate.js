export const formatDate = (date) =>
  date ? new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";
