const generateInvoicePDF = require("../utils/generateInvoicePDF");

const generateInvoiceNumber = () => `INV-${Date.now()}`;

module.exports = {
  generateInvoicePDF,
  generateInvoiceNumber,
};
