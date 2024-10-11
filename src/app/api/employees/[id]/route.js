// /app/api/employees/[id]/route.js

import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * Helper function to get the Excel file path
 */
const getFilePath = () => {
    const filePath = path.resolve(process.cwd(), 'ressources', 'Auditors qualifications WMABE 2024-2025.xlsx');
    console.log('Resolved File Path:', filePath);
    return filePath;
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
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * DELETE handler to remove an employee
 */
export async function DELETE(request, { params }) {
    const { id } = params;
    const filePath = getFilePath();

    // Prepare the response headers
    const responseHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: responseHeaders });
    }

    try {
        console.log('Excel file path:', filePath);
        await fs.promises.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
        console.log('Excel file is accessible.');

        const data = await readExcelData();
        console.log('Converted Excel Data for DELETE:', data);

        // Find the row index matching the employee ID
        const employeeRowIndex = data.slice(9).findIndex((row) => row[0] === parseInt(id, 10));
        if (employeeRowIndex === -1) {
            return new Response(JSON.stringify({ error: 'Employee not found' }), {
                status: 404,
                headers: responseHeaders,
            });
        }
        const actualRowIndex = employeeRowIndex + 9;

        // Remove the employee row
        data.splice(actualRowIndex, 1);
        console.log('Data after deletion:', data);

        // Convert data back to worksheet
        const newWorksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.read(await fs.promises.readFile(filePath), { type: 'buffer' });
        workbook.Sheets['WMABE'] = newWorksheet;

        // Write the workbook back to the file
        XLSX.writeFile(workbook, filePath);
        console.log('Workbook written successfully to', filePath);

        return new Response(JSON.stringify({ message: 'Employee deleted successfully' }), {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Error processing DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Error deleting employee: ' + error.message }), {
            status: 500,
            headers: responseHeaders,
        });
    }
}

/**
 * GET handler to fetch individual employee data
 */
export async function GET(request, { params }) {
    const { id } = params;
    const filePath = getFilePath();

    // Prepare the response headers
    const responseHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: responseHeaders });
    }

    try {
        const data = await readExcelData();
        console.log('Converted Excel Data:', data);

        // Find the row index matching the employee ID
        const employeeRowIndex = data.slice(9).findIndex((row) => row[0] === parseInt(id, 10));
        if (employeeRowIndex === -1) {
            return new Response(JSON.stringify({ error: 'Employee not found' }), {
                status: 404,
                headers: responseHeaders,
            });
        }
        const actualRowIndex = employeeRowIndex + 9;

        const employeeData = data[actualRowIndex].map((value, index) => ({
            index: index + 1,
            value: value || '',
        }));

        return new Response(JSON.stringify({ data: employeeData }), {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Error processing GET request:', error);
        return new Response(JSON.stringify({ error: 'Error fetching employee: ' + error.message }), {
            status: 500,
            headers: responseHeaders,
        });
    }
}

/**
 * PUT handler to update an employee's data
 */
export async function PUT(request, { params }) {
    const { id } = params;
    const filePath = getFilePath();

    // Prepare the response headers
    const responseHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: responseHeaders });
    }

    try {
        // Parse the request body
        const body = await request.json();
        console.log('Received PUT request with body:', body);

        // Validate the request body
        if (typeof body !== 'object' || Array.isArray(body)) {
            throw new Error('Invalid data format: Expected an object with column indices as keys.');
        }

        console.log('Checking file accessibility...');
        await fs.promises.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
        console.log('Excel file is accessible.');

        const data = await readExcelData();
        console.log('Converted Excel Data for PUT:', data);

        // Find the row index matching the employee ID
        const employeeRowIndex = data.slice(9).findIndex((row) => row[0] === parseInt(id, 10));
        if (employeeRowIndex === -1) {
            throw new Error('Employee not found');
        }
        const actualRowIndex = employeeRowIndex + 9;
        console.log(`Employee found at row index: ${actualRowIndex}`);

        // Update the row with new data
        for (const [col, value] of Object.entries(body)) {
            const colIndex = parseInt(col, 10) - 1; // Adjust for zero-based index
            if (isNaN(colIndex) || colIndex < 0 || colIndex >= data[actualRowIndex].length) {
                console.warn(`Invalid column index: ${col}. Skipping update for this column.`);
                continue;
            }
            console.log(`Updating column ${colIndex + 1} with value: ${value}`);
            data[actualRowIndex][colIndex] = value;
        }
        console.log('Data after update:', data[actualRowIndex]);

        // Convert data back to worksheet
        const newWorksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.read(await fs.promises.readFile(filePath), { type: 'buffer' });
        workbook.Sheets['WMABE'] = newWorksheet;

        // Write the workbook back to the file
        XLSX.writeFile(workbook, filePath);
        console.log('Workbook written successfully to', filePath);

        return new Response(JSON.stringify({ message: 'Employee updated successfully' }), {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Error processing PUT request:', error.message);
        return new Response(JSON.stringify({ error: 'Error updating employee: ' + error.message }), {
            status: 500,
            headers: responseHeaders,
        });
    }
}
