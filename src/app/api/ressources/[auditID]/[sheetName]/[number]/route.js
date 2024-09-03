import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export async function GET(request, { params }) {
  const { number } = params;
  const filePath = path.join(process.cwd(), 'ressources/Auditors qualifications WMABE 2024-2025.xlsx');

  try {
    // Check if the file exists
    await fs.promises.access(filePath, fs.constants.R_OK);

    // Read and parse the Excel workbook
    const workbook = XLSX.readFile(filePath);
    const sheetName = 'WMABE';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return new Response(`Sheet named '${sheetName}' not found.`, { status: 404 });
    }

    // Convert worksheet data to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Find the row matching the employee number
    const employeeData = data.slice(9).find(row => row[0] === parseInt(number, 10));

    if (employeeData) {
      // Structure the data for response
      const structuredData = employeeData.map((value, index) => ({
        index: index + 1,
        value: value || '',
      }));

      return new Response(JSON.stringify({ data: structuredData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response('Employee not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error processing request:', error.message);
    return new Response('Error processing file: ' + error.message, { status: 500 });
  }
}
