'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { Button, TextField, Grid, Typography, Paper, CircularProgress, Box, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';

export default function AuditUpdatePage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [auditIds, setAuditIds] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [selectedAuditData, setSelectedAuditData] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state for handling fetch errors

  // Fetch Audit Data
  useEffect(() => {
    const fetchAuditData = async () => {
      setLoading(true); // Set loading to true when the request starts
      setError(null); // Clear any previous errors

      try {
        const response = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/api/audit-ids`);
        if (!response.ok) throw new Error('Failed to fetch audit data');

        const data = await response.json();
        const options = data.tableData
          .filter(item => item["Audit ID"])
          .map(item => ({ value: item["Audit ID"], label: item["Audit ID"] }));

        setAuditIds(options); // Populate the audit IDs dropdown options
        setAuditData(data.tableData);

        // Handle the query parameter if available
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        if (id) {
          const option = options.find(audit => audit.value === id);
          if (option) {
            setSelectedOption(option);
            handleSelectionChange(option);
          }
        }
      } catch (error) {
        setError(error.message); // Set error if fetch fails
      } finally {
        setLoading(false); // Stop loading when the request finishes
      }
    };

    fetchAuditData();
  }, []);

  // Handle Audit ID Selection
  const handleSelectionChange = useCallback((option) => {
    setSelectedOption(option);
    if (!option) {
      setSelectedAuditData(null);
      return;
    }

    const selectedAudit = auditData.find(item => item["Audit ID"] === option.value);
    setSelectedAuditData(selectedAudit || {});

    // Update URL with selected Audit ID
    const newUrl = new URL(window.location.href);
    if (option) {
      newUrl.searchParams.set('id', option.value);
    } else {
      newUrl.searchParams.delete('id');
    }
    window.history.replaceState(null, '', newUrl.toString());
  }, [auditData]);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: 'Success!',
      text: 'Editing done successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    // Optionally, you might want to reset the form and state here
    setSelectedOption(null);
    setSelectedAuditData(null);
  };

  return (
    <Box 
      sx={{ 
        padding: 3, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 2, 
        boxShadow: 3, 
        maxWidth: 800, 
        margin: 'auto',
        mt: 4 
      }}
    >
      {loading && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress /> {/* Display loading spinner while data is being fetched */}
        </Box>
      )}
      {error && (
        <Typography color="error" align="center">
          {error} {/* Display error message if there's an error */}
        </Typography>
      )}
      {!loading && auditIds.length > 0 && ( /* Display form only after data is loaded */
        <>
          <Typography variant="h5" component="h1" gutterBottom>
            Select an Audit ID
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Select
              value={selectedOption}
              onChange={handleSelectionChange}
              options={auditIds}
              placeholder="Select an Audit ID"
              isClearable
            />
          </Box>

          {selectedAuditData && (
            <Paper sx={{ padding: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Edit Audit Details
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Site / BU / Department</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Site / BU / Department"]}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Processes</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Processes"]}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Auditor</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Auditor"]}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Co Auditor</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Co Auditor"]}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Audit ID</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Audit ID"]}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Result</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Result"]}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Remark</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Remark"] || ""}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel shrink>Status</InputLabel>
                      <TextField
                        fullWidth
                        defaultValue={selectedAuditData["Status"] || ""}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Confirm Modification
                </Button>
              </form>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
