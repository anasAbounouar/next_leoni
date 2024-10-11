// app/api/audit-ids/route.js

import fs from "fs/promises"; // Use fs.promises for async file operations
import path from "path";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "ressources",
    "VA3011en5 Internal audit schedule 2023-2024.xls"
  );
  console.log("Resolved file path:", filePath);

  try {
    // Check if the file is accessible
    await fs.access(filePath);
    console.log("File is accessible");

    // Read the file buffer asynchronously
    const fileBuffer = await fs.readFile(filePath);
    console.log("File buffer size:", fileBuffer.length); // Log the buffer size

    // Parse the workbook from the buffer
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    console.log("Workbook successfully read");

    const sheetName = "Planning audit 2023"; // Ensure this matches your sheet name
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      console.error(`Error: Sheet named '${sheetName}' not found.`);
      return NextResponse.json(
        { error: `Sheet named '${sheetName}' not found.` },
        { status: 404 }
      );
    }

    // Convert sheet to JSON
    console.log("Converting sheet to JSON...");
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log("Data:", data.slice(0, 5)); // Log the first few rows of data

    // Process the header row and table data
    const headerRowIndex = 5; // Adjust based on your Excel sheet's structure
    const headers = data[headerRowIndex] || [];

    // Define the month fields
    const monthFields = [
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
    ];

    // Trim headers to remove any accidental whitespace
    const trimmedHeaders = headers.map((header) =>
      typeof header === "string" ? header.trim() : header
    );

    // Log trimmed headers for debugging
    console.log("Trimmed Headers:", trimmedHeaders);

    const tableData = data
      .slice(headerRowIndex + 1)
      .map((row, index) => {
        const rowObject = {};
        trimmedHeaders.forEach((header, colIndex) => {
          rowObject[header] = row[colIndex] !== undefined ? String(row[colIndex]).trim() : "";
        });
        return { rowObject, rowIndex: index + headerRowIndex + 1 }; // Include rowIndex for logging
      })
      .filter(({ rowObject, rowIndex }) => {
        const auditId = rowObject["Audit ID"];
        const auditIdExists = auditId && auditId !== "";

        // Check if at least one month field is non-empty
        const hasAtLeastOneMonth = monthFields.some(
          (month) => rowObject[month] && rowObject[month] !== ""
        );

        // Log each row's auditId and month status for debugging
        console.log(
          `Row ${rowIndex}: Audit ID exists? ${auditIdExists}, Has at least one month? ${hasAtLeastOneMonth}`
        );

        return auditIdExists && hasAtLeastOneMonth;
      })
      .map(({ rowObject }) => rowObject); // After filtering, return only the rowObject

    // Log the number of filtered rows
    console.log(`Total filtered rows: ${tableData.length}`);

    // Return the response with the JSON data
    return NextResponse.json({ tableData }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error.message);
    return NextResponse.json(
      { error: "Error processing file: " + error.message },
      { status: 500 }
    );
  }
}
