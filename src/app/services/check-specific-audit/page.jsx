'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Image from 'next/image';

export default function AuditSearch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditIds, setAuditIds] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [selectedAuditData, setSelectedAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [swotData, setSwotData] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfImage, setPdfImage] = useState(null);
  const [isFetchingPdf, setIsFetchingPdf] = useState(false);

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

  const handleSelectionChange = async (option) => {
    setSelectedOption(option);
    setPdfImage(null);
    setPdfBlob(null);
    setActiveSection(null);

    if (option) {
      const selectedAudit = auditData.find(item => item["Audit ID"] === option.value);
      setSelectedAuditData(selectedAudit || {});

      // Fetch PDF immediately
      setIsFetchingPdf(true);
      try {
        const response = await fetch(`http://localhost:3001/api/convert/${option.value}/pdf`);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const pdfBlob = await response.blob();
        setPdfBlob(pdfBlob);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching PDF:', error.message);
      } finally {
        setIsFetchingPdf(false);
      }

      // Fetch SWOT data immediately
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/ressources/${option.value}/SWOT`);
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
    } else {
      setSelectedAuditData(null);
      setSwotData([]);
    }
  };

  const handleButtonClick = async (section) => {
    setActiveSection(section);
    setError(null);

    if (section === 'AuditAnnouncement' && selectedOption) {
      handleDownloadExcel(`/api/ressources/${selectedOption.value}/announcement`);  // Trigger the download of the specific Excel file
      return;
    }

    if (!pdfBlob) {
      setError('No PDF available. Please select an audit ID.');
      return;
    }

    try {
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

      let pageNumber;
      if (section === 'FrontPage') pageNumber = 1;
      if (section === 'Date for Corrective Actions') pageNumber = 4;
      if (section === 'VA3011') pageNumber = 3;

      if (pageNumber && pdf.numPages >= pageNumber) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        setPdfImage(canvas.toDataURL('image/png'));
      } else {
        setError(`The PDF does not have a page ${pageNumber}.`);
      }

      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      setError(error.message);
      console.error('Error rendering PDF page:', error.message);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfBlob) {
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${selectedOption.value}-Audit.pdf`;
      a.click();
      URL.revokeObjectURL(pdfUrl);
    }
  };

  const handleDownloadExcel = (endpoint) => {
    if (selectedOption) {
      const form = document.createElement('form');
      form.action = `http://localhost:3001${endpoint}`;
      console.log("trying to get:",`http://localhost:3001${endpoint}`)
      form.method = 'GET';
      form.style.display = 'none';
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
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

  return (
    <div className="p-6 bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-6">
      {loading && <p className="text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && auditIds.length > 0 ? (
        <div className="mb-4">
          <Select
            options={auditIds}
            value={selectedOption}
            onChange={handleSelectionChange}
            placeholder="Sélectionnez un ID d'Audit"
            className="mb-4"
          />
          {isFetchingPdf && <p className="text-gray-500">Téléchargement en cours...</p>}
          {selectedOption && selectedAuditData && (
            <div>
              <div className="mb-4 flex flex-wrap justify-between">
                <Button
                  auto
                  onClick={() => handleButtonClick('FrontPage')}
                  className={buttonClasses('FrontPage')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  Front Page
                </Button>
                <Button
                  auto
                  onClick={() => setActiveSection('Swot')}
                  className={buttonClasses('Swot')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  Swot
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('Date for Corrective Actions')}
                  className={buttonClasses('Date for Corrective Actions')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  Date for Corrective Actions
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('VA3011')}
                  className={buttonClasses('VA3011')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  VA3011 ENCL .1
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('AuditAnnouncement')}
                  className={buttonClasses('AuditAnnouncement')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  Audit Announcement
                </Button>
              </div>
              <div className='flex items-center justify-between'> 
                {pdfBlob && (
                  <Button
                    auto
                    onClick={handleDownloadPdf}
                    className="mt-4 bg-green-500 text-white"
                  >
                    Download PDF
                  </Button>
                )}
                <Button
                  auto
                  onClick={() => handleDownloadExcel(`/api/ressources/${selectedOption.value}/announcement`)}
                  className="mt-4 bg-blue-500 text-white"
                  disabled={isFetchingPdf || loading}
                >
                  Download Excel
                </Button>
              </div>
              {activeSection === 'Swot' && (
                <div>
                  {renderSwotTable(swotData)}
                </div>
              )}

              {pdfImage && activeSection !== 'Swot' && (
                <div>
                  <Image 
                    src={pdfImage} 
                    alt={`Page ${activeSection === 'FrontPage' ? 1 : activeSection === 'VA3011' ? 3 : 4} of PDF`} 
                    width={800} 
                    height={600} 
                    layout="responsive" 
                  />
                </div>
              )}
              
              {activeSection === 'Date for Corrective Actions' && !pdfImage && (
                <div className="text-center mt-10">
                  <Button color="secondary" isLoading={true}>Chargement pour l&apos;affichage ...</Button>
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
