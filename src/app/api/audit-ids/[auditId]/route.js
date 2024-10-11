// app/api/audit-ids/[auditId]/route.js

import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

// Define the sheet name and file path
const SHEET_NAME = "Planning audit 2023"; // Update if your sheet name is different
const FILE_PATH = path.join(
  process.cwd(),
  "ressources",
  "VA3011en5 Internal audit schedule 2023-2024.xls"
);

// Helper function to read the Excel file and return its data
const readExcelFile = async () => {
  try {
    // Check if the file exists and is accessible
    await fs.access(FILE_PATH);

    // Read the file buffer asynchronously
    const fileBuffer = await fs.readFile(FILE_PATH);

    // Parse the workbook from the buffer
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Get the specific worksheet
    const worksheet = workbook.Sheets[SHEET_NAME];

    if (!worksheet) {
      throw new Error(`Sheet named '${SHEET_NAME}' not found.`);
    }

    // Convert sheet to JSON with header rows
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    return { workbook, data };
  } catch (error) {
    throw new Error(`Error reading Excel file: ${error.message}`);
  }
};

// Helper function to write data back to the Excel file
const writeExcelFile = async (workbook) => {
  try {
    const updatedBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xls" });
    await fs.writeFile(FILE_PATH, updatedBuffer);
  } catch (error) {
    throw new Error(`Error writing to Excel file: ${error.message}`);
  }
};

// Handler for PUT requests (Update Audit)
export async function PUT(request, { params }) {
  const { auditId } = params;

  try {
    const { workbook, data } = await readExcelFile();

    // Identify the header row index
    const headerRowIndex = 5; // Adjust based on your Excel sheet's structure
    const headers = data[headerRowIndex] || [];

    // Find the row index with the matching Audit ID
    let targetRowIndex = -1;
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      if (row[headers.indexOf("Audit ID")] === auditId) {
        targetRowIndex = i;
        break;
      }
    }

    if (targetRowIndex === -1) {
      return NextResponse.json(
        { message: `Audit ID '${auditId}' not found.` },
        { status: 404 }
      );
    }

    // Parse the incoming JSON data
    const updatedAudit = await request.json();

    // Check if Audit ID is being updated
    const updatedAuditId = updatedAudit["Audit ID"];
    if (updatedAuditId && updatedAuditId !== auditId) {
      // Check for uniqueness of the new Audit ID
      const isDuplicate = data.slice(headerRowIndex + 1).some((row) => row[headers.indexOf("Audit ID")] === updatedAuditId);
      if (isDuplicate) {
        return NextResponse.json(
          { message: `Audit ID '${updatedAuditId}' already exists. Please use a unique Audit ID.` },
          { status: 400 }
        );
      }
    }

    // Update the specific row with new data
    headers.forEach((header, index) => {
      if (updatedAudit[header] !== undefined) {
        data[targetRowIndex][index] = updatedAudit[header];
      }
    });

    // Convert JSON back to worksheet
    const updatedWorksheet = XLSX.utils.aoa_to_sheet(data);

    // Update the workbook with the modified worksheet
    workbook.Sheets[SHEET_NAME] = updatedWorksheet;

    // Write the updated workbook back to the file
    await writeExcelFile(workbook);

    return NextResponse.json(
      { message: "Audit updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/audit-ids/[auditId] Error:", error.message);
    return NextResponse.json(
      { message: `Failed to update audit: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handler for DELETE requests (Delete Audit)
export async function DELETE(request, { params }) {
  const { auditId } = params;

  try {
    const { workbook, data } = await readExcelFile();

    // Identify the header row index
    const headerRowIndex = 5; // Adjust based on your Excel sheet's structure
    const headers = data[headerRowIndex] || [];

    // Find the row index with the matching Audit ID
    let targetRowIndex = -1;
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      if (row[headers.indexOf("Audit ID")] === auditId) {
        targetRowIndex = i;
        break;
      }
    }

    if (targetRowIndex === -1) {
      return NextResponse.json(
        { message: `Audit ID '${auditId}' not found.` },
        { status: 404 }
      );
    }

    // Remove the target row
    data.splice(targetRowIndex, 1);

    // Convert JSON back to worksheet
    const updatedWorksheet = XLSX.utils.aoa_to_sheet(data);

    // Update the workbook with the modified worksheet
    workbook.Sheets[SHEET_NAME] = updatedWorksheet;

    // Write the updated workbook back to the file
    await writeExcelFile(workbook);

    return NextResponse.json(
      { message: "Audit deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/audit-ids/[auditId] Error:", error.message);
    return NextResponse.json(
      { message: `Failed to delete audit: ${error.message}` },
      { status: 500 }
    );
  }
}
