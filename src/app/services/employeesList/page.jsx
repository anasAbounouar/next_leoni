'use client'
import React, { useState } from 'react';

export default function EmployeeData() {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [error, setError] = useState(null);

    const handleDownload = () => {
        window.location.href = 'http://localhost:3001/api/download/excel';
    };

    const handleFetchData = async () => {
        if (employeeNumber) {
            try {
                const response = await fetch(`http://localhost:3001/api/employee/${employeeNumber}`);
                if (!response.ok) {
                    throw new Error('Employee not found');
                }
                const data = await response.json();
                setEmployeeData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setEmployeeData(null);
            }
        }
    };

    return (
        <div className="p-4">
            <button onClick={handleDownload} className="mb-4 p-2 bg-blue-500 text-white rounded">
                Download Excel File
            </button>

            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Enter Employee Number"
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                    className="p-2 border rounded"
                />
                <button onClick={handleFetchData} className="ml-2 p-2 bg-green-500 text-white rounded">
                    Fetch Data
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {employeeData && (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {Object.keys(employeeData).map((key) => (
                                <th key={key} className="border px-4 py-2">{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.values(employeeData).map((value, index) => (
                                <td key={index} className="border px-4 py-2">{value}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}
