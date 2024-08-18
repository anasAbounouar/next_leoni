// EXTRACT Audit.js
const XLSX = require('xlsx');
const path = require('path');

function extractTableData() {
  // Correct path to your local Excel file
  const filePath = path.join(__dirname, '../../ressources/VA3011en5 Internal audit schedule 2023-2024.xls');

  // Read the workbook
  const workbook = XLSX.readFile(filePath);
  const sheetName = 'Planning audit 2023';
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet named '${sheetName}' not found.`);
  }

  // Convert sheet to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 to get raw data

  // Identify the correct header row manually (adjust index as needed)
  const headerRowIndex = 5; // Based on the provided data
  const headers = data[headerRowIndex];

  // Extract the full table data
  const tableData = data.slice(headerRowIndex + 1).map(row => {
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = row[index];
    });
    return rowObject;
  });

  return tableData;
}

module.exports = { extractTableData };
