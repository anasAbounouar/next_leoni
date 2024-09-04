import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { auditID } = params;
  const filePath = path.join(process.cwd(), `ressources/audit-finalise/${auditID} WMABE.xlsx`);

  try {
    // Asynchronously check if the file exists
    await fs.promises.access(filePath, fs.constants.R_OK);

    // Stream the file as a response
    return new Response(fs.createReadStream(filePath), {
      headers: {
        'Content-Disposition': `attachment; filename="${auditID}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error accessing file:', error.message);
    return new Response('File not found', { status: 404 });
  }
}
