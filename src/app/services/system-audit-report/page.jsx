'use client';
import { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Swal from 'sweetalert2';

export default function SystemAuditReport() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleConfirm = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', fileName);

      try {
        const response = await fetch('http://localhost:3001/api/SystemAuditReport/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            title: 'Success!',
            text: `File "${fileName}" has been uploaded successfully!`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          setFileName('');
          setSelectedFile(null);
        } else {
          Swal.fire({
            title: 'Error',
            text: result.error || 'An error occurred during file upload.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please attach a file before confirming.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          System Audit Report
        </Typography>
        <Typography variant="body1" component="p" gutterBottom align="center">
          Please attach the audit file, rename it if necessary, and confirm your action.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ textTransform: 'none', mt: 2 }}
            >
              Attach File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="File Name"
              variant="outlined"
              fullWidth
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Rename the file here..."
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleOutlineIcon />}
              fullWidth
              sx={{ textTransform: 'none', mt: 2 }}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
