'use client';
import React, { useState } from 'react';

export default function EmployeeData() {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState(null);

    const handleEmployeeNumber = async (number) => {
        setEmployeeNumber(number);
        try {
            const response = await fetch(`http://localhost:3001/api/employee/${number}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setTableData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setTableData(null);
        }
    };

    const handleDownload = () => {
        window.location.href = 'http://localhost:3001/api/download/excel';
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
                <button onClick={() => handleEmployeeNumber(employeeNumber)} className="ml-2 p-2 bg-green-500 text-white rounded">
                    Fetch Data
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {tableData && (
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead>
                        <tr>
                            {tableData.headers[0]?.map((header, index) => (
                                <th key={index} className="border border-gray-400 px-4 py-2">
                                    {header || ''}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {tableData.headers[1]?.map((header, index) => (
                                <th key={index} className="border border-gray-400 px-4 py-2">
                                    {header || ''}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {tableData.headers[2]?.map((header, index) => (
                                <th key={index} className="border border-gray-400 px-4 py-2">
                                    {header || ''}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {tableData.headers[3]?.map((header, index) => (
                                <th key={index} className="border border-gray-400 px-4 py-2">
                                    {header || ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {tableData.data?.map((item, index) => (
                                <td key={index} className="border border-gray-400 px-4 py-2">
                                    {item?.value || ''}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}
