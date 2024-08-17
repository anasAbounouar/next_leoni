// server/index.js
const express = require('express');
const cors = require('cors');
const { extractAuditIds } = require('./extractAudit');

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors()); // Add this line to enable CORS

app.get('/api/audit-ids', (req, res) => {
  try {
    const auditIds = extractAuditIds();
    res.json({ auditIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
