// utils/processSwotData.js

// Function to process SWOT data from Excel sheet
const processSwotData = (data) => {
    const swotSections = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];
    const swotData = {};
  
    let currentSection = null;
  
    data.forEach(row => {
      const [ , ...cells] = row;
  
      if (cells[0] && swotSections.includes(cells[0])) {
        currentSection = cells[0];
        swotData[currentSection] = [];
      } else if (currentSection) {
        swotData[currentSection].push(cells);
      }
    });
  
    return swotData;
  };
  
  module.exports = {
    processSwotData
  };
  