const Invoice = require("../models/Invoice");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const generateInvoicePDF = require("../utils/generateInvoicePDF");

const getInvoices = asyncHandler(async (req, res) => {
  let query = Invoice.find()
    .populate("order")
    .populate("payment")
    .sort({ createdAt: -1 });

  if (req.user.role === "STORE_MANAGER") {
    query = query.where("customerEmail").equals(req.user.email);
  }

  const invoices = await query;
  successResponse(res, "Invoices fetched", invoices);
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate({
      path: "order",
      populate: { path: "storeManager", select: "name email" },
    })
    .populate("payment");
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  if (
    req.user.role === "STORE_MANAGER" &&
    invoice.customerEmail !== req.user.email &&
    String(invoice.order?.storeManager?._id || invoice.order?.storeManager) !== String(req.user._id)
  ) {
    res.status(403);
    throw new Error("You can only download your own invoices");
  }

  const buffer = await generateInvoicePDF(invoice);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
  res.send(buffer);
});

module.exports = { getInvoices, downloadInvoice };
