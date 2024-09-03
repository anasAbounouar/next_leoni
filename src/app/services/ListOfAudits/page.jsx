'use client'
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";

export default function ListeDesAudits() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.SERVER_PORT}/api/audit-ids`);
        const result = await response.json();

        const filteredData = result.tableData.filter(row =>
          row["Site / BU / Department"] &&
          row["Processes"] &&
          row["Auditor"] &&
          row["Co Auditor"] &&
          row["Audit ID"] &&
          row["Result"]
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

  const getMonth = (row) => {
    const months = ["Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan"];
    for (const month of months) {
      if (row[month]) {
        return `${month}: ${row[month]}`;
      }
    }
    return "-";
  };

  const columns = [
    { key: "site", label: "Site / BU / Department" },
    { key: "processes", label: "Processes" },
    { key: "auditor", label: "Auditor" },
    { key: "coAuditor", label: "Co Auditor" },
    { key: "month", label: "Month" },
    { key: "auditId", label: "Audit ID" },
    { key: "result", label: "Result" },
    { key: "remark", label: "Remark" },
    { key: "status", label: "Status" },
  ];

  const rows = auditData.map((row, index) => ({
    key: index,
    site: row["Site / BU / Department"],
    processes: row["Processes"],
    auditor: row["Auditor"],
    coAuditor: row["Co Auditor"],
    month: getMonth(row),
    auditId: row["Audit ID"],
    result: row["Result"],
    remark: row["Remark"] || "-",
    status: row["Status"]
  }));

  return (
    <Table
      isStriped
      aria-label="Liste des Audits"
      css={{
        borderCollapse: "collapse",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            css={{
              border: "1px solid #ddd",
              padding: "8px",
            }}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell
                css={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
