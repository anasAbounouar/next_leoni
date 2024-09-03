import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export async function GET(request, { params }) {
    const { id } = params; // Extract employee ID from URL parameters
    const filePath = path.join(process.cwd(), 'ressources', 'Auditors qualifications WMABE 2024-2025.xlsx');

    // Prepare the response headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (adjust as needed)
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow necessary methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allow necessary headers
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        // Check if the file is accessible
        await fs.promises.access(filePath, fs.constants.R_OK);

        // Read and parse the Excel file
        const fileBuffer = await fs.promises.readFile(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetName = 'WMABE'; // Ensure this matches your sheet name
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            return new Response(JSON.stringify({ error: `Sheet named '${sheetName}' not found.` }), {
                status: 404,
                headers
            });
        }

        // Convert sheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Find the row matching the employee ID
        const employeeData = data.slice(9).find(row => row[0] === parseInt(id, 10));

        if (employeeData) {
            const structuredData = employeeData.map((value, index) => ({
                index: index + 1,
                value: value || '',
            }));

            return new Response(JSON.stringify({ data: structuredData }), {
                status: 200,
                headers
            });
        } else {
            return new Response(JSON.stringify({ error: 'Employee not found' }), {
                status: 404,
                headers
            });
        }
    } catch (error) {
        console.error('Error processing request:', error.message);
        return new Response(JSON.stringify({ error: 'Error processing file: ' + error.message }), {
            status: 500,
            headers
        });
    }
}
