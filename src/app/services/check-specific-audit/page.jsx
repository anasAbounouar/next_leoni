'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

export default function AuditSearch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditIds, setAuditIds] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [selectedAuditData, setSelectedAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [swotData, setSwotData] = useState([]);
  const [correctiveActionsData, setCorrectiveActionsData] = useState(null);
  const [pdfImages, setPdfImages] = useState([]);

  // Fetch audit IDs and data from the backend
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

  // Handle selection change
  const handleSelectionChange = (option) => {
    setSelectedOption(option);
    if (option) {
      const selectedAudit = auditData.find(item => item["Audit ID"] === option.value);
      setSelectedAuditData(selectedAudit || {});
      setActiveSection(null);
      setPdfImages([]); // Reset the PDF images when a new option is selected
    } else {
      setSelectedAuditData(null);
      setActiveSection(null);
      setPdfImages([]); // Reset the PDF images when no option is selected
    }
  };

  // Handle button click to convert PDF to images and display them
  const handleButtonClick = async (section) => {
    setActiveSection(section);
    if (section === 'Date for Corrective Actions' && selectedOption) {
      try {
        const response = await fetch(`http://localhost:3001/api/convert/${selectedOption.value}/Date for corrective actions/pdf`);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        const images = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // Adjust scale for higher resolution
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          // Convert the canvas to an image
          const imageUrl = canvas.toDataURL('image/png');
          images.push(imageUrl);
        }

        setPdfImages(images);
        URL.revokeObjectURL(pdfUrl);
      } catch (error) {
        setError(error.message);
        console.error('Error converting PDF to images:', error.message);
      }
    } else if (section === 'Swot' && selectedOption) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/ressources/${selectedOption.value}/SWOT`);
        if (!response.ok) {
          throw new Error('Failed to fetch SWOT data');
        }
        const data = await response.json();
        setSwotData(data.content || []);
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

  const renderSwotTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;

    const swotSections = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];
    const sectionColors = {
      Strengths: 'text-green-600',
      Weaknesses: 'text-red-600',
      Opportunities: 'text-blue-600',
      Threats: 'text-orange-600',
    };

    const filteredData = data.map(row => row.filter(cell => cell !== null && cell.trim() !== ''));

    return (
      <div className="overflow-y-auto bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-6">
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

                    if (cell === 'SWOT Analyses for: LEONI Wiring Systems WMABE') {
                      cellStyle += ' font-bold !text-xl text-center';
                    } else if (cell === 'Internal System Audit: WSD S01-23-75') {
                      cellStyle += ' font-bold text-md text-center !text-lg';
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
                  .filter(cell => cell !== null && cell !== '') 
                  .map((cell, cellIndex) => {
                    let cellStyle = 'px-6 py-3 text-sm text-gray-700 whitespace-nowrap border-b border-gray-300';

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
              </div>
              {activeSection === 'Swot' && (
                <div>
                  {renderSwotTable(swotData)}
                </div>
              )}
              {activeSection === 'Date for Corrective Actions' && pdfImages.length > 0 && (
                <div>
                  {pdfImages.map((imgSrc, index) => (
                    <img key={index} src={imgSrc} alt={`Page ${index + 1}`} style={{ width: '100%', marginBottom: '20px' }} />
                  ))}
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
