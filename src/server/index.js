// index.js
const express = require('express');
const { extractAuditIds } = require('./extractAudit'); // Import the function from extractAuditIds.js

const app = express();
const port = process.env.SERVER_PORT || 3001; // Use environment variable for port

app.get('/api/audit-ids', (req, res) => {
  try {
    const auditIds = extractAuditIds();
      res.json({ auditIds });
      console.log(auditIds)
  } catch (error) {
    res.status(500).json({ error: error.message });
    }
    
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
   
    
});
