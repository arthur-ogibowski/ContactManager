import { useState } from 'react';
import { Button, TextField, Typography, Paper, Grid} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AccountSettings = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove user login status
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('email');
        // Redirect to login page
        navigate('/');
        window.location.reload();
    };

    const currentUserEmail = localStorage.getItem('email');
    console.log('currentUserEmail:', currentUserEmail);

    const handleDeleteAccount = () => {
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        console.log('existingUsers:', existingUsers);

        const currentUserIndex = existingUsers.map(user => user.email).indexOf(currentUserEmail);
        console.log('currentUserIndex:', currentUserIndex);

        if (currentUserIndex !== -1) {
            existingUsers.splice(currentUserIndex, 1);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            handleLogout();
        } else {
            console.error('User not found in localStorage');
            // Handle the error as needed
        }
    };

    return (
        <div className="page">
            <Typography variant="h2" marginBottom={10} color="white" align='center'>
                Contact Manager
            </Typography>
            <Paper elevation={5} style={{ padding: 20, width: '30vw' }} align='center'>
            <Typography variant="h4" gutterBottom color="white">
                Account Settings
            </Typography>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                    disabled={!password || !confirmPassword}
                    style={{ width: '45%' }}
                >
                    Delete Account
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    style={{ width: '45%' }}
                >
                    Logout
                </Button>
            </div>
            {errorMessage && <p style={{ color: 'red', marginTop: '20px' }}>{errorMessage}</p>}
            <Grid container justifyContent="flex-start" style={{ marginTop: 10 }}>
                    <Grid item>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button variant="text" color="secondary" startIcon={<ArrowBackIcon/>}>
                                Back to contacts
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default AccountSettings;
