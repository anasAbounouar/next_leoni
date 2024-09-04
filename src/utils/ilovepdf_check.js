import fs from 'fs';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

const publicKey = args['publicKey'];
const secretKey = args['secretKey'];

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
    fs.appendFileSync(process.env.GITHUB_ENV, `apiStatus=true\n`);
    process.exit(0);
  } catch (error) {
    console.error('Error during API conversion or no points left:', error.message);
    fs.appendFileSync(process.env.GITHUB_ENV, `apiStatus=false\n`);
    process.exit(1);
  }
}

(async () => {
  if (args['check-api']) {
    const imagePath = 'public/next.svg';
    await checkAPIStatusWithConversion(imagePath);
  } else {
    console.error('No valid arguments provided.');
    process.exit(1);
  }
})();
