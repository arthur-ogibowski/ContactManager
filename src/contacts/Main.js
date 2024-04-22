
import { Link } from 'react-router-dom';
import { Grid, Paper, Typography, Button} from '@mui/material';

import List from './List';


const ContactsPage = () => {

  return (
    <div className="page">
        <Typography variant="h3" gutterBottom color="white" align='center'>
            Contact Manager
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px', minHeight: '70vh', maxHeight: '70vh'}}>
            <List />
              
            </Paper>
            
                {/* Button to navigate to Account Settings */}
                <Button
                    component={Link}
                    to="/accountSettings"
                    variant="outlined"
                    color="secondary"
                    style={{ marginTop: '20px'}}
                >
                Account Settings
              </Button>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px', minHeight: '70vh', maxHeight: '70vh'  }}>
              <Typography variant="h4" gutterBottom>
              </Typography>
              {/* Google Maps here */}
              <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0' }}>
                {/* Placeholder for Google Maps */}
              </div>
            </Paper>
          </Grid>
        </Grid>
    </div>
  );
};



export default ContactsPage;
