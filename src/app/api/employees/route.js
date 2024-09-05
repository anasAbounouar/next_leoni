import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export function GET(req, res) {

    // Prepare the response headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (adjust as needed)
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow the necessary methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allow the necessary headers
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    const filePath = path.join(process.cwd(), 'ressources', 'Auditors qualifications WMABE 2024-2025.xlsx');
    console.log('Resolved file path:', filePath);

    try {
        // Check if the file is accessible synchronously
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log('File is accessible');

        // Read the file buffer synchronously
        const fileBuffer = fs.readFileSync(filePath);
        console.log('File buffer size:', fileBuffer.length); // Log the buffer size

        // Parse the workbook from the buffer
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        console.log('Workbook successfully read');

        const sheetName = 'WMABE'; // Ensure this matches your sheet name
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            console.error(`Error: Sheet named '${sheetName}' not found.`);
            return res.status(404).json({ error: `Sheet named '${sheetName}' not found.` });
        }

        // Convert sheet to JSON
        console.log('Converting sheet to JSON...');
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Data:', data.slice(0, 5)); // Log the first few rows of data

        // Process and filter data
        const employeeList = data.slice(9).map(row => ({
            id: row[0], // Assuming 'No.' is in the first column
            firstName: row[1]?.trim(), // Assuming 'First Name' is in the second column
            lastName: row[2]?.trim(), // Assuming 'Last Name' is in the third column
            jobTitle: row[3]?.trim() // Assuming 'Actual job title / position / function' is in the fourth column
        })).filter(employee => employee.id && employee.firstName && employee.lastName && employee.jobTitle);

        // res.status(200).json(employeeList);
        return new Response(JSON.stringify(employeeList ), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
    } catch (error) {
        console.error('Error fetching employee list:', error.message);
        res.status(500).json({ error: 'Error processing file: ' + error.message });
    }
}
