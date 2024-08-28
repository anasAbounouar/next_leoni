'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import headers from '../employeesList/headers'; // Import headers for table and Excel file

export default function EmployeeData() {
    // Initialize state with empty values for each header column
    const [newEmployee, setNewEmployee] = useState(() => 
        headers.reduce((acc, header) => ({ ...acc, [header.column]: '' }), {})
    );

    // Handle changes in the form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Submitting the following employee data:", newEmployee);
    
       // not done yet
    };

    return (
        <Box className="mx-10" sx={{ p: 4, mx: 'auto', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Add New Employee
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                    {headers.map((header) => (
                        header.level4 && (
                            <Grid item xs={12} sm={6} key={header.column}>
                                <Tooltip title={newEmployee[header.column]} arrow>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={header.level4}
                                        name={header.column}
                                        value={newEmployee[header.column] || ''}
                                        onChange={handleInputChange}
                                        placeholder={`Enter ${header.level4}`}
                                        sx={{
                                            '& input': {
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            },
                                            '& input:focus, & input:hover': {
                                                overflow: 'visible',
                                                textOverflow: 'clip',
                                                whiteSpace: 'normal',
                                            },
                                        }} // Apply sx for ellipsis behavior
                                    />
                                </Tooltip>
                            </Grid>
                        )
                    ))}
                </Grid>
                <Box mt={4} textAlign="center">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ px: 4, py: 2, fontSize: '16px' }}
                    >
                        Add Employee and Update Excel
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
