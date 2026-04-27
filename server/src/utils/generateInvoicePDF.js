const PDFDocument = require("pdfkit");

const generateInvoicePDF = (invoice) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).text("OmniStock Flow Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Order ID: ${invoice.order?._id || invoice.order}`);
    doc.text(`Payment Status: ${invoice.paymentStatus}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`);
    doc.moveDown();
    doc.text(`Store Manager: ${invoice.customerName}`);
    doc.text(`Email: ${invoice.customerEmail}`);
    doc.moveDown();
    doc.text("Items:");

    invoice.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.productName} | Qty: ${item.quantity} | Price: ${item.price} | Total: ${item.total}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: ${invoice.subtotal}`);
    doc.text(`GST/Tax: ${invoice.taxAmount}`);
    doc.text(`Total: ${invoice.totalAmount}`);
    doc.end();
  });

module.exports = generateInvoicePDF;
