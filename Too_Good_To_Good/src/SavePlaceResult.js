import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavePlaceResults = () => {
    const [safePlaces, setSafePlaces] = useState([]);
    const boxLocation = "New York"; // Set the location you want to search in

    useEffect(() => {
        const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY; // Ensure your API key is stored in the .env.local file
        const query = encodeURIComponent(`cafes in ${boxLocation}`);
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=cafe&key=${apiKey}`;

        axios.get(url)
            .then(response => {
                if (response.data && response.data.results) {
                    // Take up to the first 8 results
                    const limitedResults = response.data.results.slice(0, 8);
                    setSafePlaces(limitedResults);
                } else {
                    console.log('No results found or wrong data structure:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching safe places:', error);
            });
    }, []); // Empty dependency array means this effect will only run once on mount

    return (
        <div>
            <h1>Safe Places to Exchange in {boxLocation}</h1>
            {safePlaces.length > 0 ? (
                <ul>
                    {safePlaces.map(place => (
                        <li key={place.place_id}>{place.name} - {place.formatted_address}</li>
                    ))}
                </ul>
            ) : (
                <p>No safe places found or yet to search.</p>
            )}
        </div>
    );
};

export default SavePlaceResults;