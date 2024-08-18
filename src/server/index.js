const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');
const { processSwotData } = require('../utils/processSwotData'); // Import the utility function

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors());

// Route to fetch all audit IDs
app.get('/api/audit-ids', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../ressources/VA3011en5 Internal audit schedule 2023-2024.xls');
    const workbook = XLSX.readFile(filePath);
    const sheetName = 'Planning audit 2023';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(`Sheet named '${sheetName}' not found.`);
    }

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headerRowIndex = 5;
    const headers = data[headerRowIndex];

    const tableData = data.slice(headerRowIndex + 1).map(row => {
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index];
      });
      return rowObject;
    });

    res.json({ tableData });
  } catch (error) {
    console.error('Error fetching audit IDs:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch data for a specific audit ID and sheet
// Route to fetch raw data for a specific audit ID and sheet
app.get('/api/ressources/:auditID/:sheetName', (req, res) => {
  const { auditID, sheetName } = req.params;

  console.log('Requested Audit ID:', auditID);
  console.log('Requested Sheet Name:', sheetName);

  try {
    const filePath = path.join(__dirname, `../../ressources/${auditID} WMABE.xlsx`);
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(`Sheet named '${sheetName}' not found.`);
    }

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Read data as an array of arrays

    res.json({ content: data });
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
