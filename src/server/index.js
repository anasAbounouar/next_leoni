const express = require('express');
const cors = require('cors');
const { extractTableData } = require('./extractAudit');  // Use the renamed function

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors()); // Add this line to enable CORS

app.get('/api/audit-ids', (req, res) => {
  try {
    let tableData = extractTableData();  // Extract the entire table data

    // Filter out rows that have empty or null values for important fields
    tableData = tableData.filter(row => {
      return Object.values(row).some(value => {
        return value !== null && value !== undefined && (typeof value === 'string' ? value.trim() !== '' : true);
      });
    });

    // Optionally, filter out individual fields within rows that are empty or null
    tableData = tableData.map(row => {
      const filteredRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (value !== null && value !== undefined && (typeof value === 'string' ? value.trim() !== '' : true)) {
          filteredRow[key] = value;
        }
      }
      return filteredRow;
    });

    res.json({ tableData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
