const express = require('express');
require('dotenv').config();
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');

// Load environment variables for the API keys
const { ILOVE_PDF_PUBLIC_KEY, ILOVE_PDF_SECRET_KEY } = process.env;

// Initialize the ILovePDF API instance
const ilovePDFInstance = new ILovePDFApi(ILOVE_PDF_PUBLIC_KEY, ILOVE_PDF_SECRET_KEY);

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors());

// Route to serve a DOC or DOCX file
app.get('/api/ressources/:auditID/announcement', (req, res) => {
    const { auditID } = req.params;
    const filePath = path.join(__dirname, `../../ressources/Audit Announcement VDA6.3 - P21 ${auditID}.doc`);

    console.log('Serving file:', filePath); // Log the file path

    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error retrieving the document');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
});

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

// General route to fetch data for a specific audit ID and sheet
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

        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        res.json({ content: data });
    } catch (error) {
        console.error('Error fetching sheet data:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Function to convert Excel to PDF using ILovePDF API
async function convertExcelToPDFILovePDF(excelFilePath) {
    try {
        // Create a task for conversion
        const task = ilovePDFInstance.newTask('officepdf');

        // Start the task
        await task.start();

        // Add file to task
        const file = new ILovePDFFile(excelFilePath);
        await task.addFile(file);

        // Process the task
        await task.process();

        // Download the resulting PDF
        const pdfBuffer = await task.download();

        // Save the PDF to a file
        const outputFilePath = path.join(__dirname, `../../ressources/${path.basename(excelFilePath, '.xlsx')}.pdf`);
        fs.writeFileSync(outputFilePath, pdfBuffer);

        return outputFilePath;
    } catch (error) {
        console.error('Error during Excel to PDF conversion:', error.message);
        throw error;
    }
}

// Route to convert Excel to PDF using ILovePDF API
app.get('/api/convert/:auditID/:sheetName/pdf', async (req, res) => {
    const { auditID, sheetName } = req.params;

    try {
        const excelFilePath = path.join(__dirname, `../../ressources/${auditID} WMABE.xlsx`);

        // Check if the file exists
        if (!fs.existsSync(excelFilePath)) {
            return res.status(404).send('Excel file not found');
        }

        // Convert Excel to PDF
        const pdfFilePath = await convertExcelToPDFILovePDF(excelFilePath);

        // Serve the PDF file
        res.download(pdfFilePath, `${auditID}-${sheetName}.pdf`, (err) => {
            if (err) {
                console.error('Error sending PDF file:', err);
                res.status(500).send('Error retrieving the PDF');
            } else {
                // Optionally clean up the PDF file after serving
                fs.unlink(pdfFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting PDF file:', unlinkErr);
                });
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
