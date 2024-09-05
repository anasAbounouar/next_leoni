import fs from 'fs';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js';
import minimist from 'minimist';
import path from 'path';

const args = minimist(process.argv.slice(2));

const publicKey = "project_public_ad5f92aa89ba7edaa84be1e4652f2afd_Csbn2a9b833de935530a565ce276d04411547";
const secretKey = "secret_key_f0bbddb93f13fd5cbf5c94ddded59592_F3oAqe22b73cee70dc1c7c59f87ce63dc3d28";
// const publicKey = args['publicKey'];
// const secretKey = args['secretKey'];

if (!publicKey || !secretKey) {
  console.error('Missing API keys. Please provide both publicKey and secretKey.');
  process.exit(1);
}

const ilovePDFInstance = new ILovePDFApi(publicKey, secretKey);

async function checkAPIStatusWithConversion(imageFilePath) {
  try {
    const task = ilovePDFInstance.newTask('imagepdf');
    await task.start();

    const file = new ILovePDFFile(imageFilePath);
    await task.addFile(file);

    await task.process();
      const pdfBuffer = await task.download();
      

    console.log('API is working. Conversion successful.');
    process.exit(0);
  } catch (error) {
    console.error('Error during API conversion or no points left:', error.message);

    process.exit(1);
  }
}

(async () => {
    if (args['check-api']) {
       // Resolve the path relative to the current working directory
    const imagePath = path.join(process.cwd(), '../../public/images', 'bg-leoni.jpg');
  // Check if the file exists before processing
        if (fs.existsSync(imagePath)) {
            console.log('Attempting to convert file at:', imagePath);

    await checkAPIStatusWithConversion(imagePath);
  } else {
    console.error(`File not found: ${imagePath}`);
    process.exit(1);
  }

   
  } else {
    
    console.error('No valid arguments provided.');
    process.exit(1);
  }
})();
