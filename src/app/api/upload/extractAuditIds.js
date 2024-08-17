const XLSX = require('xlsx');
const fs = require('fs');

// Correct path to your local Excel file
const filePath = 'C:/Users/DELL/Documents/leonidbaichi/ressources/VA3011en5 Internal audit schedule 2023-2024.xls';

// Read the workbook
const workbook = XLSX.readFile(filePath);
const sheetName = 'Planning audit 2023'; // Adjust the sheet name if necessary
const worksheet = workbook.Sheets[sheetName];

if (!worksheet) {
  console.error(`Sheet named '${sheetName}' not found.`);
  process.exit(1);
}

// Convert sheet to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 to get raw data

// Identify the correct header row manually (adjust index as needed)
const headerRowIndex = 5; // Based on the provided data

const headers = data[headerRowIndex];
const auditIdIndex = headers.indexOf('Audit ID'); // Find the index of 'Audit ID' column

if (auditIdIndex === -1) {
  console.error('Audit ID column not found.');
  process.exit(1);
}

// Extract 'Audit ID' column
const auditIds = data.slice(headerRowIndex + 1) // Skip header rows
  .map(row => row[auditIdIndex])
  .filter(id => id && id !== ''); // Filter out empty or invalid IDs

// Save the extracted IDs to a JSON file
const outputPath = 'public/auditIds.json'; // Make sure the 'public' directory exists
fs.writeFileSync(outputPath, JSON.stringify(auditIds, null, 2), 'utf-8');

console.log('Audit IDs extracted and saved to public/auditIds.json');
