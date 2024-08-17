'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [auditIds, setAuditIds] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      setAuditIds(result.auditIds);
    } catch (error) {
      console.error(error);
      alert('An error occurred during file upload.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Extract</button>

      {auditIds.length > 0 && (
        <ul>
          {auditIds.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
