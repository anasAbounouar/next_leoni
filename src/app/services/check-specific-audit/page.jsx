'use client'
import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Image from 'next/image';
import { extractPageFromPdf } from '@/utils/extractPdfPage';

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
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfPageNumber, setPdfPageNumber] = useState(1);



  // Handle Audit ID Selection
  const handleSelectionChange = useCallback(async (option) => {
   
    setSelectedOption(()=>option);
    console.log('handleselectioncha,ge',selectedOption)
    setActiveSection(null);
    setPdfUrl(null);
    setPdfImage(null);
    setPdfPageNumber(1);
    setPdfBlob(null);

    if (!option) {
      setSelectedAuditData(null);
      setSwotData([]);
      return;
    }

    // Update the URL with the selected option as a query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('id', option.value);
    window.history.pushState({}, '', url.toString());

    const selectedAudit = auditData.find(item => item["Audit ID"] === option.value);
    setSelectedAuditData(selectedAudit || {});

    setIsFetchingPdf(true);
    try {
      const response = await fetch(`/api/convert/${option.value}/pdf`);
      if (!response.ok) throw new Error('Failed to fetch PDF');

      const tempPdfBlob = await response.blob();
      setPdfBlob(tempPdfBlob);

      const pdfUrl = URL.createObjectURL(tempPdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsFetchingPdf(false);
    }

    try {
      const response = await fetch(`/api/ressources/${option.value}/SWOT`);
      if (!response.ok) throw new Error('Failed to fetch SWOT data');

      const data = await response.json();
      setSwotData(data.content || []);
    } catch (error) {
      setError(error.message);
    }
  }, [auditData]);
    // Fetch Audit Data
  useEffect(() => {
    const fetchAuditData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/audit-ids`);
        if (!response.ok) throw new Error('Failed to fetch audit data');

        const data = await response.json();
        const options = data.tableData
          .filter(item => item["Audit ID"])
          .map(item => ({ value: item["Audit ID"], label: item["Audit ID"] }));
        setAuditIds(options);
        setAuditData(data.tableData);

        // Handle the query parameter if available
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        if (id) {
          const option = options.find(audit => audit.value === id);
          if (option) {
            setSelectedOption(option);
            
            handleSelectionChange(option);
          }
          
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []); // Only run once when the component mounts

  // Handle Section Button Click
  const handleButtonClick = useCallback(async (section) => {
    setActiveSection(section);
    setError(null);
console.log(selectedOption,"ssselectedoption")
    
   
    if (!pdfBlob) {
      setError('No PDF available. Please select an audit ID.');
      return;
    }

    const pageMap = {
      FrontPage: 1,
      Swot: 2,
      DateForCorrectiveActions: 4,
      VA3011: 3,
    };
    const pageNumber = pageMap[section] || 1;
    setPdfPageNumber(pageNumber);
    
    try {
      const extractedPdfUrl = await extractPageFromPdf(pdfBlob, pageNumber - 1);
      setPdfUrl(extractedPdfUrl);

      const pdf = await pdfjsLib.getDocument(extractedPdfUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      setPdfImage(canvas.toDataURL('image/png'));
    } catch (error) {
      setError('Error extracting or rendering PDF page');
      console.error('Error rendering PDF page:', error.message);
    }
    
  }, [pdfBlob]);

  // Handle PDF Download
  const handleDownloadPdf = () => {
    if (pdfBlob) {
      const fullPdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = fullPdfUrl;
      a.download = `${selectedOption?.value || 'audit'}-Audit.pdf`;
      a.click();
      URL.revokeObjectURL(fullPdfUrl);
    }
  };

  // Handle Excel Download
  const handleDownloadExcel = (endpoint) => {
    
    if (selectedOption) {
      const form = document.createElement('form');
      form.action = `${endpoint}`;
      form.method = 'GET';
      form.style.display = 'none';
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }
  };

  // Button Classes
  const buttonClasses = (section) => {
    return `mr-2 mb-2 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      activeSection === section ? 'bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white'
    }`;
  };

  // Render SWOT Table
  const renderSwotTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) return <p>No data available</p>;

    const swotSections = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];
    const sectionColors = {
      Strengths: 'text-green-600',
      Weaknesses: 'text-red-600',
      Opportunities: 'text-blue-600',
      Threats: 'text-orange-600',
    };
    
    const filteredData = data.map(row => row.filter(cell => cell && cell.trim()));

    return (
      <div className="overflow-y-auto bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-6">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-100 transition-colors duration-200`}
              >
                {row.map((cell, cellIndex) => {
                  let cellStyle = `px-1 py-1 text-sm text-gray-700 whitespace-nowrap border-b border-gray-300`;
                  if (cell === 'SWOT Analyses for: LEONI Wiring Systems WMABE') {
                    cellStyle += ' font-bold text-xl text-center';
                  } else if (cell === 'Internal System Audit: WSD S01-23-75') {
                    cellStyle += ' font-bold text-md text-center text-lg';
                  }
                  return (
                    <td
                      key={cellIndex}
                      className={`${cellStyle} px-6 ${swotSections.includes(cell) ? 'font-bold' : ''} ${
                        sectionColors[cell] || ''
                      }`}
                    >
                      {cell} 
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-6">
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && auditIds.length > 0 ? (
        <div className="mb-4">
          <Select
            options={auditIds}
            value={selectedOption}
            onChange={handleSelectionChange}
            placeholder="Select an Audit ID"
            className="mb-4"
          />
          {isFetchingPdf && <p className="text-gray-500">Downloading...</p>}
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
                  onClick={() => handleButtonClick('Swot')}
                  className={buttonClasses('Swot')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  Swot
                </Button>
                <Button
                  auto
                  onClick={() => handleButtonClick('DateForCorrectiveActions')}
                  className={buttonClasses('DateForCorrectiveActions')}
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
                  onClick={() => 
                  
                    handleDownloadExcel(`/api/ressources/${selectedOption.value}/announcement`)
                  
                  }
                  className={buttonClasses('AuditAnnouncement')}
                  disabled={isFetchingPdf || loading}
                  isLoading={isFetchingPdf || loading}
                >
                  Audit Announcement
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  auto
                  onClick={() => handleDownloadExcel(`/api/ressources/${selectedOption.value}/download`)}
                  className="mt-4 bg-blue-500 text-white"
                  disabled={isFetchingPdf || loading}
                >
                  Download Excel
                </Button>
                {pdfBlob && (
                  <Button
                    auto
                    onClick={handleDownloadPdf}
                    className="mt-4 bg-green-500 text-white"
                  >
                    Download PDF
                  </Button>
                )}
              </div>

              {activeSection === 'Swot' && renderSwotTable(swotData)}

              {pdfImage && activeSection !== 'Swot' && (
                <div>
                  <Image 
                    src={pdfImage} 
                    alt={`Page ${activeSection === 'FrontPage' ? 1 : activeSection === 'VA3011' ? 3 : 4} of PDF`} 
                    width={800} 
                    height={600} 
                    layout="responsive" 
                    style={{ maxHeight: '90vh', objectFit: 'contain' }} 
                  />
                </div>
              )}

              {pdfUrl && activeSection && (
                <div className="mt-10">
                  <iframe 
                    src={`${pdfUrl}#page=${pdfPageNumber}&zoom=75&toolbar=0&navpanes=0&scrollbar=0`}
                    width="100%" 
                    height="600px"
                    loading="lazy"
                    className="rounded-lg border-2 border-gray-300 shadow-md"
                    title="PDF Viewer"
                  >
                    Your browser does not support iframes.
                  </iframe>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        !loading && <Button color="primary" isLoading>Loading Audit IDs...</Button>
      )}
    </div>
  );
}
