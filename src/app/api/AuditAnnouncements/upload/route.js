import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type and size if necessary (optional)
        // Example: if (file.size > MAX_FILE_SIZE) { ... }

        const dirPath = path.join(process.cwd(), 'ressources', 'Audit Announcements');
        const filePath = path.join(dirPath, `${Date.now()}-${file.name}`);

        // Ensure directory exists
        await fs.promises.mkdir(dirPath, { recursive: true });

        // Write the file
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, fileBuffer);

        return NextResponse.json({ message: `File "${file.name}" uploaded successfully!`, filePath }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error.message);
        return NextResponse.json({ error: 'Error uploading file: ' + error.message }, { status: 500 });
    }
}
