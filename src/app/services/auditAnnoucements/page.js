'use client';
import { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Swal from 'sweetalert2';

export default function AnnonceAudit() {
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

      fetch('http://localhost:3001/api/AuditAnnouncements/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire(
              'Confirm\u00e9!',
              `Fichier \"${fileName}\" a \u00e9t\u00e9 soumis avec succ\u00e8s!`,
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
            title: 'Erreur',
            text: 'Une erreur est survenue lors du t\u00e9l\u00e9chargement du fichier.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez joindre un fichier avant de confirmer.',
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
          Annonce d\u0027Audit
        </Typography>
        <Typography variant="body1" component="p" gutterBottom align="center">
          Veuillez joindre le fichier d\u0027audit, renommer si n\u00e9cessaire, et confirmer votre action.
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
              label="Nom du Fichier"
              variant="outlined"
              fullWidth
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Renommez le fichier ici..."
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
              Confirmer
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
