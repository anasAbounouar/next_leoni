import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export async function GET(request, { params }) {
  const { auditID, sheetName } = params;

  // Construct the file path
  const filePath = path.resolve(process.cwd(), 'ressources', 'audit-finalise', `${auditID} WMABE.xlsx`);
  
  console.log('Resolved file path:', filePath); // Log the resolved file path for debugging

  try {
    // Check if the file exists and is readable
    await fs.promises.access(filePath, fs.constants.R_OK);

    // Read and parse the workbook
    const fileBuffer = await fs.promises.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return new Response(`Sheet named '${sheetName}' not found.`, { status: 404 });
    }

    // Convert the worksheet to JSON format
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Send JSON response with the sheet content
    return new Response(JSON.stringify({ content: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    return new Response('Error processing file: ' + error.message, { status: 500 });
  }
}
