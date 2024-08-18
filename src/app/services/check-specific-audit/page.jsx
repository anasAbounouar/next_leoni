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
    } else {
      setSelectedAuditData(null);
    }
  };

  return (
    <div className="p-6 bg-background text-text rounded-xl shadow-lg my-10 mx-6">
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
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Résultats pour l&apos;ID d&apos;Audit : {selectedAuditData["Audit ID"]}</h3>
              <ul className="space-y-2">
                {Object.entries(selectedAuditData).map(([key, value]) => (
                  key !== "Audit ID" && value ? (
                    <li key={key} className="border p-2 rounded">
                      <strong>{key}:</strong> {value}
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        !loading && <p>Chargement des ID d&apos;Audit...</p>
      )}
    </div>
  );
}
