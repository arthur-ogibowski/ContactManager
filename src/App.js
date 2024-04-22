import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';


import Contacts from './contacts/Main';
import Register from './account/Register';
import Login from './account/Login';
import NotFound from './NotFound';
import AccountSettings from './account/Settings';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage for login status on component mount
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);

  // Function to update login status and store in localStorage
  const updateLoginStatus = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', JSON.stringify(status));
  };


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ background: '#212121', minHeight: '100vh'}}>
          <Routes>
            {/* Redirect to contacts page if user is logged in */}
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Contacts />} />
                <Route path="/accountSettings" element={<AccountSettings setIsLoggedIn={setIsLoggedIn} />} />
              </>
            ) : (
              <>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login setIsLoggedIn={updateLoginStatus} />} />
              </>
            )}
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
