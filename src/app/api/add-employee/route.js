import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';


export async function POST(request) {
  const filePath = path.join(process.cwd(), 'ressources/Auditors qualifications WMABE 2024-2025.xlsx');
  const newEmployee = await request.json();

  try {
    if (!fs.existsSync(filePath)) {
      return new Response(`Excel file not found at ${filePath}`, { status: 404 });
    }

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets['WMABE'];

    if (!worksheet) {
      return new Response(`Sheet 'WMABE' not found in the Excel file.`, { status: 404 });
    }

    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = await import('../../../app/services/auditorsList/headers.js').then(module => module.default);

    const newRow = headers.map(header => newEmployee[header.column] || '');

    if (!Array.isArray(newRow) || newRow.length !== headers.length) {
      return new Response("New row data structure is invalid.", { status: 400 });
    }

    sheetData.push(newRow);

    const newWorksheet = XLSX.utils.aoa_to_sheet(sheetData);
    workbook.Sheets['WMABE'] = newWorksheet;

    XLSX.writeFile(workbook, filePath);

    return new Response(JSON.stringify({ message: 'Employee added successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`There was an error updating the Excel file: ${error.message}`, { status: 500 });
  }
}
