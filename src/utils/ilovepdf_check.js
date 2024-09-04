
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import minimist from 'minimist'; // Use import for minimist

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
    await task.start(); // Start the task

    await task.addFile(imageFilePath); // Add an image file (to check API points)
    await task.process(); // Try to process the file

    const pdfBuffer = await task.download(); // Attempt to download the resulting PDF

    console.log('API is working. Conversion successful.');
    process.stdout.write('::set-output name=apiStatus::true\n');
    process.exit(0); // Exit with code 0 to indicate success
  } catch (error) {
    console.error('Error during API conversion or no points left:', error.message);
    process.stdout.write('::set-output name=apiStatus::false\n');
    process.exit(1); // Exit with code 1 to indicate failure
  }
}

(async () => {
  if (args['check-api']) {
    const imagePath = 'public/next.svg'; // Default image path for testing conversion
    await checkAPIStatusWithConversion(imagePath);
  } else {
    console.error('No valid arguments provided.');
    process.exit(1);
  }
})();
