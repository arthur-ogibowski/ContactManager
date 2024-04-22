import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Login({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        // Check if user exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = existingUsers.find(user => user.email === formData.email && user.password === formData.password);
        if (!user) {
            setError('Invalid email or password');
            return;
        }

        // Login successful
        setIsLoggedIn(true);
        setError(null);
        localStorage.setItem('email',formData.email);
        console.log('Login successful');
    };

    return (
        <div className="page">
            <Typography variant="h2" marginBottom={10} color="white" align='center'>
                Contact Manager
            </Typography>
            <Paper elevation={5} style={{ padding: 20}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
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
                        Login
                    </Button>
                </form>
                <Grid container justifyContent="flex-end" style={{ marginTop: 10 }}>
                    <Grid item>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Button variant="text" color="secondary" endIcon={<ArrowForwardIcon/>}>
                                Don't have an account? Register 
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default Login;
