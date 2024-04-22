import React, { createContext, useState } from 'react';

const SelectedContactContext = createContext(null);

const SelectedContactProvider = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <SelectedContactContext.Provider value={{ selectedContact, handleContactClick }}>
      {children}
    </SelectedContactContext.Provider>
  );
};

export { SelectedContactContext, SelectedContactProvider, };
