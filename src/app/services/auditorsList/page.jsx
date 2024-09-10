'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import headers from './headers'; // Import the static headers
import { Spinner } from '@nextui-org/react'; // Import the NextUI Spinner

export default function EmployeeData() {
   
    const [employees, setEmployees] = useState([]); // State to store employee list
    const [selectedEmployee, setSelectedEmployee] = useState(null); // State to store selected employee
    const [allEmployeeData, setAllEmployeeData] = useState([]); // State to store all employee data
    const [filteredEmployeeData, setFilteredEmployeeData] = useState([]); // State to store filtered employee data
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // New state for loading

    useEffect(() => {

        // Fetch the list of employees when the component loads
        const fetchEmployees = async () => {
           
            try {
                setLoading(true); // Start loading

                const response = await fetch(`/api/employees`); // Fetching the employee list from your API
                if (!response.ok) {
                    throw new Error('Failed to fetch employee list');
                }
                const data = await response.json();

                // Map the data to match the format needed by react-select
                const formattedEmployees = data.map(employee => ({
                    value: employee.id,
                    label: `${employee.lastName.trim()} ${employee.firstName.trim()} (${employee.jobTitle.trim()})`,
                }));

                // Add the "All Employees" option at the beginning of the options list
                const allOption = { value: null, label: 'Tous les employées' };
                setEmployees([allOption, ...formattedEmployees]);

                // Fetch data for all employees
                const allData = await Promise.all(
                    data.map(employee => fetch(`/api/employee/${employee.id}`).then(res => res.json()))
                );

                const combinedData = allData.map((result, index) => ({
                    employeeInfo: formattedEmployees[index],
                    data: result.data || []
                }));

                setAllEmployeeData(combinedData);
                setFilteredEmployeeData(combinedData); // Initially show all data
                setLoading(false); // Data fetching is complete
            } catch (err) {
                setError(err.message);
                setLoading(false); // Data fetching failed
            }
        };

        fetchEmployees();
    }, []);

    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);

        if (!selectedOption || selectedOption.value === null) {
            setFilteredEmployeeData(allEmployeeData); // Show all data if "All Employees" is selected
        } else {
            const filteredData = allEmployeeData.filter(
                employeeData => employeeData.employeeInfo.value === selectedOption.value
            );
            setFilteredEmployeeData(filteredData);
        }
    };

    const handleDownload = () => {
        window.location.href = `/api/download/excel`;
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
                Download Excel file 
            </button>

            <div className="mb-4 flex ">
                <Select
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    options={employees}
                    className="basic-single w-full max-w-md"
                    classNamePrefix="select"
                    placeholder="Filtrer par employé"
                    isClearable
                    isSearchable
                />
            </div>

            {loading && (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && filteredEmployeeData.length > 0 && (
                <div className="table-container">
                    <table className="min-w-full border-collapse border-2 rounded-xl border-gray-900">
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
                            {filteredEmployeeData.map((employee, index) => (
                                <tr key={index}>
                                    {headers.map((header) => {
                                        const dataForColumn = employee.data.find((data) => data?.index === header.column);
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
