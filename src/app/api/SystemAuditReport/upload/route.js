import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the form data
    const data = await request.formData();
    const file = data.get('file');

    // Check if a file was uploaded
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type and size (optional)
    const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const maxSizeInBytes = 30 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      return NextResponse.json({ error: 'File size exceeds the limit of 30MB' }, { status: 400 });
    }

    // Define the file storage paths
    const dirPath = path.join(process.cwd(), 'ressources/System Audit Reports');
    const filePath = path.join(dirPath, `${Date.now()}-${file.name}`);

    // Create the directory if it doesn't exist
    await fs.promises.mkdir(dirPath, { recursive: true });

    // Write the file to disk
    await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // Return a success response
    return NextResponse.json({ message: `File "${file.name}" uploaded successfully!`, filePath }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    return NextResponse.json({ error: 'Error uploading file: ' + error.message }, { status: 500 });
  }
}
