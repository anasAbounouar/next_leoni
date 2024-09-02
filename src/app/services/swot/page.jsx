'use client';
import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Paper, Box } from '@mui/material';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function SWOTPage() {
  const [formValues, setFormValues] = useState({
    title: '',
    auditId: '',
    auditor: '',
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    // Create an Excel file
    const swotData = [
      ['SWOT Analysis for:', formValues.title],
      ['Internal System Audit:', formValues.auditId],
      ['Auditor:', formValues.auditor],
      [],
      ['Strengths', formValues.strengths],
      ['Weaknesses', formValues.weaknesses],
      ['Opportunities', formValues.opportunities],
      ['Threats', formValues.threats]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(swotData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SWOT Analysis');

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SWOT_Analysis.xlsx';
    a.click();
    URL.revokeObjectURL(url);

    // Show success alert
    Swal.fire({
      title: 'SWOT Submitted!',
      text: 'Your SWOT analysis has been successfully submitted and downloaded.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  return (
    <Box 
      sx={{ 
        padding: 4, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 3, 
        boxShadow: 3, 
        maxWidth: 900, 
        margin: 'auto',
        mt: 5 
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Create SWOT Analysis
      </Typography>
      {!submitted ? (
        <Paper sx={{ padding: 4, mt: 3, backgroundColor: '#ffffff' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SWOT Title"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter SWOT Analysis Title"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Internal System Audit ID"
                  name="auditId"
                  value={formValues.auditId}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter Audit ID"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Auditor"
                  name="auditor"
                  value={formValues.auditor}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter Auditor Name"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Strengths"
                  name="strengths"
                  value={formValues.strengths}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter Strengths..."
                  sx={{ backgroundColor: '#e8f5e9', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Weaknesses"
                  name="weaknesses"
                  value={formValues.weaknesses}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter Weaknesses..."
                  sx={{ backgroundColor: '#fffde7', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Opportunities"
                  name="opportunities"
                  value={formValues.opportunities}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter Opportunities..."
                  sx={{ backgroundColor: '#e3f2fd', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Threats"
                  name="threats"
                  value={formValues.threats}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter Threats..."
                  sx={{ backgroundColor: '#ffebee', borderRadius: 2 }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4, padding: 1 }}
            >
              Submit SWOT Analysis
            </Button>
          </form>
        </Paper>
      ) : (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            SWOT Analysis for: {formValues.title}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Internal System Audit: {formValues.auditId}
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Auditor: {formValues.auditor}
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#4caf50', color: 'white', borderRadius: 2 }}>
                <Typography variant="h6">Strengths</Typography>
                <Typography>{formValues.strengths}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#f44336', color: 'white', borderRadius: 2 }}>
                <Typography variant="h6">Threats</Typography>
                <Typography>{formValues.threats}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#2196f3', color: 'white', borderRadius: 2 }}>
                <Typography variant="h6">Opportunities</Typography>
                <Typography>{formValues.opportunities}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 3, backgroundColor: '#ffeb3b', color: 'black', borderRadius: 2 }}>
                <Typography variant="h6">Weaknesses</Typography>
                <Typography>{formValues.weaknesses}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
