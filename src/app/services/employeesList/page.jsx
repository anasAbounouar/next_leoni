'use client'
import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Import the Select component from react-select
import headers from './headers'; // Import the static headers

export default function EmployeeData() {
    const [employees, setEmployees] = useState([]); // State to store employee list
    const [selectedEmployee, setSelectedEmployee] = useState(null); // State to store selected employee
    const [employeeData, setEmployeeData] = useState([]); // Initialize as an array
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the list of employees when the component loads
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/employees'); // Fetching the employee list from your API
                if (!response.ok) {
                    throw new Error('Failed to fetch employee list');
                }
                const data = await response.json();

                // Map the data to match the format needed by react-select
                const formattedEmployees = data.map(employee => ({
                    value: employee.id,
                    label: `${employee.lastName.trim()} ${employee.firstName.trim()} (${employee.jobTitle.trim()})`,
                }));

                setEmployees(formattedEmployees);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEmployees();
    }, []);

    const handleEmployeeChange = async (selectedOption) => {
        setSelectedEmployee(selectedOption);

        if (selectedOption) {
            try {
                const response = await fetch(`http://localhost:3001/api/employee/${selectedOption.value}`);
                if (!response.ok) {
                    throw new Error('Employee not found');
                }
                const data = await response.json();

                // Set the fetched data to the state
                setEmployeeData(data.data || []); 
                setError(null);
            } catch (err) {
                setError(err.message);
                setEmployeeData([]);
            }
        } else {
            setEmployeeData([]);
        }
    };

    const handleDownload = () => {
        window.location.href = 'http://localhost:3001/api/download/excel';
    };

    const getBackgroundColor = (content) => {
        switch(content) {
            case 'System':
                return '#FFFFE0'; // Light Yellow
            case 'Process':
                return '#E0FFFF'; // Light Cyan
            case 'Product':
                return '#F0F8FF'; // Light Blue
            case 'General':
                return '#FFE4E1'; // Light Pink
            default:
                return '#FFF8DC'; // Default Light Color (Cornsilk)
        }
    };

    const renderHeaderRow = (level) => {
        let mergedHeaders = [];
        let previousHeader = null;
        let currentColSpan = 0;

        headers.forEach((header, index) => {
            const currentHeader = header[level];

            if (currentHeader === previousHeader && currentHeader !== null) {
                currentColSpan += 1;
                mergedHeaders[mergedHeaders.length - 1].colSpan = currentColSpan;
            } else {
                currentColSpan = 1;
                mergedHeaders.push({
                    content: currentHeader,
                    colSpan: 1,
                    key: `${level}-${index}`
                });
            }

            previousHeader = currentHeader;
        });

        return mergedHeaders.map(header => (
            <th 
                key={header.key} 
                colSpan={header.colSpan} 
                className="border border-gray-400 px-4 py-2"
                style={{
                    backgroundColor: header.content ? getBackgroundColor(header.content) : 'transparent'
                }}
            >
                {header.content || ''}
            </th>
        ));
    };

    return (
        <div className="p-4 mx-10">
            <button onClick={handleDownload} className="mb-4 p-2 bg-blue-500 text-white rounded">
                Download Excel File
            </button>

            <div className="mb-4" classNames={'flex justify-content-center'}>
                <Select
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    options={employees}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select an Employee"
                    isClearable
                    isSearchable
                    
                   
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {employeeData.length > 0 && (
                <div className='overflow-y-auto  '>
                    <table className="min-w-full border-collapse border-2 !rounded-xl  border-gray-900">
                        <thead>
                            <tr>
                                {renderHeaderRow('level1')}
                            </tr>
                            <tr>
                                {renderHeaderRow('level2')}
                            </tr>
                            <tr>
                                {renderHeaderRow('level3')}
                            </tr>
                            <tr>
                                {renderHeaderRow('level4')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {headers.map((header) => {
                                    const dataForColumn = employeeData.find((data) => data?.index === header.column);
                                    const cellValue = dataForColumn ? dataForColumn.value : null;
                                    return (
                                        <td 
                                            key={header.column} 
                                            className={cellValue ? "border border-gray-400 px-4 py-2" : "bg-gray-200 text-gray-500 px-4 py-2"} 
                                            style={!cellValue ? { border: "none" } : {}}
                                        >
                                            {cellValue || ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
