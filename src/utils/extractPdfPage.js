import { PDFDocument } from 'pdf-lib';

export async function extractPageFromPdf(pdfBlob, pageIndex) {
  try {
    // Load the PDF file from the Blob
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());

    // Create a new PDF Document
    const newPdfDoc = await PDFDocument.create();

    // Extract the specific page (pageIndex is zero-based)
    const [page] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
    newPdfDoc.addPage(page);

    // Save the new PDF with just the extracted page
    const newPdfBytes = await newPdfDoc.save();

    // Create a Blob URL from the new PDF
    const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(newPdfBlob);
  } catch (error) {
    console.error('Error extracting page from PDF:', error);
    throw new Error('Failed to extract page from PDF');
  }
}
