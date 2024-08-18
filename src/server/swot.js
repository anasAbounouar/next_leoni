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

  // Handle button click to set active section
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
    if (!Array.isArray(data) || data.length === 0) {
      return <p className="text-gray-500">No data available</p>;
    }

    return (
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {data[0].map((_, index) => (
              <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">{`Column ${index + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-sm text-gray-600 border-b">{cell !== null ? cell : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 bg-gray-50 text-gray-800 rounded-lg shadow-md my-10 mx-6">
      {loading && <p>Chargement...</p>}
      
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
              {/* Render table if 'Swot' section is active */}
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
