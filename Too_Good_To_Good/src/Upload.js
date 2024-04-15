import React, { useState } from "react";
import './Upload.css';
import { Link, useHistory } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStateValue} from "./StateProvider";


function Upload() {
    const history = useHistory();
    const [{ user }] = useStateValue();

    const [type, setType] = useState('');
    const [productName, setProductName] = useState('');
    const [location, setLocation] = useState('');
    const [originPrice, setOriginPrice] = useState('');
    const [priceError, setPriceError] = useState('');
    const [notes, setNotes] = useState('');
    const [uploadPicture, setUploadPicture] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [locationError, setLocationError] = useState('');
    

    const validLocations = [
        "queens", "brooklyn", "manhattan", "bronx", "staten island"
    ];

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setUploadPicture(event.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validLocations.includes(location.toLowerCase())) {
            setLocationError("Location must be one of: Queens, Brooklyn, Manhattan, Bronx, Staten Island.");
            return;
        } else {
            setLocationError("");
        }

        if (isNaN(originPrice) || originPrice === '') {
            setPriceError("Price must be a number.");
            return;
        } else {
            setPriceError("");
        }
    
        if (!type || !productName || !originPrice || !uploadPicture || !location) {
            alert("Please fill out all required fields.");
            return;
        }
    
        try {
            const imageRef = `images/${uploadPicture.name}`;
            await uploadBytes(ref(storage, imageRef), uploadPicture);
            console.log('Image uploaded successfully!');
    
            const downloadURL = await getDownloadURL(ref(storage, imageRef));
            console.log('File available at', downloadURL);
    
            // Add box document
            const boxDocRef = await addDoc(collection(db, "boxes"), {
                type: type,
                productName: productName,
                location: location,
                originPrice: originPrice,
                notes: notes,
                imageUrl: downloadURL,
                userId: user.uid,
                username: user.displayName,
                EvaluationPrice: "not decide",
            });
            console.log("Box document successfully uploaded!");
    
            // Add user information to subcollection
            const userInformationRef = collection(db, "boxes", boxDocRef.id, "userInformation");
            await addDoc(userInformationRef, {
                userId: user.uid, 
                email: user.email,
            });
            console.log("User information added to the box document!");
    
            history.push('/');
        } catch (error) {
            console.error("Error uploading document: ", error);
        }
    };

    return (
        <div className="upload">
            <Link to='/'>
                <img className="upload_logo" src={require('./Logo.png')} alt="Logo" />
            </Link>
            <div className="login_container">
                <h1 className="email_">Welcome, {user ? user.displayName : 'Guest'}</h1>
                <form onSubmit={handleSubmit}>
                    <h3>Add your box by filling out the information below!</h3>
                    <TextField
                        sx={{ mb: 2, width: '100%' }}
                        type="file"
                        onChange={handleFileChange}
                        helperText="Upload Picture"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        sx={{ mb: 2, width: '100%' }}
                        required
                        label="Type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        multiline
                    />
                    <TextField
                        sx={{ mb: 2, width: '100%' }}
                        required
                        label="Product Name"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                        multiline
                    />
                    <TextField
                        sx={{ mb: 2, width: '100%' }}
                        required
                        label="Location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        error={!!locationError}
                        helperText={locationError}
                        multiline
                    />
                    <TextField
                        sx={{ mb: 2, width: '100%' }}
                        required
                        label="Origin Price"
                        type="number"
                        value={originPrice}
                        onChange={e => setOriginPrice(e.target.value)}
                        error={!!priceError}
                        helperText={priceError}
                        multiline
                    />
                    <TextField
                        sx={{ mb: 2, width: '100%' }}
                        label="Notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        multiline
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="contained"
                            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#43a047' } }}
                            type="submit">
                            Upload
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Upload;