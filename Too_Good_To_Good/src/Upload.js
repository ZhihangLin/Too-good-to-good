import React, { useState } from "react";
import './Upload.css';
import { Link, useHistory } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

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
    const [notes, setNotes] = useState('');
    const [uploadPicture, setUploadPicture] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setUploadPicture(event.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
                <h1 className="email_">Welcome, {user ? user.email : 'Guest'}</h1>
                <form onSubmit={handleSubmit}>
                    <h3>Add your box by filling out the information below!</h3>
                    <br />
                    <h4>Upload Picture:</h4>
                    <input type="file" onChange={handleFileChange} />
                    <h5>Type:</h5>
                    <input type='text' value={type} onChange={e => setType(e.target.value)} />
                    <h5>Product Name:</h5>
                    <input type='text' value={productName} onChange={e => setProductName(e.target.value)} />
                    <h5>Location:</h5>
                    <input type='text' value={location} onChange={e => setLocation(e.target.value)} />
                    <h5>Origin Price:</h5>
                    <input type='text' value={originPrice} onChange={e => setOriginPrice(e.target.value)} />
                    <h5>Notes:</h5>
                    <input type='text' value={notes} onChange={e => setNotes(e.target.value)} />
                    <button type='submit' className='login_signInButton'>Upload</button>
                </form>
            </div>
        </div>
    );
}

export default Upload;