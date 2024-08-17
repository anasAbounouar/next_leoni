// // utils/excelUtils.js
// import * as XLSX from 'xlsx';

// export const extractAuditIds = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const json = XLSX.utils.sheet_to_json(worksheet);
      
//       // Extract 'Audit ID' column
//       const auditIds = json.map(row => row['Audit ID']).filter(id => id);
//       resolve(auditIds);
//     };

//     reader.onerror = (error) => reject(error);
//     reader.readAsArrayBuffer(file);
//   });
// };
