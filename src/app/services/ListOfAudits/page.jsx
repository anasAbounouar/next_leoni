"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Snackbar,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";

// Styled components for better visual appearance
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ListeDesAudits() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAuditId, setEditAuditId] = useState(null);
  const [editAuditData, setEditAuditData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [auditToDelete, setAuditToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Original month extraction logic
  const getMonth = (row) => {
    const months = [
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
    ];
    for (const month of months) {
      if (row[month]) {
        return `${month}: ${row[month]}`;
      }
    }
    return "-";
  };

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await fetch(`/api/audit-ids`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        const result = await response.json();

        if (!result.tableData || !Array.isArray(result.tableData)) {
          throw new Error("Invalid data format received from API.");
        }

        // Process month field to extract month name
        const processedData = result.tableData.map((row) => ({
          ...row,
          month: getMonth(row),
        }));

        setAuditData(processedData);
      } catch (error) {
        setError(`Failed to fetch audit data: ${error.message}`);
        console.error("Fetch Audit Data Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error" icon={<FiAlertCircle />}>
          {error}
        </Alert>
      </div>
    );

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
    { key: "actions", label: "Actions" },
  ];

  const rows = auditData.map((row, index) => ({
    key: index,
    site: row["Site / BU / Department"],
    processes: row["Processes"],
    auditor: row["Auditor"],
    coAuditor: row["Co Auditor"],
    month: row["month"],
    auditId: row["Audit ID"],
    result: row["Result"],
    remark: row["Remark"] || "-",
    status: row["Status"],
  }));

  // Handle Edit Button Click
  const handleEditClick = (audit) => {
    setEditAuditId(audit.auditId);
    setEditAuditData({ ...audit, originalAuditId: audit.auditId }); // Store originalAuditId
  };

  // Handle Cancel Button Click
  const handleCancelClick = () => {
    setEditAuditId(null);
    setEditAuditData({});
  };

  // Handle Input Change in Editable Row
  const handleInputChange = (field, value) => {
    setEditAuditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Save Button Click
  const handleSaveClick = async () => {
    // Basic validation
    const requiredFields = [
      "site",
      "processes",
      "auditor",
      "coAuditor",
      "month",
      "result",
      "auditId", // Now Audit ID is required
    ];
    for (const field of requiredFields) {
      if (
        !editAuditData[field] ||
        editAuditData[field].toString().trim() === ""
      ) {
        Swal.fire(
          "Validation Error",
          `The field "${field}" is required and cannot be empty.`,
          "warning"
        );
        return;
      }
    }

    // Parse the "month" field to extract month and type
    const monthParts = editAuditData.month.split(":");
    if (monthParts.length !== 2) {
      Swal.fire(
        "Validation Error",
        `The "Month" field must be in the format "Month: Type" (e.g., "Aug: NP03").`,
        "warning"
      );
      return;
    }

    const [monthName, monthType] = monthParts.map((part) => part.trim());

    const validMonths = [
      "Feb",
      "March",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
    ];

    if (!validMonths.includes(monthName)) {
      Swal.fire(
        "Validation Error",
        `Invalid month name "${monthName}". Please enter a valid month.`,
        "warning"
      );
      return;
    }

    try {
      // Construct the updated audit object with correct month fields
      const updatedAudit = {
        "Site / BU / Department": editAuditData.site,
        "Processes": editAuditData.processes,
        "Auditor": editAuditData.auditor,
        "Co Auditor": editAuditData.coAuditor,
        "Result": editAuditData.result,
        "Remark": editAuditData.remark,
        "Status": editAuditData.status,
        "Audit ID": editAuditData.auditId, // Include Audit ID in payload
        // Set all month fields to empty except the edited one
        "Feb": "",
        "March": "",
        "Apr": "",
        "May": "",
        "June": "",
        "July": "",
        "Aug": "",
        "Sept": "",
        "Oct": "",
        "Nov": "",
        "Dec": "",
        "Jan": "",
      };

      // Set the specific month field
      updatedAudit[monthName] = monthType;

      // If Audit ID has changed, need to reference the original ID in the URL
      const originalAuditId = editAuditData.originalAuditId || editAuditId;

      const response = await fetch(`/api/audit-ids/${originalAuditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAudit),
      });

      if (response.ok) {
        const updatedData = auditData.map((audit) =>
          audit.auditId === originalAuditId
            ? { ...audit, ...updatedAudit, month: `${monthName}: ${monthType}` }
            : audit
        );

        setAuditData(updatedData);
        setEditAuditId(null);
        setEditAuditData({});
        showSnackbar("Audit updated successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update audit.");
      }
    } catch (error) {
      setError(`Failed to update audit: ${error.message}`);
      Swal.fire("Error!", error.message, "error");
      console.error("Update Audit Error:", error);
    }
  };

  // Handle Delete Operation
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/audit-ids/${auditToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedData = auditData.filter(
          (audit) => audit.auditId !== auditToDelete
        );
        setAuditData(updatedData);
        setAuditToDelete(null);
        showSnackbar("Audit deleted successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete audit.");
      }
    } catch (error) {
      setError(`Failed to delete audit: ${error.message}`);
      Swal.fire("Error!", error.message, "error");
      console.error("Delete Audit Error:", error);
    }
  };

  // Open Delete Confirmation Dialog
  const openDeleteDialog = (auditId) => {
    setAuditToDelete(auditId);
    setDeleteDialogOpen(true);
  };

  // Close Delete Confirmation Dialog
  const closeDeleteDialog = () => {
    setAuditToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Show Snackbar Notification
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-4 ">
      <Typography variant="h4" gutterBottom align="center">
        Liste des Audits
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.key}>
                  <Typography variant="subtitle1">{column.label}</Typography>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item) => {
              const isEditing = editAuditId === item.auditId;
              return (
                <StyledTableRow key={item.key}>
                  {/* Site / BU / Department */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.site}
                        onChange={(e) =>
                          handleInputChange("site", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.site
                    )}
                  </TableCell>

                  {/* Processes */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.processes}
                        onChange={(e) =>
                          handleInputChange("processes", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.processes
                    )}
                  </TableCell>

                  {/* Auditor */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.auditor}
                        onChange={(e) =>
                          handleInputChange("auditor", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.auditor
                    )}
                  </TableCell>

                  {/* Co Auditor */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.coAuditor}
                        onChange={(e) =>
                          handleInputChange("coAuditor", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.coAuditor
                    )}
                  </TableCell>

                  {/* Month */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.month}
                        onChange={(e) =>
                          handleInputChange("month", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="e.g., Aug: NP03"
                      />
                    ) : (
                      item.month
                    )}
                  </TableCell>

                  {/* Audit ID (Editable) */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.auditId}
                        onChange={(e) =>
                          handleInputChange("auditId", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Typography>{item.auditId}</Typography>
                    )}
                  </TableCell>

                  {/* Result */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.result}
                        onChange={(e) =>
                          handleInputChange("result", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.result
                    )}
                  </TableCell>

                  {/* Remark */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.remark}
                        onChange={(e) =>
                          handleInputChange("remark", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.remark
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editAuditData.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.status
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    {isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={handleSaveClick}
                          >
                            <FiSave />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={handleCancelClick}
                          >
                            <FiX />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleEditClick(item)}
                          >
                            <FiEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(item.auditId)}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this audit? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
