'use client'
import React, { useState } from 'react';
import headers from '../employeesList/headers'; // Import headers for table and Excel file

export default function EmployeeData() {
    // Initialize state with empty values for each header column
    const [newEmployee, setNewEmployee] = useState(() => 
        headers.reduce((acc, header) => ({ ...acc, [header.column]: '' }), {})
    );

    // Handle changes in the form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Submitting the following employee data:", newEmployee);
    
        try {
            const response = await fetch('http://localhost:3001/api/add-employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });
    
            if (response.ok) {
                alert('Employee added and Excel updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to add employee. Error: ${errorData.error}`);
            }
    
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('There was an error adding the employee.');
        }
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

    // Render header rows dynamically based on header levels
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
        <div className="p-4 m-10">
           
            <form onSubmit={handleFormSubmit} className="mb-6">
                <div className='overflow-y-auto'>
                    <table className="min-w-full border-collapse border-2 !rounded-xl border-gray-900">
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
                                {headers.map((header) => (
                                    header.level4 && (
                                        <td
                                            key={header.column}
                                            className="border border-gray-400 px-4 py-2"
                                        >
                                            <input
                                                type="text"
                                                name={header.column}
                                                value={newEmployee[header.column] || ''}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full"
                                            />
                                        </td>
                                    )
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-green-500 text-white p-2 rounded"
                >
                    Add Employee and Update Excel 
                </button>
            </form>
        </div>
    );
}
