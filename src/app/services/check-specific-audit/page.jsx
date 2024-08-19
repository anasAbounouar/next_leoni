'use client'
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
  const [pdfBlob, setPdfBlob] = useState(null); // Store the Blob object
  const [pdfImage, setPdfImage] = useState(null);
  

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
      setPdfImage(null); // Reset the PDF image when a new option is selected
      setPdfBlob(null);   // Reset the Blob object when a new option is selected
    } else {
      setSelectedAuditData(null);
      setActiveSection(null);
      setPdfImage(null); // Reset the PDF image when no option is selected
      setPdfBlob(null);   // Reset the Blob object when no option is selected
    }
  };

  // Handle button click to convert the fourth page of the PDF to an image and display it
  const handleButtonClick = async (section) => {
    
    setActiveSection(section);
    if (section === 'Date for Corrective Actions' && selectedOption) {
      try {
        const response = await fetch(`http://localhost:3001/api/convert/${selectedOption.value}/Date for corrective actions/pdf`);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const pdfBlob = await response.blob();

        setPdfBlob(pdfBlob); // Store the Blob object

        const pdfUrl = window.URL.createObjectURL(pdfBlob);

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

        // Ensure the PDF has at least 4 pages
        if (pdf.numPages >= 4) {
          const page = await pdf.getPage(4); // Get the fourth page (1-indexed)
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
          setPdfImage(imageUrl);
        } else {
          setError('The PDF does not have a fourth page.');
        }

        URL.revokeObjectURL(pdfUrl); // Revoke the temporary URL

      } catch (error) {
        setError(error.message);
        console.error('Error converting PDF to image:', error.message);
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

  const handleDownloadPdf = () => {
    
    if (pdfBlob) {
      const pdfUrl = window.URL.createObjectURL(pdfBlob); // Create a new URL from the Blob
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${selectedOption.value}-Date-for-corrective-actions.pdf`;
      a.click();
      URL.revokeObjectURL(pdfUrl); // Revoke the URL after download
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

              {activeSection === 'Date for Corrective Actions' && pdfImage && (
                <div>
                  <Image 
                    src={pdfImage} 
                    alt="Fourth page of PDF" 
                    width={800} 
                    height={600} 
                    layout="responsive"
                  />
                  <Button
                    auto
                    onClick={handleDownloadPdf}
                    className="mt-4 bg-green-500 text-white"
                  >
                    Download PDF
                  </Button>
                </div>
              )}
              {activeSection === 'Date for Corrective Actions' && !pdfImage &&  (
                <div class='text-center mt-10 '><Button color="secondary" isLoading={true}>Chargement  pour l&lsquo;affichage ...</Button>
                 
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
