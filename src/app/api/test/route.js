
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'ressources', 'Auditors qualifications WMABE 2024-2025.xlsx');

fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
        console.error('test File is not accessible:', err);
    } else {
        console.log('  test File is accessible');
        try {
            const workbook = XLSX.readFile(filePath);
            console.log('Workbook successfully read');
        } catch (error) {
            console.error('Error reading the workbook file:', error);
        }
    }
});
