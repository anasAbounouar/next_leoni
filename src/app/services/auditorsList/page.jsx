'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import headers from './headers';
import {
  Spinner,
  Button,
  Input,
  Typography,
} from "@nextui-org/react";
import { FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi'; // Importing additional icons

export default function EmployeeData() {
  // State variables
  const [employees, setEmployees] = useState([]); // List of employees for the dropdown
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Currently selected employee filter
  const [allEmployeeData, setAllEmployeeData] = useState([]); // All employee data
  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]); // Filtered employee data based on selection
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  // State for tracking which row is being edited
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [employeeToDelete, setEmployeeToDelete] = useState(null);


  // Fetch employees and their data
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      // Fetch employee list
      const response = await fetch(`/api/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee list');
      }
      const data = await response.json();
      console.log('Fetched Employee List:', data); // Log employee list

      // Format employees for react-select
      const formattedEmployees = data.map((employee) => {
        // Defensive checks
        const id = employee.id;
        const lastName =
          typeof employee.lastName === 'string'
            ? employee.lastName.trim()
            : 'N/A';
        const firstName =
          typeof employee.firstName === 'string'
            ? employee.firstName.trim()
            : 'N/A';
        const jobTitle =
          typeof employee.jobTitle === 'string'
            ? employee.jobTitle.trim()
            : 'N/A';
        const homePlant =
          typeof employee.homePlant === 'string'
            ? employee.homePlant.trim()
            : 'N/A';

        return {
          value: id,
          label: `${lastName} ${firstName} (${jobTitle})`,
        };
      });
      console.log('Formatted Employees for Select:', formattedEmployees); // Log formatted employees

      // Add "All Employees" option
      const allOption = { value: null, label: 'Tous les employés' };
      setEmployees([allOption, ...formattedEmployees]);

      // Fetch data for all employees
      const allData = await Promise.all(
        data.map((employee) =>
          fetch(`/api/employees/${employee.id}`).then((res) => res.json())
        )
      );
      console.log('Fetched Data for All Employees:', allData); // Log all employee data

      // Combine employee info with their data
      const combinedData = allData.map((result, index) => ({
        employeeInfo: formattedEmployees[index],
        data: result.data || [],
      }));
      console.log('Combined Employee Data:', combinedData); // Log combined data

      setAllEmployeeData(combinedData);
      setFilteredEmployeeData(combinedData); // Initially show all data
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error in fetchEmployees:', err); // Log error
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle employee selection change
  const handleEmployeeChange = (selectedOption) => {
    setSelectedEmployee(selectedOption);

    if (!selectedOption || selectedOption.value === null) {
      setFilteredEmployeeData(allEmployeeData); // Show all data if "All Employees" is selected
    } else {
      const filteredData = allEmployeeData.filter(
        (employeeData) => employeeData.employeeInfo.value === selectedOption.value
      );
      setFilteredEmployeeData(filteredData);
    }
  };

  // Handle file download
  const handleDownload = () => {
    window.location.href = `/api/download/excel`;
  };

  // Determine background color based on content
  const getBackgroundColor = (content) => {
    switch (content) {
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

  // Render table header rows with merged cells
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
          key: `${level}-${index}`,
        });
      }

      previousHeader = currentHeader;
    });

    return mergedHeaders.map((header) => (
      <th
        key={header.key}
        colSpan={header.colSpan}
        className="border border-gray-400 px-4 py-2"
        style={{
          backgroundColor: header.content
            ? getBackgroundColor(header.content)
            : 'transparent',
        }}
      >
        {header.content || ''}
      </th>
    ));
  };

  // Open Delete Modal and set the employee to delete
  const openDeleteModal = (employeeId) => {
    setEmployeeToDelete(employeeId);
    // Implement delete modal logic if you continue using it
    // Alternatively, implement inline deletion confirmation
    // For simplicity, we'll keep the modal approach here
  };

  // Handle Delete Operation
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        // Remove the deleted employee from state
        const updatedAllData = allEmployeeData.filter(
          (emp) => emp.employeeInfo.value !== employeeToDelete
        );
        setAllEmployeeData(updatedAllData);
        setFilteredEmployeeData(updatedAllData);
        setEmployeeToDelete(null);
        // Optionally, display a success notification here
      } else {
        // Optionally, display an error notification here
        alert(result.error || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('An error occurred while deleting the employee.');
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (employeeId, employee) => {
    setEditRowId(employeeId);
    // Initialize form data with current employee data
    const initialFormData = {};
    employee.data.forEach((item) => {
      initialFormData[item.index] = item.value;
    });
    setEditFormData(initialFormData);
  };

  // Handle Cancel Button Click
  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  // Handle Input Change in Editable Row
  const handleInputChange = (e, column) => {
    const { value } = e.target;
    setEditFormData({
      ...editFormData,
      [column]: value,
    });
  };

  // Handle Save Button Click
  const handleSaveClick = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (response.ok) {
        // Update the employee data in state
        const updatedAllData = allEmployeeData.map((emp) => {
          if (emp.employeeInfo.value === employeeId) {
            return {
              ...emp,
              data: emp.data.map((item) =>
                editFormData[item.index] !== undefined
                  ? { ...item, value: editFormData[item.index] }
                  : item
              ),
            };
          }
          return emp;
        });
        setAllEmployeeData(updatedAllData);

        // Update filtered data based on current filter
        if (selectedEmployee && selectedEmployee.value !== null) {
          setFilteredEmployeeData(
            updatedAllData.filter(
              (emp) => emp.employeeInfo.value === selectedEmployee.value
            )
          );
        } else {
          setFilteredEmployeeData(updatedAllData);
        }

        setEditRowId(null);
        setEditFormData({});
        // Optionally, display a success notification here
      } else {
        alert(result.error || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('An error occurred while updating the employee.');
    }
  };

  return (
    <div className="p-4 mx-10">
      {/* Download Button */}
      <Button
        onPress={handleDownload}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Download Excel file
      </Button>

      {/* Employee Select Dropdown */}
      <div className="mb-4 flex">
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

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Employee Data Table */}
      {!loading && filteredEmployeeData.length > 0 && (
        <div className="table-container overflow-x-auto">
          <table className="min-w-full border-collapse border-2 rounded-xl border-gray-900">
            <thead>
              <tr>{renderHeaderRow('level1')}</tr>
              <tr>{renderHeaderRow('level2')}</tr>
              <tr>{renderHeaderRow('level3')}</tr>
              <tr>{renderHeaderRow('level4')}</tr>
            </thead>
            <tbody>
              {filteredEmployeeData.map((employee) => (
                <tr
                  key={employee.employeeInfo.value}
                  className={editRowId === employee.employeeInfo.value ? 'bg-gray-100' : ''}
                >
                  {/* Actions Column */}
                  <td className="border border-gray-400 px-4 py-2">
                    {editRowId === employee.employeeInfo.value ? (
                      <>
                        <Button
                          color="success"
                          size="sm"
                          onPress={() => handleSaveClick(employee.employeeInfo.value)}
                          className="mr-2 flex items-center"
                          aria-label="Save"
                        >
                          <FiSave className="mr-1" /> Save
                        </Button>
                        <Button
                          color="error"
                          size="sm"
                          onPress={handleCancelClick}
                          className="flex items-center"
                          aria-label="Cancel"
                        >
                          <FiX className="mr-1" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="warning"
                          size="sm"
                          onPress={() => handleEditClick(employee.employeeInfo.value, employee)}
                          className="mr-2 mb-1 flex items-center"
                          aria-label="Modify"
                        >
                          <FiEdit className="mr-1" /> Modify
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onPress={() => openDeleteModal(employee.employeeInfo.value)}
                          className="flex items-center"
                          aria-label="Delete"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </Button>
                      </>
                    )}
                  </td>

                  {/* Data Columns */}
                  {headers.map((header) => {
                    if (header.column === 0) {
                      return null; // Skip actions column as it's already rendered
                    }

                    const dataForColumn = employee.data.find(
                      (dataItem) => dataItem?.index === header.column
                    );
                    const cellValue = dataForColumn ? dataForColumn.value : '';

                    // Check if the current row is in edit mode
                    if (editRowId === employee.employeeInfo.value) {
                      // Render input fields for editable cells
                      return (
                        <td
                          key={header.column}
                          className="border border-gray-400 px-4 py-2 bg-white"
                        >
                          <Input
                            clearable
                            bordered
                            fullWidth
                            size="sm"
                            value={editFormData[header.column] || ''}
                            onChange={(e) => handleInputChange(e, header.column)}
                          />
                        </td>
                      );
                    }

                    // Render normal cell
                    return (
                      <td
                        key={header.column}
                        className={
                          cellValue
                            ? "border border-gray-400 px-4 py-2"
                            : "bg-gray-200 text-gray-500 px-4 py-2"
                        }
                        style={!cellValue ? { border: "none" } : {}}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <Typography b size={18} className="mb-4">
              Confirm Deletion
            </Typography>
            <Typography className="mb-6">
              Are you sure you want to delete this employee?
            </Typography>
            <div className="flex justify-end">
              <Button
                auto
                flat
                color="error"
                onPress={() => setEmployeeToDelete(null)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button auto color="success" onPress={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      </div>
  );
}
