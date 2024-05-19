import React, { useEffect, useState } from 'react';
import { db, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './UserBoxes.css';
import { useStateValue } from './StateProvider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function UserBoxes() {
    const [{ user }] = useStateValue();
    const [userBoxes, setUserBoxes] = useState([]);
    const [priceError, setPriceError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [originPrice, setOriginPrice] = useState('');
    const [location, setLocation] = useState('');
    const [switchLocation, setSwitchLocation] = useState('');
    const [switchDate, setSwitchDate] = useState('');
    const [locationErrors, setLocationErrors] = useState({});
    const [priceErrors, setPriceErrors] = useState({});



    useEffect(() => {
        
        const fetchUserBoxes = async () => {
            if (!user)  // If user is not logged in, return
            {
                return; // If user is not logged in, return
            }

            try {
                const userBoxesRef = db.collection('boxes').where('userId', '==', user.uid);
                const snapshot = await userBoxesRef.get();
                const userBoxesData = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    let imageUrl = '';
                    if (data.imageRef) {
                        imageUrl = await getDownloadURL(ref(storage, data.imageRef));
                    }
                    if (data.switchLocation) {
                        setSwitchLocation(data.switchLocation);
                    }
                    return { id: doc.id, imageUrl, ...data };
                }));
                setUserBoxes(userBoxesData);
            } catch (error) {
                console.error('Error fetching user boxes:', error);
            }
        };

        fetchUserBoxes();
    }, [user]); // Run useEffect whenever user changes

    const handleValueChange = (boxId, field, newValue) => {
        setUserBoxes(prevBoxes =>
            prevBoxes.map(box =>
                box.id === boxId ? { ...box, [field]: newValue } : box
            )
        );
    };

    
    // Modify the handleButtonClick function to include location validation
    const handleUpdateButtonClick = async (boxId) => {
        const boxToUpdate = userBoxes.find(box => box.id === boxId);
        if (boxToUpdate) {
            if (validateLocation(boxToUpdate.location) && validatePrice(boxToUpdate.originPrice, boxId)) {
                try {
                    await db.collection('boxes').doc(boxId).update({
                        type: boxToUpdate.type,
                        originPrice: boxToUpdate.originPrice,
                        location: boxToUpdate.location,
                        notes: boxToUpdate.notes
                    });
                    console.log('Data updated successfully.');
                } catch (error) {
                    console.error('Error updating data:', error);
                }
            }
        }
    };

    const handleDeleteBox = async (boxId) => {
        try {
            await db.collection('boxes').doc(boxId).delete();
            
            setUserBoxes(userBoxes.filter(box => box.id !== boxId));
            
            console.log(`Box ${boxId} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting box ${boxId}:`, error);
        }
    };

    // Function to validate the origin price to ensure it's a numeric value
    const validatePrice = (value, boxId) => {
        if (!isNaN(value) && value.trim() !== '') {
            setPriceErrors(prev => ({ ...prev, [boxId]: '' }));
            return true;
        } else {
            setPriceErrors(prev => ({ ...prev, [boxId]: 'Please enter a valid number.' }));
            return false;
        }
    };
    

    // Modify the onChange handlers to include validation
    const handlePriceChange = (boxId, value) => {
        if (validatePrice(value, boxId)) {
            handleValueChange(boxId, 'originPrice', value);
        } else {
            handleValueChange(boxId, 'originPrice', value); // Allow user to keep typing to fix the issue
        }
    };

    // Function to validate location format
    const validateLocation = (value, boxId) => {
        const validCities = ["Queens", "Brooklyn", "Manhattan", "Bronx", "Staten Island"];
        const parts = value.split(', ');
        if (parts.length === 2 && validCities.includes(parts[0]) && /^\d{5}$/.test(parts[1])) {
            setLocationErrors(prev => ({ ...prev, [boxId]: '' }));
            return true;
        } else {
            setLocationErrors(prev => ({ ...prev, [boxId]: 'Invalid location. Format should be: City, ZIP Code (e.g., Queens, 12345)' }));
            return false;
        }
    };


    // Modify the onChange handler for location to include validation
    const handleLocationChange = (boxId, value) => {
        if (validateLocation(value, boxId)) {
            handleValueChange(boxId, 'location', value);
        } else {
            handleValueChange(boxId, 'location', value); // Allow user to keep typing to fix the issue
        }
    };


    return (
        <div className="boxesDisplay">   
            {userBoxes.map((box) => (
                <div key={box.id} className="box2_">
                    <img src={box.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/tgtg-af1a6.appspot.com/o/images%2Ftransparency_demonstration_1.png?alt=media&token=dde7538e-df6d-47f8-ae0b-4c0df81c4b8d'} alt={box.type} />
                    <div className="boxDetails2">
                        <h3 style={{ textAlign: 'center', marginBottom:'15px' }}>{box.productName}</h3>
                        <TextField
                            sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                            label="Type"
                            value={box.type}
                            onChange={e => handleValueChange(box.id, 'type', e.target.value)}
                            multiline
                        />

                        {/* Origin Price Field */}
                        <TextField
                            sx={{ mb: 2, width: '100%', backgroundColor: 'white' }}
                            label="Origin Price"
                            value={box.originPrice}
                            onChange={e => handlePriceChange(box.id, e.target.value)}
                            error={!!priceErrors[box.id]}
                            helperText={priceErrors[box.id] || ''}
                            multiline
                        />

                        {/* Location Field */}
                        <TextField
                            sx={{ mb: 2, width: '100%', backgroundColor: 'white' }}
                            label="Location"
                            value={box.location}
                            onChange={e => handleLocationChange(box.id, e.target.value)}
                            error={!!locationErrors[box.id]}
                            helperText={locationErrors[box.id] || ''}
                            multiline
                        />

                        {/* Notes Field */}
                        <TextField
                            sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                            label="Notes"
                            value={box.notes}
                            onChange={e => handleValueChange(box.id, 'notes', e.target.value)}
                            multiline
                        />
                        
                        <TextField
                        sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                        label="Switch Location"
                        value={box.switchLocation}
                        disabled
                        multiline
                        />

                        <TextField
                            sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                            label="Switch Date"
                            value={box.switchDate}
                            disabled
                            multiline
                        />
                        

                        <Button
                            sx={{ backgroundColor: '#007bff', color: 'white',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                            '& .MuiButton-startIcon': {
                                marginRight: '8px',
                            },
                            }}
                            startIcon={<CloudUploadIcon/>}
                            onClick={() => handleUpdateButtonClick(box.id)}
                            >
                        Update
                        </Button>

                        <Button
                            sx={{ backgroundColor: 'red', color: 'white',
                            '&:hover': {
                                backgroundColor: 'darkred',
                            },
                            '& .MuiButton-startIcon': {
                                marginRight: '8px',
                            },
                            }}
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteBox(box.id)}
                        >
                        Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
        // </div>
    );
}


export default UserBoxes;