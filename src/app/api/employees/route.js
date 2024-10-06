// /app/api/employees/route.js

import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * Helper function to get the Excel file path
 */
const getFilePath = () => {
    return path.join(process.cwd(), 'ressources', 'Auditors qualifications WMABE 2024-2025.xlsx');
};

/**
 * Helper function to read data from the Excel file
 */
const readExcelData = async () => {
    const filePath = getFilePath();
    try {
        // Check if the file is accessible (read-only for GET)
        await fs.promises.access(filePath, fs.constants.R_OK);

        // Read and parse the Excel file
        const fileBuffer = await fs.promises.readFile(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetName = 'WMABE'; // Ensure this matches your sheet name
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(`Sheet named '${sheetName}' not found.`);
        }

        // Convert sheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Assuming that the first 9 rows are headers or irrelevant data
        const employeeRows = data.slice(9);

        // Map each row to an employee object, ensuring data integrity
        const employees = employeeRows.map(row => {
            const [id, lastName, firstName, jobTitle, homePlant, ...rest] = row;
            return {
                id: typeof id === 'number' ? id : null, // Ensure ID is a number
                lastName: typeof lastName === 'string' ? lastName.trim() : '',
                firstName: typeof firstName === 'string' ? firstName.trim() : '',
                jobTitle: typeof jobTitle === 'string' ? jobTitle.trim() : '',
                homePlant: typeof homePlant === 'string' ? homePlant.trim() : '',
                // Add other fields as necessary
            };
        });

        // Filter out any malformed entries
        const validEmployees = employees.filter(emp => 
            emp.id !== null && 
            emp.lastName && 
            emp.firstName && 
            emp.jobTitle && 
            emp.homePlant
        );

        return validEmployees;
    } catch (error) {
        throw error;
    }
}

/**
 * GET handler to fetch all employees
 */
export async function GET(request) {
    // Prepare the response headers
    const responseHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (adjust as needed)
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS', // Allow necessary methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allow necessary headers
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: responseHeaders });
    }

    try {
        const employees = await readExcelData();
        return new Response(JSON.stringify(employees), {
            status: 200,
            headers: responseHeaders
        });
    } catch (error) {
        console.error('Error processing GET /api/employees request:', error.message);
        return new Response(JSON.stringify({ error: 'Error processing file: ' + error.message }), {
            status: 500,
            headers: responseHeaders
        });
    }
}
