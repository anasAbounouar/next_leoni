'use client';
import { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Paper, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function AuditAnnouncement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [auditID, setAuditID] = useState('');
  const [auditIDs, setAuditIDs] = useState([]);

  useEffect(() => {
    // Fetch the audit IDs from your API
    fetch('/api/audit-ids')
      .then(response => response.json())
      .then(data => setAuditIDs(data.tableData.map(audit => ({
        value: audit['Audit ID'],
        label: audit['Audit ID']
      }))))
      .catch(error => console.error('Error fetching audit IDs:', error));
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Update the file name based on audit ID and selected file extension
    if (auditID && file) {
      const fileExt = file.name.split('.').pop();
      const newFileName = `Audit Announcement VDA6.3 - P21 ${auditID}.${fileExt}`;
      setFileName(newFileName); // Update the fileName state
    }
  };

  const handleAuditIDChange = (option) => {
    setAuditID(option ? option.value : '');
    
    // Update the file name if a file is already selected
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      setFileName(option ? `Audit Announcement VDA6.3 - P21 ${option.value}.${fileExt}` : selectedFile.name);
    }
  };

  const handleConfirm = () => {
    if (selectedFile && auditID) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(`/api/ressources/${auditID}/announcement`, { // Updated API endpoint
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            Swal.fire(
              'Confirmed!',
              `File "${fileName}" has been successfully submitted!`,
              'success'
            );
            setFileName('');
            setSelectedFile(null);
            setAuditID('');
          } else {
            throw new Error('Error during file upload');
          }
        })
        .catch(error => {
          console.error('Upload error:', error);
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while uploading the file.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please select an audit ID and attach a file before confirming.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Audit Announcement
        </Typography>
        <Typography variant="body1" component="p" gutterBottom align="center">
          Select the audit ID, attach the file, rename if necessary, and confirm your action.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Select
              value={auditID ? { value: auditID, label: auditID } : null}
              onChange={handleAuditIDChange}
              options={auditIDs}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Select Audit ID"
              isClearable
              isSearchable
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ textTransform: 'none', mt: 2 }}
            >
              {selectedFile ? `File Selected: ${selectedFile.name}` : 'Upload file'}
              <input type="file" hidden onChange={handleFileChange} />
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
