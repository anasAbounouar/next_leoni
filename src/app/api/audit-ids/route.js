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

    const tableData = data
      .slice(headerRowIndex + 1)
      .map((row) => {
        const rowObject = {};
        headers.forEach((header, index) => {
          rowObject[header] = row[index] || "";
        });
        return rowObject;
      })
      .filter(
        (row) =>
          row["Site / BU / Department"] &&
          row["Site / BU / Department"] !== ""
      );

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
