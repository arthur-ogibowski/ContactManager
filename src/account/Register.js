import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Register() {
    const navigate = useNavigate();
    // State to manage form data and error messages
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

    // Function to handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Validate form data
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }
    
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(user => user.email === formData.email);
        if (userExists) {
            setError('Email already exists');
            return;
        }
    
        // Store user data
        const newUser = {
            email: formData.email,
            password: formData.password,
            contacts: []
        };
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    
        setFormData({
            email: '',
            password: ''
        });
        setError(null);
        console.log('Registration successful');
        navigate('/');
    };
    

    return (
        <div className="page">
            <Typography variant="h2" marginBottom={10} color="white" align='center'>
                Contact Manager
            </Typography>
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                {error && <Typography color="error" align="center">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: 20 }}
                    >
                        Register
                    </Button>
                </form>
                <Grid container justifyContent="flex-start" style={{ marginTop: 10 }}>
                    <Grid item>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="text" color="secondary" startIcon={<ArrowBackIcon/>}>
                                Back to login
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default Register;
