import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SavePlace.css';

function SavePlace() {
    const { location } = useParams();
    const [places, setPlaces] = useState([]);
    const [mapsLoaded, setMapsLoaded] = useState(false);

    // Dynamically load the Google Maps script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBJsvtmHWIIgsHSyCxnSNuICClKjmvkiA0&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapsLoaded(true);
        document.head.appendChild(script);

        return () => {
          document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (mapsLoaded) {
            const fetchPlaces = () => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: location }, (results, status) => {
                    if (status === 'OK') {
                        const geometry = results[0].geometry.location;
                        const latlng = `${geometry.lat()},${geometry.lng()}`;
                        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
                        service.nearbySearch({
                            location: geometry,
                            radius: '1000',
                            type: ['cafe']
                        }, (results, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                                setPlaces(results.slice(0, 10));
                            } else {
                                console.log("No places found or invalid API response");
                            }
                        });
                    } else {
                        console.error('Geocode was not successful for the following reason: ' + status);
                    }
                });
            };

            fetchPlaces();
        }
    }, [location, mapsLoaded]);

    return (
        <div>
            <h1>Safe Meeting Places near {location}</h1>
            <ul className="save-place-list">
                {places.map((place, index) => (
                    <li key={index}>
                        <strong>{place.name}</strong>
                        <p>{place.vicinity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavePlace;


