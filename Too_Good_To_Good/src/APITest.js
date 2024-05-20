import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './APITest.css'

function APITest({ city }) {
  const [places, setPlaces] = useState([]);
    const apiKey = "AIzaSyBJsvtmHWIIgsHSyCxnSNuICClKjmvkiA0"; // Replace with your actual API key

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=public+places+in+${city}&key=${apiKey}`);
                setPlaces(response.data.results);
            } catch (error) {
                console.error("Failed to fetch places", error);
            }
        };

        if (city) {
            fetchPlaces();
        }
    }, [city]);

    return (
        <div>
            <h2>Safe Places in {city}</h2>
            <ul>
                {places.map(place => (
                    <li key={place.place_id}>
                        {place.name} - {place.formatted_address}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default APITest

