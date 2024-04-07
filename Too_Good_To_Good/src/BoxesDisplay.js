import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './BoxesDisplay.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function BoxesDisplay() {
    const [boxes, setBoxes] = useState([]);
    const [priceError, setPriceError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [originPrice, setOriginPrice] = useState('');
    const [location, setLocation] = useState('');

    


    const validLocations = [
        "queens", "brooklyn", "manhattan", "bronx", "staten island"
    ];

    useEffect(() => {
        const fetchBoxes = async () => {
            const snapshot = await db.collection('boxes').get();
            const boxesData = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                let imageUrl = '';
                if (data.imageRef) {
                    imageUrl = await getDownloadURL(ref(storage, data.imageRef));
                }
                return { 
                    id: doc.id, 
                    imageUrl, 
                    username: data.username,
                    ...data 
                };
            }));
            setBoxes(boxesData);
        };

        fetchBoxes();
    }, []);

    const handleValueChange = async (boxId, field, newValue) => {
        if (isNaN(originPrice) || originPrice === '') {
            setPriceError("Price must be a number.");
            return;
        } else {
            setPriceError("");
        }

        if (!validLocations.includes(location.toLowerCase())) {
            setLocationError("Location must be one of: Queens, Brooklyn, Manhattan, Bronx, Staten Island.");
            return;
        } else {
            setLocationError("");
        }


        try {
            await db.collection('boxes').doc(boxId).update({ [field]: newValue });
            // Update state to reflect the change
            setBoxes(prevBoxes =>
                prevBoxes.map(box =>
                    box.id === boxId ? { ...box, [field]: newValue } : box
                )
            );
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const handleButtonClick = async (boxId) => {
        console.log("Button clicked for box:", boxId);

    };

    return (
        <div className="boxesDisplay">
            {boxes.map((box) => (
                <div key={box.id} className="box1">
                    <img src={box.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={box.type} />
                    <div className="boxDetails1">
                        <h3 style={{ textAlign: 'center' }}>{box.productName}</h3>
                        <p>User's Username: {box.username}</p>
                        
                        <TextField
                        sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                        label= "Type"
                        value={box.type}
                        onChange={e => handleValueChange(e.target.value)}
                        multiline
                        />

                        <TextField
                        sx={{ mb: 2, width: '100%', backgroundColor: 'white' }}
                        label="Origin Price"
                        value={box.originPrice}
                        onChange={e => handleValueChange(e.target.value)}
                        error={!!priceError}
                        helperText={priceError}
                        multiline
                        
                        />

                        

                        <TextField
                        sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                        label="Location"
                        value={box.location}
                        onChange={e => handleValueChange(e.target.value)}
                        error={!!locationError}
                        helperText={locationError}
                        multiline
                        />

                        

                        <TextField
                        sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                        label="Notes"
                        value={box.notes}
                        onChange={e => handleValueChange(e.target.value)}
                        multiline
                        />


                        <TextField
                        sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                        label="Evaluation Price"
                        value={box.EvaluationPrice}
                        onChange={e => handleValueChange(e.target.value)}
                        multiline
                        />

                        <button onClick={() => handleButtonClick(box.id)}>Update</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BoxesDisplay;