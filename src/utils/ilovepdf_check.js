// utils/ilovepdf_ckeck.js
const { ILovePDFApi } = require('@ilovepdf/ilovepdf-nodejs');

const ilovePDFInstance = new ILovePDFApi(process.env.ILOVE_PDF_PUBLIC_KEY, process.env.ILOVE_PDF_SECRET_KEY);

async function checkAPIStatus() {
  try {
    const response = await ilovePDFInstance.auth();
    if (response.status === 200) {
      console.log('iLovePDF API is operational.');
    } else {
      console.error('API is down or invalid credentials. Status code:', response.status);
    }
  } catch (error) {
    console.error('Error checking API status:', error.message);
  }
}

async function convertImageToPDF(imageFilePath) {
  try {
    const task = ilovePDFInstance.newTask('imagepdf');
    await task.start();
    const file = await task.addFile(imageFilePath);
    await task.process();
    const pdfBuffer = await task.download();
    return true; // Conversion successful
  } catch (error) {
    console.error('Error converting image to PDF:', error.message);
    return false; // Conversion failed
  }
}

module.exports = {
  checkAPIStatus,
  convertImageToPDF,
};