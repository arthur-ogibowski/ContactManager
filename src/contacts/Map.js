import React, { useState, useEffect} from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ contacts, selectedContact }) => {
    const [mapCenter, setMapCenter] = useState({ lat: -25.4372, lng: -49.2700 });

    useEffect(() => {
        // Update map center based on selectedContact
        if (selectedContact) {
            const center = selectedContact ? { lat: selectedContact.address.lat, lng: selectedContact.address.lng } : { lat: -25.428432, lng: -49.27344 }; // Default center (replace with your default)
            setMapCenter(center);
        }
    }, [selectedContact]); // Add selectedContact to dependency array

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                zoom={10} // Adjust zoom level for a closer view of the selected contact
                center={mapCenter} // Use the calculated mapCenter
            >
                {selectedContact && (
                    <Marker
                        key={selectedContact.id} // Assuming contacts have a unique id
                        position={{ lat: parseFloat(selectedContact.address.lat), lng: parseFloat(selectedContact.address.lng) }}
                    >
                    </Marker>
                )}
            </GoogleMap>
        </div>
    );
};

export default Map;
