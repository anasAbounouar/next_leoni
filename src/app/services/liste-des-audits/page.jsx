'use client';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

export default function ListeDesAudits() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/audit-ids');
        const result = await response.json();

        // Filter out incomplete rows
        const filteredData = result.tableData.filter(row => 
          row["Site / BU / Department"] &&
          row["Processes"] &&
          row["Auditor"] &&
          row["Co Auditor"] &&
          row["Audit ID"] &&
          row["Result"] &&
          row["Status"] !== undefined // Status can be 0, so checking against undefined
        );

        setAuditData(filteredData);
      } catch (error) {
        setError('Failed to fetch audit data');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading) {
    return <div>Loading audit data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Function to determine the month based on non-empty cell
  const getMonthFromRow = (row) => {
    const months = ["Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan"];
    for (let month of months) {
      if (row[month]) {
        return month;
      }
    }
    return "";
  };

  return (
    <div className="p-6 bg-white text-gray-800 rounded-xl shadow-lg my-10 mx-6">
      <h1 className="text-2xl font-bold mb-6">Liste des Audits</h1>
      <Table
        aria-label="Audit Schedule"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        shadow={false}
      >
        <TableHeader>
          <TableColumn>Site / BU / Department</TableColumn>
          <TableColumn>Processes</TableColumn>
          <TableColumn>Auditor</TableColumn>
          <TableColumn>Co Auditor</TableColumn>
          <TableColumn>Month</TableColumn>
          <TableColumn>Audit ID</TableColumn>
          <TableColumn>Result</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {auditData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row["Site / BU / Department"]}</TableCell>
              <TableCell>{row["Processes"]}</TableCell>
              <TableCell>{row["Auditor"]}</TableCell>
              <TableCell>{row["Co Auditor"]}</TableCell>
              <TableCell>{getMonthFromRow(row)}</TableCell>
              <TableCell>{row["Audit ID"]}</TableCell>
              <TableCell>{row["Result"]}</TableCell>
              <TableCell>{row["Status"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
