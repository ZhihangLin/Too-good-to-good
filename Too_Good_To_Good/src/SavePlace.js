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
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('12:00'); // Default time
    const [showTimeModal, setShowTimeModal] = useState(false);


    useEffect(() => {
        if (!currentBoxId || !switchBoxId) {
            console.error("Invalid or undefined box IDs");
            alert("Invalid or undefined box IDs");
            history.push('/'); // Redirect if IDs are undefined
            return;
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
    }, [location, mapsLoaded]);


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
            setShowModal(true);
    } catch (error) {
        console.error('Error updating documents: ', error);
    }
    };


    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };


    const handleConfirmDate = async () => {
        if (!selectedDate) {
            alert('Please select a date.');
            return;
        }
    
        // Simply prepare to set the time, do not update Firestore yet
        setShowModal(false); // Close the date modal
        setShowTimeModal(true); // Open the time modal
    };
    
    const handleConfirmTime = async () => {
        const dateTime = `${selectedDate} ${selectedTime}`; // Combine date and time
        try {
            await updateDoc(doc(db, "boxes", currentBoxId), {
                switchDate: dateTime, // Store combined date and time
            });
            await updateDoc(doc(db, "boxes", switchBoxId), {
                switchDate: dateTime, // Store combined date and time
            });
    
            alert('Switch date and time set successfully!');
            setShowTimeModal(false); // Close the time modal
            history.push('/'); // Navigate away after setting everything
            window.location.reload();
        } catch (error) {
            console.error('Error updating documents: ', error);
            alert('Failed to update switch date and time.');
        }
    };





    return (
        <div>
            <h1>Safe Meeting Places near {location}</h1>
            <ul className="save-place-list">
                {places.map((place, index) => (
                    <li key={index} onClick={() => handleSelectPlace(place)}>
                        <strong>{place.name}</strong>
                        <p>{place.vicinity}</p>
                    </li>
                ))}
            </ul>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Select a Date for Switching Boxes</h2>
                        <input type="date" value={selectedDate} onChange={handleDateChange} />
                        <button onClick={handleConfirmDate}>Confirm Date</button>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
            {showTimeModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Select a Time for Switching Boxes</h2>
                        <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                        <button onClick={handleConfirmTime}>Confirm Time</button>
                        <button onClick={() => setShowTimeModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SavePlace;