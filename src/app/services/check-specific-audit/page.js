'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react';

const AUDIT_IDS_PATH = '/auditIds.json';

export default function AuditSearch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [auditIds, setAuditIds] = useState([]);

  useEffect(() => {
    fetch(AUDIT_IDS_PATH)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched audit IDs:', data); // Log data to verify
        const options = data.map(id => ({ value: id, label: id }));
        setAuditIds(options);
      })
      .catch(error => console.error('Error fetching audit IDs:', error));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      alert('Veuillez sélectionner un ID d\'audit valide');
      return;
    }
    const data = await fetchAuditData(selectedOption.value);
    if (data) {
      setAuditData(data);
    } else {
      alert('Aucune donnée trouvée pour cet ID d\'audit');
    }
  };

  const fetchAuditData = async (id) => {
    // Placeholder data - replace with actual data fetching logic
    return {
      auditId: id,
      results: 'Résultats de l\'audit',
      correctiveActions: 'Actions correctives',
      swor: 'SWOR',
      va3011: 'VA3011 ENCL.1',
      announcements: 'Annonces d\'audit',
    };
  };

  return (
    <div className="p-6 bg-background text-text rounded-xl shadow-lg my-10 mx-6">
      <form onSubmit={handleSearch} className="mb-4">
        <Select
          options={auditIds}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Sélectionnez un ID d'Audit"
          className="mb-4"
        />
        <Button type="submit" className="bg-primary text-background hover:bg-primaryDark">
          Rechercher
        </Button>
      </form>

      {auditData && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Résultats pour l'ID d'Audit : {auditData.auditId}</h3>
          <ul className="space-y-2">
            <li className="border p-2 rounded"><strong>Résultats de l'audit:</strong> {auditData.results}</li>
            <li className="border p-2 rounded"><strong>Actions Correctives:</strong> {auditData.correctiveActions}</li>
            <li className="border p-2 rounded"><strong>SWOR:</strong> {auditData.swor}</li>
            <li className="border p-2 rounded"><strong>VA3011 ENCL.1:</strong> {auditData.va3011}</li>
            <li className="border p-2 rounded"><strong>Annonces d'Audit:</strong> {auditData.announcements}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
