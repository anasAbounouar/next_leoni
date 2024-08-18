'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react'; // Importing Button for better UI

export default function AuditSearch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditIds, setAuditIds] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [selectedAuditData, setSelectedAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null); // New state to track active section
  const [swotData, setSwotData] = useState([]); // New state for SWOT data

  // Fetch audit IDs and data from the backend
  useEffect(() => {
    const fetchAuditData = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        const response = await fetch('http://localhost:3001/api/audit-ids');
        if (!response.ok) {
          throw new Error('Failed to fetch audit data');
        }
        const data = await response.json();
        const options = data.tableData
          .filter(item => item["Audit ID"])
          .map(item => ({ value: item["Audit ID"], label: item["Audit ID"] }));
        
        setAuditIds(options);
        setAuditData(data.tableData); // Store all audit data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  // Handle selection change
  const handleSelectionChange = (option) => {
    setSelectedOption(option);
    if (option) {
      // Find and set the data for the selected audit ID
      const selectedAudit = auditData.find(item => item["Audit ID"] === option.value);
      setSelectedAuditData(selectedAudit || {});
      setActiveSection(null); // Reset active section when selection changes
    } else {
      setSelectedAuditData(null);
      setActiveSection(null);
    }
  };

  // Handle button click to set active section and fetch SWOT data
  const handleButtonClick = async (section) => {
    setActiveSection(section);
    if (section === 'Swot' && selectedOption) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/ressources/${selectedOption.value}/SWOT`);
        if (!response.ok) {
          throw new Error('Failed to fetch SWOT data');
        }
        const data = await response.json();
        console.log('Fetched SWOT data:', data); // Log the data to verify structure
        setSwotData(data.content || []); // Set the raw sheet data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Determine button styles
  const buttonClasses = (section) => {
    const baseClasses = "mr-2 mb-2 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
    const activeClasses = "bg-blue-700";
    const defaultClasses = "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white";

    if (activeSection === section) {
      return `${baseClasses} ${activeClasses}`;
    }

    return `${baseClasses} ${defaultClasses}`;
  };

  // Render table for SWOT data
  const renderTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;
  
    const swotSections = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];
    const sectionColors = {
      Strengths: 'text-green-600',
      Weaknesses: 'text-red-600',
      Opportunities: 'text-blue-600',
      Threats: 'text-orange-600',
    };
    
  
    // Filter out empty cells and update column headers accordingly
    const filteredData = data.map(row => row.filter(cell => cell !== null && cell.trim() !== ''));
    
    // Determine the maximum number of columns
    const numColumns = Math.max(...filteredData.map(row => row.length));
  
    return (
      <div className="overflow-y-auto  bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-0 ">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-lg">
         
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => {
              const isSwotSection = row[1] && swotSections.includes(row[1]);
  
              return (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-blue-100 transition-colors duration-200`}
                >
                  {row.map((cell, cellIndex) => {
                    let cellStyle = `px-1 py-1 text-sm text-gray-700 whitespace-nowrap border-b border-gray-300`;
  
                    // Apply special styling based on the cell content
                    if (cell === 'SWOT Analyses for: LEONI Wiring Systems WMABE') {
                      cellStyle += ' font-bold !text-xl text-center'; // Bold, larger, and centered
                    } else if (cell === 'Internal System Audit: WSD S01-23-75') {
                      cellStyle += ' font-bold text-md text-center !text-lg'; // Bold, slightly less large, and centered
                    }
  
                    return (
                      <td
                        key={cellIndex}
                        className={`${cellStyle} px-6 ${isSwotSection ? 'font-bold' : ''} ${
                          sectionColors[cell] || ''
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  

  return (
    <div className="p-6 bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-6">
      {loading && <p className="text-gray-500">Chargement...</p>}
      
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && auditIds.length > 0 ? (
        <div className="mb-4">
          <Select
            options={auditIds}
            value={selectedOption}
            onChange={handleSelectionChange}
            placeholder="Sélectionnez un ID d'Audit"
            className="mb-4"
          />
          {selectedOption && selectedAuditData && (
            <div>
              <div className="mb-4 flex flex-wrap justify-between">
                <Button
                  auto
                  onClick={() => handleButtonClick('AuditResult')}
                  className={buttonClasses('AuditResult')}
                >
                  Audit Result
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('Swot')}
                  className={buttonClasses('Swot')}
                >
                  Swot
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('CorrectiveActions')}
                  className={buttonClasses('CorrectiveActions')}
                >
                  Date for Corrective Actions
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('VA3011')}
                  className={buttonClasses('VA3011')}
                >
                  VA3011 ENCL .1
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('AuditAnnouncement')}
                  className={buttonClasses('AuditAnnouncement')}
                >
                  Audit Announcement
                </Button>
              </div>
              {/* Render SWOT table if 'Swot' section is active */}
              {activeSection === 'Swot' && (
                <div>
                  {renderTable(swotData)}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        !loading && <Button color="primary" isLoading>Chargement des ID d&apos;Audit...</Button>
      )}
    </div>
  );
}
