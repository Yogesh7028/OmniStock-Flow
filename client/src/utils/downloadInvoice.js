import axiosInstance from "../api/axiosInstance";

export const downloadInvoice = async (invoiceId, invoiceNumber = "invoice") => {
  const response = await axiosInstance.get(`/invoices/${invoiceId}/download`, {
    responseType: "blob",
    params: { t: Date.now() },
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
