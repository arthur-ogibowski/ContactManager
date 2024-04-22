import React, { useContext } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import { SelectedContactContext } from './../context';

const ContactItem = ({ contact, handleDeleteContact, handleEditContact, handleContactClick }) => {

  return (
    <Paper style={{ padding: '10px', margin: '10px', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer' }} elevation={5} sx={{ "&:hover": { backgroundColor: '#2d2d2d', transition: '0.3s ease-in-out' } }} onClick={() => handleContactClick(contact)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="h6" color="rgb(206, 147, 216)" style={{ display: 'flex', alignItems: 'center' }}><PersonIcon style={{marginRight: '5px'}}/>{contact.name}</Typography>
        <Box sx={{ marginTop: '10px' }}>
          <IconButton color="error" onClick={() => handleDeleteContact(contact)}><DeleteIcon /></IconButton>
          <IconButton color="primary" onClick={() => handleEditContact(contact)}><EditIcon /></IconButton>
        </Box>
      </div>
      <Typography variant="body1"><BadgeIcon />{contact.cpf}</Typography>
      <Typography variant="body1"><PhoneIcon />{contact.phone}</Typography>
      <Typography variant="body1"><HomeIcon />{contact.address.street}, {contact.address.city} - {contact.address.state}</Typography>
    </Paper>
  );
};

export default ContactItem;
