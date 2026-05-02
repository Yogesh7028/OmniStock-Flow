const PDFDocument = require("pdfkit");

const colors = {
  teal: "#0f766e",
  tealDark: "#134e4a",
  tealSoft: "#ecfdf5",
  amber: "#f59e0b",
  ink: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  panel: "#f8fafc",
  white: "#ffffff",
};

const formatCurrency = (value) =>
  `INR ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) =>
  new Date(value || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const drawLogo = (doc, x, y) => {
  doc
    .roundedRect(x, y, 48, 48, 12)
    .fill(colors.teal)
    .fillColor(colors.white)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("OS", x, y + 14, { width: 48, align: "center" });

  doc
    .fillColor(colors.ink)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("OmniStock Flow", x + 62, y + 4);

  doc
    .fillColor(colors.muted)
    .font("Helvetica")
    .fontSize(9)
    .text("Inventory • Orders • Payments", x + 62, y + 30);
};

const drawInfoCard = (doc, title, lines, x, y, width) => {
  doc.roundedRect(x, y, width, 92, 10).fill(colors.panel).stroke(colors.border);
  doc
    .fillColor(colors.teal)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(title.toUpperCase(), x + 14, y + 14);

  doc.fillColor(colors.ink).font("Helvetica").fontSize(10);
  lines.forEach((line, index) => {
    doc.text(line || "-", x + 14, y + 34 + index * 15, { width: width - 28 });
  });
};

const ensureSpace = (doc, neededHeight) => {
  if (doc.y + neededHeight <= doc.page.height - 70) return;
  doc.addPage();
  doc.y = 56;
};

const generateInvoicePDF = (invoice) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({
      margin: 44,
      size: "A4",
      bufferPages: true,
    });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 88;
    const orderId = invoice.order?._id || invoice.order || "-";
    const payment = invoice.payment || {};

    doc.rect(0, 0, pageWidth, 132).fill(colors.tealSoft);
    doc.rect(0, 0, pageWidth, 10).fill(colors.teal);
    drawLogo(doc, 44, 38);

    doc
      .fillColor(colors.tealDark)
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("INVOICE", 390, 39, { width: 160, align: "right" })
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.muted)
      .text(invoice.invoiceNumber, 390, 76, { width: 160, align: "right" })
      .fillColor(colors.teal)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(invoice.paymentStatus || "Paid", 390, 96, { width: 160, align: "right" });

    drawInfoCard(
      doc,
      "Billed To",
      [invoice.customerName, invoice.customerEmail, `Order: ${orderId}`],
      44,
      158,
      245
    );
    drawInfoCard(
      doc,
      "Invoice Details",
      [
        `Date: ${formatDate(invoice.createdAt)}`,
        `Payment: ${invoice.paymentStatus || "Paid"}`,
        `Provider: ${payment.provider || "Razorpay"}`,
      ],
      306,
      158,
      245
    );

    doc.y = 288;
    doc
      .fillColor(colors.ink)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Items");

    const tableTop = doc.y + 14;
    const columns = {
      item: 58,
      qty: 328,
      price: 386,
      total: 474,
    };

    doc
      .roundedRect(44, tableTop, contentWidth, 32, 8)
      .fill(colors.teal)
      .fillColor(colors.white)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("PRODUCT", columns.item, tableTop + 11, { width: 240 })
      .text("QTY", columns.qty, tableTop + 11, { width: 42, align: "right" })
      .text("PRICE", columns.price, tableTop + 11, { width: 74, align: "right" })
      .text("TOTAL", columns.total, tableTop + 11, { width: 62, align: "right" });

    doc.y = tableTop + 44;
    (invoice.items || []).forEach((item, index) => {
      ensureSpace(doc, 44);
      const rowY = doc.y;
      const rowHeight = Math.max(34, doc.heightOfString(item.productName || "-", { width: 240 }) + 18);

      if (index % 2 === 0) {
        doc.roundedRect(44, rowY - 6, contentWidth, rowHeight, 6).fill(colors.panel);
      }

      doc
        .fillColor(colors.ink)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(item.productName || "-", columns.item, rowY, { width: 240 })
        .font("Helvetica")
        .fillColor(colors.muted)
        .text(String(item.quantity || 0), columns.qty, rowY, { width: 42, align: "right" })
        .text(formatCurrency(item.price), columns.price, rowY, { width: 74, align: "right" })
        .fillColor(colors.ink)
        .font("Helvetica-Bold")
        .text(formatCurrency(item.total), columns.total, rowY, { width: 62, align: "right" });

      doc.y = rowY + rowHeight;
    });

    ensureSpace(doc, 150);
    const totalsX = 344;
    const totalsY = doc.y + 20;
    const totalsWidth = 207;

    doc.roundedRect(totalsX, totalsY, totalsWidth, 118, 10).fill(colors.panel).stroke(colors.border);

    const totalRows = [
      ["Subtotal", invoice.subtotal],
      ["GST / Tax", invoice.taxAmount],
      ["Grand Total", invoice.totalAmount],
    ];

    totalRows.forEach(([label, value], index) => {
      const y = totalsY + 18 + index * 31;
      const isTotal = index === totalRows.length - 1;

      if (isTotal) {
        doc.roundedRect(totalsX + 10, y - 8, totalsWidth - 20, 28, 7).fill(colors.teal);
      }

      doc
        .fillColor(isTotal ? colors.white : colors.muted)
        .font(isTotal ? "Helvetica-Bold" : "Helvetica")
        .fontSize(isTotal ? 11 : 10)
        .text(label, totalsX + 18, y, { width: 80 })
        .text(formatCurrency(value), totalsX + 94, y, { width: 92, align: "right" });
    });

    doc
      .fillColor(colors.muted)
      .font("Helvetica")
      .fontSize(9)
      .text("Thank you for using OmniStock Flow.", 44, totalsY + 14, { width: 240 })
      .text("This invoice was generated automatically after payment confirmation.", 44, totalsY + 34, {
        width: 240,
      });

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i += 1) {
      doc.switchToPage(i);
      doc
        .moveTo(44, doc.page.height - 46)
        .lineTo(doc.page.width - 44, doc.page.height - 46)
        .strokeColor(colors.border)
        .stroke();

      doc
        .fillColor(colors.muted)
        .font("Helvetica")
        .fontSize(8)
        .text("OmniStock Flow", 44, doc.page.height - 34)
        .text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 34, {
          align: "center",
        })
        .text("Generated invoice", doc.page.width - 160, doc.page.height - 34, {
          width: 116,
          align: "right",
        });
    }

    doc.end();
  });

module.exports = generateInvoicePDF;
