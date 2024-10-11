import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup for file storage using multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dirPath = path.join(process.cwd(), 'ressources', 'Audit Announcements');
      fs.promises.mkdir(dirPath, { recursive: true }).then(() => cb(null, dirPath));
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const baseName = req.body.fileName || path.basename(file.originalname, fileExt);
      const fileName = `${baseName}${fileExt}`;
      cb(null, fileName);
    },
  }),
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    const uploader = upload.single('file');
    uploader(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'Unknown error occurred while uploading.' });
      }
      // File uploaded successfully
      res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
