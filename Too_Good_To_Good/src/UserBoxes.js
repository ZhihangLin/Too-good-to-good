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

    const handleValueChange = async (boxId, field, newValue) => {
        try {
            await db.collection('boxes').doc(boxId).update({ [field]: newValue });
            // Update state to reflect the change
            setUserBoxes(prevBoxes =>
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

    const handleDeleteBox = async (boxId) => {
        try {
            await db.collection('boxes').doc(boxId).delete();
            
            setUserBoxes(userBoxes.filter(box => box.id !== boxId));
            
            console.log(`Box ${boxId} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting box ${boxId}:`, error);
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
                            onChange={e => handleValueChange(box.id, 'originPrice', e.target.value)}
                            error={!!priceError}
                            helperText={priceError}
                            multiline
                        />

                        {/* Location Field */}
                        <TextField
                            sx={{ mb: 2, width: '100%', backgroundColor: 'white'}}
                            label="Location"
                            value={box.location}
                            onChange={e => handleValueChange(box.id, 'location', e.target.value)}
                            error={!!locationError}
                            helperText={locationError}
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
                            onClick={() => handleButtonClick(box.id)}
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