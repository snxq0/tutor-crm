const service = require("../services/invoices.service");
const { readData } = require("../utils/fileStorage");
const PDFDocument = require("pdfkit");
const path = require("path");

function getAll(req, res) {
  res.json(service.getAll());
}

function generate(req, res) {
  try {
    const { studentId, yearMonth } = req.body;
    const invoice = service.generateInvoice(studentId, yearMonth);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function markAsPaid(req, res) {
  const updated = service.markAsPaid(req.params.id);

  if (!updated) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(updated);
}

/* =========================
   PDF GENERATION
========================= */

function downloadPdf(req, res) {
  const invoices = readData("invoices.json");
  const students = readData("students.json");

  const invoice = invoices.find(i => i.id === req.params.id);
  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const student = students.find(s => s.id === invoice.studentId);

  const doc = new PDFDocument({ margin: 50 });

  // 👇 подключаем Unicode шрифт
  doc.registerFont(
    "MainFont",
    path.join(__dirname, "../../fonts/DejaVuSans.ttf")
  );

  doc.font("MainFont");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=rechnung-${invoice.period}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  const invoiceNumber = `${invoice.period}-${invoice.id.slice(-4)}`;
  const today = new Date().toLocaleDateString("de-DE");

  // ===== Заголовок =====
  doc.fontSize(22).text("RECHNUNG");
  doc.moveDown(2);

  // ===== Информация =====
  doc.fontSize(12);
  doc.text(`Rechnungsnummer: ${invoiceNumber}`);
  doc.text(`Datum: ${today}`);
  doc.moveDown();

  doc.text(`Schüler: ${student?.name || ""}`);
  doc.text(`Leistungszeitraum: ${invoice.period}`);
  doc.moveDown(2);

  // ===== Расчёт =====
  doc.text(
    `${invoice.lessonsCount} Unterrichtsstunden × ${invoice.pricePerLesson}€`
  );

  doc.moveDown();
  doc.moveTo(50, doc.y)
     .lineTo(550, doc.y)
     .stroke();

  doc.moveDown();
  doc.fontSize(14).text(`Gesamtbetrag: ${invoice.total}€`);
  doc.moveDown(2);

  // ===== Примечание =====
  doc.fontSize(11).text(
    "Zahlung bitte bar oder per Überweisung innerhalb von 14 Tagen."
  );

  doc.moveDown(3);

  // ===== Подпись =====
  doc.text("Nikita Isaiev");
  doc.text("Nachhilfe Mathematik");

  doc.end();
}

module.exports = {
  getAll,
  generate,
  markAsPaid,
  downloadPdf,
};