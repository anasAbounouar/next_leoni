'use client';
import { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Swal from 'sweetalert2';

export default function AuditAnnouncement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', fileName);

      fetch(`http://localhost:${process.env.SERVER_PORT}/api/AuditAnnouncements/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire(
              'Confirmed!',
              `File "${fileName}" has been successfully submitted!`,
              'success'
            );
            setFileName('');
            setSelectedFile(null);
          } else {
            throw new Error('Error during file upload');
          }
        })
        .catch((error) => {
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
        text: 'Please attach a file before confirming.',
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
          Please attach the audit file, rename if necessary, and confirm your action.
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
              Upload file
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
