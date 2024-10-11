import multer from 'multer';
//  /api/ressources/[auditID]/annoucement/route.js
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { auditID } = params;
  const filePath = path.join(process.cwd(), `ressources/Audit Annoucements/Audit Announcement VDA6.3 - P21 ${auditID}.doc`);

  try {
    // Asynchronously check if the file exists
    await fs.promises.access(filePath, fs.constants.R_OK);

    // Stream the file as a response
    return new Response(fs.createReadStream(filePath), {
      headers: {
        'Content-Disposition': `attachment; filename="Audit_Announcement_${auditID}.doc"`,
        'Content-Type': 'application/msword',
      },
    });
  } catch (error) {
    console.error('Error accessing file:', error.message);
    return new Response('File not found', { status: 404 });
  }
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { auditID } = req.params; // Get the auditID from the request parameters
    const dirPath = path.join(process.cwd(), 'ressources', 'Audit Annoucements');

    // Ensure the directory exists
    fs.promises.mkdir(dirPath, { recursive: true })
      .then(() => cb(null, dirPath))
      .catch(err => cb(err));
  },
  filename: function (req, file, cb) {
    const { auditID } = req.params; // Get the auditID from the request parameters
    const fileExtension = path.extname(file.originalname); // Preserve the original extension
    const filename = `Audit Announcement VDA6.3 - P21 ${auditID}${fileExtension}`; // New file name

    console.log("File will be saved as: ", filename); // Log the filename for debugging
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST method to handle file upload
export async function POST(request, { params }) {
  const uploadSingle = upload.single('file');

  return new Promise((resolve, reject) => {
    uploadSingle(request, null, (err) => {
      if (err instanceof multer.MulterError) {
        return reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      } else if (err) {
        return reject(new Response(JSON.stringify({ error: 'File upload failed.' }), { status: 500 }));
      }

      return resolve(new Response(JSON.stringify({ message: 'File uploaded successfully' }), { status: 200 }));
    });
  });
}