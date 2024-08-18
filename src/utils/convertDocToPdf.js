// utils/convertDocToPdf.js
const fs = require('fs');
const path = require('path');
const docxPdf = require('docx-pdf');

const convertDocToPdf = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    docxPdf(inputPath, (error, pdfBuffer) => {
      if (error) {
        console.error('Conversion error:', error);
        reject(error);
        return;
      }
      fs.writeFile(outputPath, pdfBuffer, (err) => {
        if (err) {
          console.error('Error saving PDF:', err);
          reject(err);
          return;
        }
        console.log('Conversion complete:', outputPath);
        resolve();
      });
    });
  });
};

module.exports = { convertDocToPdf };
