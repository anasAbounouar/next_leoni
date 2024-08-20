const express = require('express');
require('dotenv').config();
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const { CloseFullscreen } = require('@mui/icons-material');

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
// Route to download the Excel file directly
app.get('/api/ressources/:auditID/download', (req, res) => {
    const { auditID } = req.params;
    const filePath = path.join(__dirname, `../../ressources/${auditID} WMABE.xlsx`);

    console.log('Serving file for download:', filePath); // Log the file path

    if (fs.existsSync(filePath)) {
        res.download(filePath, `${auditID}.xlsx`, (err) => { // Serve the file for download
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
        const sheetName = 'Planning audit 2023'; // Ensure this matches your sheet name
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(`Sheet named '${sheetName}' not found.`);
        }

        // Convert sheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headerRowIndex = 5; // Adjust based on your sheet
        const headers = data[headerRowIndex];

        const tableData = data.slice(headerRowIndex + 1).map(row => {
            const rowObject = {};
            headers.forEach((header, index) => {
                rowObject[header] = row[index] || ''; // Default to empty string if no value
            });
            return rowObject;
        }).filter(row => row['Site / BU / Department'] && row['Site / BU / Department'] !== ''); // Filter out rows without a valid "Site / BU / Department"

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

app.get('/api/employee/:number', (req, res) => {
    const { number } = req.params;
    const filePath = path.join(__dirname, '../../ressources/Auditors qualifications WMABE 2024-2025.xlsx');

    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = 'WMABE'; // Replace with the actual sheet name if different
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Find the employee data based on the 'No.' column (which is in index 0)
        const employeeData = data.slice(9).find(row => row[0] === parseInt(number)); // Adjusting for 0-based index

        if (employeeData) {
            // Structure the response to only include the data for the specific employee number
            const structuredData = employeeData.map((value, index) => {
                return {
                    index: index + 1, // Starting index from 1 for better readability
                    value: value || ''
                };
            });

            res.json({ data: structuredData });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee data:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/employees', (req, res) => {
    const filePath = path.join(__dirname, '../../ressources/Auditors qualifications WMABE 2024-2025.xlsx');

    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = 'WMABE'; // Replace with the actual sheet name if different
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Assuming row[3] corresponds to 'Actual job title / position / function'
        // Also assuming that row[0] = 'No.', row[1] = 'First Name', row[2] = 'Last Name', and row[3] = 'Job Title'
        const employeeList = data.slice(9).map(row => {
            return {
                id: row[0], // Assuming 'No.' is in the first column
                firstName: row[1] && row[1].trim(), // Assuming 'First Name' is in the second column
                lastName: row[2] && row[2].trim(), // Assuming 'Last Name' is in the third column
                jobTitle: row[3] && row[3].trim() // Assuming 'Actual job title / position / function' is in the fourth column
            };
        }).filter(employee => employee.id && employee.firstName && employee.lastName && employee.jobTitle); // Filtering out rows without complete data

        res.json(employeeList);
    } catch (error) {
        console.error('Error fetching employee list:', error.message);
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/add-employee', (req, res) => {
    const filePath = path.join(__dirname, '../../ressources/Auditors qualifications WMABE 2024-2025.xlsx');
    const newEmployee = req.body;

    try {
        // Read the existing Excel file
        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found at ${filePath}`);
        }

        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets['WMABE']; // Adjust the sheet name if needed

        if (!worksheet) {
            throw new Error(`Sheet 'WMABE' not found in the Excel file.`);
        }

        // Convert the worksheet to JSON to get current data
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = require('../app/services/employeesList/headers');

        // Log the headers and new employee data
        console.log("Headers from headers.js:", headers);
        console.log("New Employee Data:", newEmployee);

        // Prepare the new employee data row
        const newRow = headers.map(header => newEmployee[header.column] || '');

        console.log("New Row to be added:", newRow);

        // Validate newRow before adding to ensure no issues in data structure
        if (!Array.isArray(newRow) || newRow.length !== headers.length) {
            throw new Error("New row data structure is invalid.");
        }

        // Append the new row to the existing data
        sheetData.push(newRow);

        // Convert the updated JSON back to the worksheet
        const newWorksheet = XLSX.utils.aoa_to_sheet(sheetData);
        workbook.Sheets['WMABE'] = newWorksheet;

        // Write the updated workbook back to the file
        XLSX.writeFile(workbook, filePath);

        res.status(200).json({ message: 'Employee added successfully!' });
    } catch (error) {
        console.error('Error updating Excel file:', error.message);
        res.status(500).json({ error: `There was an error updating the Excel file: ${error.message}` });
    }
});














app.get('/api/download/excel', (req, res) => {
   
    const filePath = path.join(__dirname, '../../ressources/Auditors qualifications WMABE 2024-2025.xlsx');
  
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'Auditors_qualifications_WMABE_2024-2025.xlsx');
    } else {
        console.log("File not found");
        res.status(404).send('File not found');
    }
});




// Function to convert Excel to PDF using ILovePDF API (in memory)
async function convertExcelToPDFInMemory(excelFilePath) {
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

        // Download the resulting PDF as a buffer
        const pdfBuffer = await task.download();

        return pdfBuffer;
    } catch (error) {
        console.error('Error during Excel to PDF conversion:', error.message);
        throw error;
    }
}

// Route to convert Excel to PDF and send it directly to the client
app.get('/api/convert/:auditID/pdf', async (req, res) => {
    const { auditID } = req.params;

    try {
        const excelFilePath = path.join(__dirname, `../../ressources/${auditID} WMABE.xlsx`);

        // Check if the Excel file exists
        if (!fs.existsSync(excelFilePath)) {
            return res.status(404).send('Excel file not found');
        }

        // Convert Excel to PDF and get it as a buffer
        const pdfBuffer = await convertExcelToPDFInMemory(excelFilePath);

        // Set the response headers to indicate a file download
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${auditID}.pdf"`,
        });

        // Send the PDF buffer directly to the client
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating or retrieving PDF:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Serve the application
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
