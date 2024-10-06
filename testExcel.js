// testExcel.js 

import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.resolve(__dirname, 'ressources', 'Auditors qualifications WMABE 2024-2025.xlsx');

try {
  // Read the file
  console.log('Reading Excel file...');
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = 'WMABE';
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet named '${sheetName}' not found.`);
  }
  console.log(`Sheet '${sheetName}' found.`);

  // Convert sheet to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log('Original Data:', data);

  // Modify data (example: change first cell of row 10)
  if (data.length > 9) {
    data[9][0] = 18052216; // Example modification
    console.log('Modified Data:', data[9]);
  } else {
    console.log('Not enough rows to modify.');
  }

  // Convert data back to worksheet
  const newWorksheet = XLSX.utils.aoa_to_sheet(data);

  // Preserve original sheet properties
  newWorksheet['!cols'] = worksheet['!cols'];
  newWorksheet['!rows'] = worksheet['!rows'];
  newWorksheet['!merges'] = worksheet['!merges'];

  // Replace the worksheet in the workbook
  workbook.Sheets[sheetName] = newWorksheet;

  // Write back to file
  console.log('Writing updated workbook back to file...');
  XLSX.writeFile(workbook, filePath);
  console.log('Workbook written successfully.');
} catch (error) {
  console.error('Error:', error.message);
}
