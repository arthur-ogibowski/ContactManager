import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, TextField, Box, IconButton, Paper} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Map from './Map';
import ContactItem from './ContactItem';
import { SelectedContactProvider } from './../context';
import { Link } from 'react-router-dom';

const Main = () => {
  // Modal
  const [open, setOpen] = useState(false);
  const [contactData, setContactData] = useState({
    id: '', // Add id field to track the contact being edited
    name: '',
    cpf: '',
    phone: '',
    address: { cep: '', street: '', city: '', state: '', lat: '', lng: '' }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [editingContact, setEditingContact] = useState(null); // Track the contact being edited

  useEffect(() => {
    // Retrieve current user from localStorage
    const currentUserEmail = localStorage.getItem('email');
    const currentUserData = JSON.parse(localStorage.getItem('users')).find(user => user.email === currentUserEmail);
    setCurrentUser(currentUserData);
  }, []);

  const [selectedContact, setSelectedContact] = useState(null);
  const handleContactClick = (contact) => {
    console.log('Selected contact:', contact);
    setSelectedContact(contact);
  };

  const handleOpen = (contact = null) => {
    setOpen(true);
    if (contact) {
      // If a contact is passed, it means we're editing, so populate the form fields
      setContactData(contact);
      setEditingContact(contact);
    } else {
      // If no contact is passed, reset the form fields
      setContactData({
        id: '', // Reset id field
        name: '',
        cpf: '',
        phone: '',
        address: { cep: '', street: '', city: '', state: '', lat: '', lng: '' }
      });
      setEditingContact(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingContact(null); // Reset editing contact state
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
      // Fetch address details using ViaCEP API
      const response = await fetch(`https://viacep.com.br/ws/${contactData.address.cep}/json/`);
      const data = await response.json();
  
      if (data.erro) {
        console.error('CEP not found');
        return;
      }
  
      // Update street, city, and state in contactData
      setContactData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          street: data.logradouro,
          city: data.localidade,
          state: data.uf
        }
      }));
  
      // Fetch latitude and longitude using Google Maps Geocoding API
      const geocodingResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.logradouro + ',' + data.localidade + ',' + data.uf)}&key=AIzaSyD4usTm-6vW08KAcZGophWsCbA2xhGc10k`);
      const geocodingData = await geocodingResponse.json();
  
      if (geocodingData.results && geocodingData.results.length > 0) {
        const location = geocodingData.results[0].geometry.location;
        // Update latitude and longitude in contactData
        setContactData(prevData => ({
          ...prevData,
          address: {
            ...prevData.address,
            lat: location.lat,
            lng: location.lng
          }
        }));
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };
  

  const handleSubmit = () => {
    const updatedContacts = []; // Create a new empty array to hold updated contacts
  
    if (editingContact) {
      // Update existing contact
      currentUser.contacts.forEach(contact => {
        if (contact.id === contactData.id) {
          updatedContacts.push(contactData); // Add updated contact data
        } else {
          updatedContacts.push(contact); // Add existing contacts
        }
      });
    } else {
      // Add new contact
      currentUser.contacts.forEach(contact => updatedContacts.push(contact)); // Add existing contacts
      updatedContacts.push({ ...contactData, id: Date.now().toString() }); // Add new contact data
    }
  
    // Update local storage with the new contacts
    const existingUsers = JSON.parse(localStorage.getItem('users'));
    const updatedUsers = existingUsers.map(user =>
      user.email === currentUser.email ? { ...user, contacts: updatedContacts } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  
    // Update state as usual (optional)
    setCurrentUser(prevUser => ({
      ...prevUser,
      contacts: updatedContacts
    }));
  
    setContactData({
      id: '',
      name: '',
      cpf: '',
      phone: '',
      address: { cep: '', street: '', city: '', state: '', lat: '', lng: '' }
    });
    handleClose();
  };

  const renderContacts = () => {
    if (currentUser?.contacts) {
      return currentUser.contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} handleDeleteContact={handleDeleteContact} handleEditContact={handleOpen} handleContactClick={handleContactClick}/>
      ));
    }
    return null;
  };

  const handleDeleteContact = (deletedContact) => {
    const updatedContacts = currentUser.contacts.filter(c => c.id !== deletedContact.id);
  
    // Update local storage with the filtered contacts
    const existingUsers = JSON.parse(localStorage.getItem('users'));
    const updatedUsers = existingUsers.map(user =>
      user.email === currentUser.email ? { ...user, contacts: updatedContacts } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  
    // Update state as usual (optional)
    setCurrentUser(prevUser => ({
      ...prevUser,
      contacts: updatedContacts
    }));
  };

  return (
    <div className="page">
      <SelectedContactProvider>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', width: '100%'}}>
          <Typography variant="h4" gutterBottom color="white" align="center">
            Contact Manager
          </Typography>
          <Link to="/accountSettings" style={{ textDecoration: 'none', position: 'absolute', right: '10px' }}>
            <Button  color="secondary" variant="outlined" style={{ margin: '10px' }}>Account Settings</Button>
            </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', width: '90vw' }}>

          <Paper elevation={3} style={{ padding: '20px', minHeight: '70vh', maxHeight: '70vh', width: '30%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="rgb(206, 147, 216)">Contacts</Typography>
              <Button color="secondary" variant="contained" onClick={() => handleOpen()} endIcon={<AddIcon />} style={{ height: '100%', marginLeft: '10px' }} > New Contact</Button>
            </div>
            <div style={{ height: '60vh', overflowY: 'auto', marginTop: '20px' }}>
              {renderContacts()}
            </div>
          </Paper>
          <Paper elevation={3} style={{ padding: '20px', minHeight: '70vh', maxHeight: '70vh', width: '60%' }}>
            <Map contacts={currentUser?.contacts || []} selectedContact={selectedContact} />
          </Paper>
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
              placeholder='Contact name'
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
              placeholder='Contact street'
              value={contactData.address.street}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              name="address.city"
              label="City"
              fullWidth
              placeholder='Contact city'
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button color="secondary" variant="outlined" onClick={handleClose} style={{ marginTop: '20px', marginRight: '10px' }} startIcon={<CloseIcon />}>Cancel</Button>
              <Button color="secondary" variant="contained" onClick={handleSubmit} style={{ marginTop: '20px' }} >{editingContact ? 'Update' : 'Save'}</Button>
            </div>
          </Box>
        </Modal>
      </SelectedContactProvider>
    </div>
  );
};

export default Main;
