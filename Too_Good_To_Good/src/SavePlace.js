import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { db } from './firebase';
import { doc, updateDoc } from "firebase/firestore";
import './SavePlace.css';

function SavePlace() {
    const { location, currentBoxId, switchBoxId } = useParams();
    const [places, setPlaces] = useState([]);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const history = useHistory();


    useEffect(() => {
        if (!currentBoxId || !switchBoxId) {
            console.error("Invalid or undefined box IDs");
            alert("Invalid or undefined box IDs");
            history.push('/'); // Redirect if IDs are undefined
            return; // Prevent further execution in this useEffect
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBJsvtmHWIIgsHSyCxnSNuICClKjmvkiA0&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapsLoaded(true);
        document.head.appendChild(script);


        return () => {
          document.head.removeChild(script);
        };
    }, [currentBoxId, switchBoxId, history]);


    useEffect(() => {
        if (mapsLoaded) {
            const fetchPlaces = () => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: location }, (results, status) => {
                    if (status === 'OK') {
                        const geometry = results[0].geometry.location;
                        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
                        service.nearbySearch({
                            location: geometry,
                            radius: '1000',
                            type: ['cafe']
                        }, (results, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                                setPlaces(results.slice(0, 10));
                            }
                        });
                    }
                });
            };
            fetchPlaces();
        }
    }, [location, mapsLoaded, currentBoxId, switchBoxId]);


    const handleSelectPlace = async (place) => {
        console.log("Selected place:", place.name, place.vicinity);
        console.log("Current Box ID:", currentBoxId);
        console.log("Switch Box ID:", switchBoxId);
   
        if (!currentBoxId || !switchBoxId) {
            console.error('Invalid box IDs');
            alert('Invalid box IDs');  // Alert the user
            return;
        }
   
        const currentBoxRef = doc(db, "boxes", currentBoxId);
        const switchBoxRef = doc(db, "boxes", switchBoxId);
   
        try {
            await updateDoc(currentBoxRef, {
                switchLocation: place.name + ', ' + place.vicinity
            });
            await updateDoc(switchBoxRef, {
                switchLocation: place.name + ', ' + place.vicinity
            });
   
            console.log('Switch location set successfully!');
            alert('Switch location set successfully!');
            history.push(`/switch-time/${location}/${currentBoxId}/${switchBoxId}`);
            window.location.reload();
    } catch (error) {
        console.error('Error updating documents: ', error);
    }
    };


    return (
        <div>
            <h1 className='h1_padding'>Safe Meeting Places near {location}</h1>
            <ul className="save-place-list">
                {places.map((place, index) => (
                    <li key={index} onClick={() => handleSelectPlace(place)}>
                        <strong>{place.name}</strong>
                        <p>{place.vicinity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavePlace;