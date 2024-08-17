'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '@nextui-org/react';

export default function AuditSearch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditIds, setAuditIds] = useState([]);
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch audit IDs from the backend
  useEffect(() => {
    const fetchAuditIds = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        const response = await fetch('http://localhost:3001/api/audit-ids');
        if (!response.ok) {
          throw new Error('Failed to fetch audit IDs');
        }
        const data = await response.json();
        const options = data.auditIds.map(id => ({ value: id, label: id }));
        setAuditIds(options);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditIds();
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      alert('Veuillez sélectionner un ID d\'audit valide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/audit-data/${selectedOption.value}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit data');
      }
      const data = await response.json();
      setAuditData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-background text-text rounded-xl shadow-lg my-10 mx-6">
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && auditIds.length > 0 ? (
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
      ) : (
        !loading && <p>Chargement des ID d &apos; Audit...</p>
      )}

      {auditData && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Résultats pour l &apos; ID d &apos; Audit : {auditData.auditId}</h3>
          <ul className="space-y-2">
            <li className="border p-2 rounded"><strong>Résultats de l &apos;audit:</strong> {auditData.results}</li>
            <li className="border p-2 rounded"><strong>Actions Correctives:</strong> {auditData.correctiveActions}</li>
            <li className="border p-2 rounded"><strong>SWOR:</strong> {auditData.swor}</li>
            <li className="border p-2 rounded"><strong>VA3011 ENCL.1:</strong> {auditData.va3011}</li>
            <li className="border p-2 rounded"><strong>Annonces d &apos; Audit:</strong> {auditData.announcements}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
