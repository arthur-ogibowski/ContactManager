import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, TextField, Box, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import '../index.css';

const ContactsList = () => {
    const [open, setOpen] = useState(false);
    const [contactData, setContactData] = useState({
        name: '',
        cpf: '',
        phone: '',
        address: { cep: '', street: '', city: '', state: '', lat: '', lng: ''}
    });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Retrieve current user from localStorage
        const currentUserEmail = localStorage.getItem('email');
        const currentUserData = JSON.parse(localStorage.getItem('users')).find(user => user.email === currentUserEmail);
        console.log('currentUserData:', currentUserData);
        setCurrentUser(currentUserData);
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check if the field is nested in the address object
        if (name.startsWith("address.")) {
            setContactData(prevData => ({
                ...prevData,
                address: {
                    ...prevData.address,
                    [name.split(".")[1]]: value
                }
            }));
        } else {
            setContactData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFetchAddress = async () => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${contactData.address.cep}/json/`);
            const data = await response.json();
            setContactData(prevData => ({
                ...prevData,
                address: {
                    ...prevData.address,
                    street: data.logradouro,
                    city: data.localidade,
                    state: data.uf
                }
            }));
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const handleSubmit = () => {
        // Format phone number
        const digits = contactData.phone.replace(/\D/g, '');
        const formattedPhone = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

        // Format CPF
        const cpfDigits = contactData.cpf.replace(/\D/g, '');
        const formattedCpf = cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        // Add contact data to current user
        const updatedUser = {
            ...currentUser,
            contacts: [
                ...(currentUser.contacts || []),
                {
                    ...contactData,
                    phone: formattedPhone,
                    cpf: formattedCpf
                }
            ]
        };
        
        // Update current user in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users'));
        const updatedUsers = existingUsers.map(user => user.email === currentUser.email ? updatedUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Reset contact form data
        setContactData({
            name: '',
            cpf: '',
            phone: '',
            address: { cep: '', street: '', city: '', state: '', lat: '', lng: ''}
        });

        // Close the modal
        handleClose();

        window.location.reload();
    };

    const handleDeleteContact = (index) => {
        const updatedContacts = currentUser.contacts.filter((contact, i) => i !== index);
        const updatedUser = {
            ...currentUser,
            contacts: updatedContacts
        };

        const existingUsers = JSON.parse(localStorage.getItem('users'));
        const updatedUsers = existingUsers.map(user => user.email === currentUser.email ? updatedUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        window.location.reload();
    }

    return (
        <div className="contact-list">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography variant="h4" gutterBottom>
                    Contacts    
                </Typography>
                <Button color="secondary" variant="contained" onClick={handleOpen} endIcon={<AddIcon />} style={{ height: '100%'}} > New Contact</Button>
            </div>
            <Modal open={open} onClose={handleClose} >
                <Box
                    sx={{
                        position: 'absolute',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: 1
                    }}
                >
                    <TextField
                        name="name"
                        label="Name"
                        placeholder='Your name'
                        fullWidth
                        value={contactData.name}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        name="cpf"
                        label="CPF"
                        placeholder='000.000.000-00'
                        fullWidth
                        value={contactData.cpf}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        name="phone"
                        label="Phone"
                        placeholder='(00) 00000-0000'
                        fullWidth
                        value={contactData.phone}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            name="address.cep"
                            label="CEP"
                            placeholder='00000-000'
                            fullWidth
                            value={contactData.address.cep}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <IconButton color="secondary" onClick={handleFetchAddress} style={{ height: '100%', marginLeft: '20px' }}><SearchIcon /></IconButton>
                    </div>
                    <TextField
                        name="address.street"
                        label="Street"
                        fullWidth
                        placeholder='Your street'
                        value={contactData.address.street}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        name="address.city"
                        label="City"
                        fullWidth
                        placeholder='Your city'
                        value={contactData.address.city}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        name="address.state"
                        label="State"
                        placeholder='ST'
                        fullWidth
                        value={contactData.address.state}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button color="secondary" variant="outlined" onClick={handleClose} style={{marginTop: '20px', marginRight: '10px'}} startIcon={<CloseIcon/>}>Cancel</Button>
                        <Button color="secondary" variant="contained" onClick={handleSubmit} style={{marginTop: '20px'}} endIcon={<AddIcon />}>Add</Button>
                    </div>
                </Box>
            </Modal>
            <div style={{ overflowY: 'auto', overflowX:'auto', maxHeight: '60vh', width: 'inherit'}}>
                {currentUser && currentUser.contacts && currentUser.contacts.map((contact, index) => (
                    <Paper key={index} style={{ padding: '10px', margin: '10px', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer' }} elevation={5} sx={{ "&:hover": { backgroundColor: '#2d2d2d', transition: '0.3s ease-in-out' } }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}> 
                            <Typography variant="h6" color="rgb(206, 147, 216)"><PersonIcon/>{contact.name}</Typography>
                            <Button color="error" onClick={() => handleDeleteContact(index)} startIcon={<DeleteIcon/>}>Delete</Button>
                        </div>
                        <Typography variant="body1"><BadgeIcon/>{contact.cpf}</Typography>
                        <Typography variant="body1"><PhoneIcon/>{contact.phone}</Typography>
                        <Typography variant="body1"><HomeIcon/>{contact.address.street}, {contact.address.city} - {contact.address.state}</Typography>
                    </Paper>
                ))}
            </div>
        </div>
    );
};

export default ContactsList;
