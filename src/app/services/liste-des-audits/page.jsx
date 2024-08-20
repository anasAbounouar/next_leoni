'use client'
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";

export default function ListeDesAudits() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/audit-ids');
        const result = await response.json();

        const filteredData = result.tableData.filter(row =>
          row["Site / BU / Department"] &&
          row["Processes"] &&
          row["Auditor"] &&
          row["Co Auditor"] &&
          row["Audit ID"] &&
          row["Result"]
        );

        // Extracting metadata with more robust checks
        const issuedByRow = result.tableData.find(row => typeof row["Site / BU / Department"] === 'string' && row["Site / BU / Department"].includes("Issued by"));
        const historyRows = result.tableData.filter(row => row["Site / BU / Department"] === "History" || row["Site / BU / Department"] === "Index");
        const issuedByDetails = result.tableData.find(row => typeof row["Site / BU / Department"] === 'string' && row["Site / BU / Department"].includes("Imane BENSALAH"));
        const specialInstructionsRow = result.tableData.find(row => typeof row["Site / BU / Department"] === 'string' && row["Site / BU / Department"].includes("Released by"));

        const metadataInfo = {
          title: "Internal Audits` Schedule / Programme \"WMABE\"",
          issuedDate: issuedByRow ? issuedByRow["Site / BU / Department"] : "Issued date not found",
          auditPeriod: "Audit period: 2023/2024",
          history: historyRows.map(row => ({
            date: row["Site / BU / Department"],
            change: row["Processes"]
          })),
          issuedBy: issuedByDetails ? issuedByDetails["Site / BU / Department"] : "Issued by information not found",
          specialInstructions: specialInstructionsRow ? specialInstructionsRow["Processes"] : "Special instructions not found"
        };

        setMetadata(metadataInfo);
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
        return month;
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
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1>{metadata.title}</h1>
        <p>{metadata.issuedDate}</p>
        <p>{metadata.auditPeriod}</p>
        {metadata.history && (
          <div>
            <h3>History</h3>
            <ul>
              {metadata.history.map((entry, index) => (
                <li key={index}>{entry.date}: {entry.change}</li>
              ))}
            </ul>
          </div>
        )}
        <p>{metadata.issuedBy}</p>
        <p>{metadata.specialInstructions}</p>
      </div>

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
    </div>
  );
}
