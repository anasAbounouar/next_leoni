'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react';


export default function AuditSearch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditIds, setAuditIds] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [selectedAuditData, setSelectedAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [correctiveActionsData, setCorrectiveActionsData] = useState(null);
  const handleDownloadPdf = async () => {
    if (selectedOption) {
      const response = await fetch(`http://localhost:3001/api/ressources/${selectedOption.value}/Date for corrective actions/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedOption.value}-Date-for-corrective-actions.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download PDF:', response.statusText);
      }
    }
  };
  useEffect(() => {
    const fetchAuditData = async () => {
      setLoading(true);
      setError(null);
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
        setAuditData(data.tableData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  const handleSelectionChange = (option) => {
    setSelectedOption(option);
    if (option) {
      const selectedAudit = auditData.find(item => item["Audit ID"] === option.value);
      setSelectedAuditData(selectedAudit || {});
      setActiveSection(null);
    } else {
      setSelectedAuditData(null);
      setActiveSection(null);
    }
  };

  const handleButtonClick = async (section) => {
    setActiveSection(section);
    if (section === 'Date for Corrective Actions' && selectedOption) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/ressources/${selectedOption.value}/Date for corrective actions`);
        if (!response.ok) {
          throw new Error('Failed to fetch corrective actions data');
        }
        const data = await response.json();
        setCorrectiveActionsData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const buttonClasses = (section) => {
    const baseClasses = "mr-2 mb-2 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
    const activeClasses = "bg-blue-700";
    const defaultClasses = "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white";

    return activeSection === section
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${defaultClasses}`;
  };

  const renderQualificationTimeScheduleTable = (data) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    const [headers, ...rows] = data;

    return (
      <div className="bg-white overflow-y-auto text-gray-800 rounded-xl shadow-lg my-10 mx-6">
        <div className="p-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Qualification Time Schedule</h2>
          <h3 className="text-xl font-semibold mb-4">Time schedule (supplier)</h3>
        </div>
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-gray-600 uppercase text-xs font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-100 transition-colors duration-200`}
              >
                {row
                  .filter(cell => cell !== null && cell !== '') // Filter out empty cells
                  .map((cell, cellIndex) => {
                    let cellStyle = 'px-6 py-3 text-sm text-gray-700 whitespace-nowrap border-b border-gray-300';

                    // Apply special styling based on the cell content
                    if (cell === 'Qualification Time Schedule') {
                      cellStyle += ' font-bold text-xl';
                    } else if (cell === 'Time schedule (supplier)') {
                      cellStyle += ' font-bold text-xl';
                    } else if (headers[cellIndex] === 'Activities' || headers[cellIndex] === 'Date') {
                      cellStyle += ' font-bold text-xl';
                    }

                    return (
                      <td
                        key={cellIndex}
                        className={cellStyle}
                      >
                        {cell}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4">
          <p className="font-semibold text-lg">Notice:</p>
          <p className="text-gray-700">{data.notice || 'No notice available'}</p>
        </div>
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
                  onClick={() => handleButtonClick('Date for Corrective Actions')}
                  className={buttonClasses('Date for Corrective Actions')}
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
                <Button
    auto
    onClick={handleDownloadPdf}
    className="bg-green-500 text-white"
  > 
    Download PDF for dates for corr..
  </Button>
              </div>
              {activeSection === 'Date for Corrective Actions' && (
                <div>
                  {correctiveActionsData && renderQualificationTimeScheduleTable(correctiveActionsData.content)}
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
