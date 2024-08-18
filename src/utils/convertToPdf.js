// utils/convertToPdf.js
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function convertExcelToPDF(excelFilePath, pdfFilePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const worksheet = workbook.getWorksheet(1);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfFilePath));

  worksheet.eachRow((row) => {
    row.eachCell((cell, colNumber) => {
      doc.text(cell.text || '', { continued: colNumber < row.cellCount });
    });
    doc.text('\n');
  });

  doc.end();
}

module.exports = { convertExcelToPDF };
