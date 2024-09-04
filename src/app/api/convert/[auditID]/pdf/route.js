import fs from 'fs';
import path from 'path';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile';

const { ILOVE_PDF_PUBLIC_KEY, ILOVE_PDF_SECRET_KEY } = process.env;

if (!ILOVE_PDF_PUBLIC_KEY || !ILOVE_PDF_SECRET_KEY) {
  throw new Error('ILovePDF API credentials are missing.');
}

const ilovePDFInstance = new ILovePDFApi(ILOVE_PDF_PUBLIC_KEY, ILOVE_PDF_SECRET_KEY);

async function convertExcelToPDFInMemory(excelFilePath) {
  try {
    const task = ilovePDFInstance.newTask('officepdf');
    await task.start();
    const file = new ILovePDFFile(excelFilePath);
    await task.addFile(file);
    await task.process();
    const pdfBuffer = await task.download();
    return pdfBuffer;
  } catch (error) {
    throw new Error('Error converting Excel to PDF: ' + error.message);
  }
}

export async function GET(request, { params }) {
  const { auditID } = params;

  if (!auditID) {
    return new Response('Missing audit ID', { status: 400 });
  }

  try {
    const excelFilePath = path.join(process.cwd(), `ressources/audit-finalise/${auditID} WMABE.xlsx`);

    // Check if the file exists asynchronously
    await fs.promises.access(excelFilePath, fs.constants.R_OK);

    // Convert the Excel file to PDF
    const pdfBuffer = await convertExcelToPDFInMemory(excelFilePath);

    // Return the PDF buffer as a response
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${auditID}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error processing file:', error.message);
    return new Response(error.message, { status: error.message.includes('not found') ? 404 : 500 });
  }
}
